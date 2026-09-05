"""Web UI backend: FastAPI app that drives the scraper as background jobs.

Endpoints:
    GET  /                       -> web UI (index.html)
    GET  /api/health             -> liveness probe
    POST /api/scrape             -> start a scrape job, returns {job_id}
    GET  /api/jobs/{id}/events   -> Server-Sent Events with live progress
    GET  /api/jobs/{id}/result   -> final pins JSON when the job finishes
    POST /api/jobs/{id}/cancel   -> request cancellation
    GET  /api/jobs/{id}/images/{name} -> serve a downloaded image file
"""
from __future__ import annotations

import asyncio
import json
import time
import queue
import threading
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from ..dedupe import DedupeStore
from ..downloader import download_all
from ..http import build_session
from ..scraper import (board_pins, enrich_with_details, search_pins,
                       typeahead_suggestions)
from ..storage import save_outputs

STATIC_DIR = Path(__file__).parent / "static"


class ScrapeRequest(BaseModel):
    mode: str = Field(pattern="^(search|board)$")
    query: str = Field(min_length=1)
    limit: int = Field(default=25, ge=1, le=500)
    download: bool = True
    details: bool = True
    dedup: bool = True
    workers: int = Field(default=4, ge=1, le=16)
    delay: float = Field(default=1.0, ge=0, le=30)
    jitter: float = Field(default=0.5, ge=0, le=10)
    batch_size: int = Field(default=10, ge=1, le=100)
    min_width: int = Field(default=0, ge=0, le=10000)
    min_height: int = Field(default=0, ge=0, le=10000)
    proxy: str = ""


class Job:
    def __init__(self, req: ScrapeRequest, out_dir: Path):
        self.id = uuid.uuid4().hex[:12]
        self.req = req
        self.out_dir = out_dir
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.events: queue.Queue = queue.Queue()
        self.status = "queued"
        self.phase = ""
        self.pins: list[dict] = []
        self.stats: dict = {}
        self.error = ""
        self.cancelled = False
        self.done = threading.Event()

    def emit(self, **ev):
        self.events.put(json.dumps(ev, default=str, ensure_ascii=False))

    def cancel_requested(self):
        return self.cancelled

    def _check_cancel(self):
        if self.cancelled:
            raise RuntimeError("cancelled by user")

    def run(self):
        try:
            self._run()
            self.status = "cancelled" if self.cancelled else "finished"
        except Exception as e:  # noqa: BLE001
            self.status = "cancelled" if "cancelled" in str(e) else "error"
            if self.status == "error":
                self.error = str(e)
        self.done.set()
        self.emit(event="done", status=self.status, error=self.error,
                  total=len(self.pins), stats=self.stats)

    def _run(self):
        req = self.req
        session = build_session(
            proxy_pool=[p.strip() for p in req.proxy.split(",") if p.strip()] or None)
        store = (DedupeStore(self.out_dir / ".seen_pins.json", scan_dir=self.out_dir)
                 if req.dedup else None)
        self.emit(event="phase", phase="collect", message="Collecting pins")

        stem = (req.query or "pins").strip().replace(" ", "_")[:40] or "pins"

        def batch_save(partial: list[dict]) -> None:
            self._check_cancel()
            new = [p for p in partial if p["pin_id"] not in
                   {q["pin_id"] for q in self.pins}]
            if store:
                new = store.filter(new)
            self.pins.extend(new)
            self.emit(event="progress", phase="collect", count=len(self.pins))
            save_outputs(self.pins, self.out_dir, stem)  # batch-safe on-disk save

        if req.mode == "board":
            pins = board_pins(session, req.query, req.limit,
                              delay=req.delay, save_cb=batch_save,
                              batch_size=req.batch_size, jitter=req.jitter)
        else:
            pins = search_pins(session, req.query, req.limit,
                               delay=req.delay, save_cb=batch_save,
                               batch_size=req.batch_size, jitter=req.jitter)
        self._check_cancel()

        if store:
            before = len(pins)
            pins = store.filter(pins)
            self.emit(event="dedup", duplicates=before - len(pins))
        if not pins:
            self.emit(event="nothing_new", total=0)
            return

        if req.details:
            self.emit(event="phase", phase="details", total=len(pins))
            enrich_with_details(session, pins, delay=req.delay,
                                workers=req.workers, jitter=req.jitter)
            self._check_cancel()

        if req.download:
            self.emit(event="phase", phase="download", total=len(pins))
            from ..downloader import download_all
            self.stats = download_all(session, pins, self.out_dir / "images",
                                      req.workers, req.min_width, req.min_height)
            self._check_cancel()

        summary = save_outputs(pins, self.out_dir, stem)
        if store:
            store.add(pins)
            store.save()
        self.pins = pins
        self.emit(event="saved", json_file=summary.get("json", ""),
                  csv_file=summary.get("csv", ""))


JOBS: dict[str, Job] = {}


def _job_out_dir() -> Path:
    root = Path("web_output")
    root.mkdir(exist_ok=True)
    return root


app = FastAPI(title="Pinterest Scraper Web")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/scrape")
def start_scrape(req: ScrapeRequest):
    job = Job(req, _job_out_dir())
    JOBS[job.id] = job
    threading.Thread(target=job.run, daemon=True).start()
    return {"job_id": job.id}


@app.get("/api/jobs/{job_id}/events")
async def job_events(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "unknown job")

    async def gen():
        loop = asyncio.get_running_loop()
        while True:
            try:
                ev = await asyncio.wait_for(
                    loop.run_in_executor(None, job.events.get, True, 0.2), 5)
                yield f"data: {ev}\n\n"
                if json.loads(ev).get("event") == "done":
                    return
            except (queue.Empty, asyncio.TimeoutError):
                if job.done.is_set() and job.events.empty():
                    return
                yield ": keepalive\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache"})


@app.get("/api/jobs/{job_id}/result")
def job_result(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "unknown job")
    if not job.done.is_set():
        raise HTTPException(409, "job still running")
    return {"status": job.status, "stats": job.stats, "error": job.error,
            "pins": job.pins}


@app.post("/api/jobs/{job_id}/cancel")
def cancel_job(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "unknown job")
    job.cancelled = True
    return {"ok": True}


@app.get("/api/jobs/{job_id}/images/{name}")
def job_image(job_id: str, name: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "unknown job")
    path = (job.out_dir / "images" / name).resolve()
    if not str(path).startswith(str((job.out_dir).resolve())) or not path.is_file():
        raise HTTPException(404, "not found")
    return FileResponse(path)



# --- live search suggestions (cached, coalesced) ---
_SUGGEST_TTL = 300  # seconds
_suggest_cache: dict[str, tuple[float, list[str]]] = {}
_suggest_locks: dict[str, threading.Lock] = {}
_suggest_locks_guard = threading.Lock()


@app.get("/api/suggest")
def suggest(q: str = ""):
    q = q.strip().lower()
    if len(q) < 2:
        return {"suggestions": []}
    now = time.monotonic()
    hit = _suggest_cache.get(q)
    if hit and now - hit[0] < _SUGGEST_TTL:
        return {"suggestions": hit[1]}
    with _suggest_locks_guard:
        lock = _suggest_locks.setdefault(q, threading.Lock())
    with lock:  # coalesce concurrent identical requests
        now = time.monotonic()
        hit = _suggest_cache.get(q)
        if hit and now - hit[0] < _SUGGEST_TTL:
            return {"suggestions": hit[1]}
        try:
            session = build_session()
            out = typeahead_suggestions(session, q)
        except Exception:  # noqa: BLE001 — suggestions must never break the UI
            out = []
        _suggest_cache[q] = (now, out)
        if len(_suggest_cache) > 200:  # simple size cap
            oldest = sorted(_suggest_cache, key=lambda k: _suggest_cache[k][0])
            for k in oldest[:100]:
                _suggest_cache.pop(k, None)
        return {"suggestions": out}


def main():
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")


if __name__ == "__main__":
    main()
