"""Concurrent image downloading with resumable files and live progress."""

from __future__ import annotations

import concurrent.futures
import random
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests

from .config import BASE
from .http import _pick_proxies, browser_headers
from .ui import err_console, make_progress


def download_image(session: requests.Session, pin: dict, out_dir: Path,
                   max_retries: int = 3) -> str:
    """Download one pin's image. Returns filename, 'EXISTS', or ''."""
    time.sleep(random.uniform(0, 0.4))  # small random stagger between workers
    url = pin["image_url"]
    # Upgrade sized URLs (736x etc.) to /originals/ for max quality.
    upgraded = re.sub(r"/(\d+x\d*|\d+x)/", "/originals/", url)
    candidates = [upgraded, url] if upgraded != url else [url]

    for existing in out_dir.glob(f"{pin['pin_id']}.*"):
        if existing.is_file() and existing.stat().st_size > 0:
            pin["local_file"] = existing.name
            return "EXISTS"

    for url in candidates:
        ext = Path(urlparse(url).path).suffix.lower() or ".jpg"
        filename = f"{pin['pin_id']}{ext}"
        dest = out_dir / filename
        if dest.exists() and dest.stat().st_size > 0:
            pin["local_file"] = filename
            return "EXISTS"
        for attempt in range(1, max_retries + 1):
            try:
                r = session.get(url, timeout=30, stream=True,
                                headers={**browser_headers(referer=f"{BASE}/"),
                                         "Accept": "image/*,*/*;q=0.8"},
                                proxies=_pick_proxies(session))
                if r.status_code == 200 and r.headers.get(
                        "Content-Type", "image").startswith("image"):
                    with open(dest, "wb") as f:
                        for chunk in r.iter_content(65536):
                            f.write(chunk)
                    pin["local_file"] = filename
                    return filename
            except requests.RequestException:
                pass
            time.sleep(1.5 * attempt)
    return ""


def download_all(session: requests.Session, pins: list[dict], out_dir: Path,
                 workers: int, min_width: int, min_height: int,
                 progress_cb=None) -> dict:
    """Download images concurrently with a live progress bar. Returns stats."""
    out_dir.mkdir(parents=True, exist_ok=True)
    stats = {"downloaded": 0, "skipped_existing": 0, "skipped_small": 0,
             "skipped_video": 0, "failed": 0}

    def apply(pin: dict, result: str) -> None:
        if result == "EXISTS":
            stats["skipped_existing"] += 1
        elif result == "SMALL":
            stats["skipped_small"] += 1
        elif result == "VIDEO":
            stats["skipped_video"] += 1
        elif result:
            stats["downloaded"] += 1
            pin["local_file"] = result
        else:
            stats["failed"] += 1

    prog, task = make_progress("[cyan]Downloading images", len(pins))
    with prog:
        futures = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
            for i, pin in enumerate(pins, 1):
                if pin["is_video"] and not pin["image_url"]:
                    apply(pin, "VIDEO")
                    prog.update(task, advance=1)
                    if progress_cb:
                        progress_cb(sum(stats.values()))
                    continue
                if pin["width"] and (pin["width"] < min_width
                                     or pin["height"] < min_height):
                    apply(pin, "SMALL")
                    prog.update(task, advance=1)
                    if progress_cb:
                        progress_cb(sum(stats.values()))
                    continue
                futures[pool.submit(download_image, session, pin, out_dir)] = pin

            for fut in concurrent.futures.as_completed(futures):
                pin = futures[fut]
                try:
                    apply(pin, fut.result())
                except Exception as e:  # noqa: BLE001
                    err_console.print(f"  pin {pin['pin_id']}: {e}")
                    apply(pin, "")
                prog.update(task, advance=1)
                if progress_cb:
                    progress_cb(sum(stats.values()))
        prog.update(task, description="[green]Downloads done")
    return stats
