"""Core scraping logic: field extraction, search, pin details, boards."""

from __future__ import annotations

import concurrent.futures
import random
from urllib.parse import quote

import requests

from .config import BASE, BOARD_FEED_URL, BOARD_URL, PIN_URL, SEARCH_URL
from .http import api_data, polite_sleep
from .ui import err_console, make_progress


def _dig(obj, *path, default=None):
    """Safely walk nested dicts/lists."""
    cur = obj
    for key in path:
        if isinstance(cur, dict):
            cur = cur.get(key)
        elif isinstance(cur, list) and isinstance(key, int):
            cur = cur[key] if key < len(cur) else None
        else:
            cur = None
        if cur is None:
            return default
    return cur


def _best_image(images: dict) -> tuple[dict | None, dict]:
    """Return (largest image variant, all variants)."""
    if not isinstance(images, dict):
        return None, {}
    variants = {k: v for k, v in images.items()
                if isinstance(v, dict) and v.get("url")}
    if not variants:
        return None, {}
    ranked = sorted(variants.values(), key=lambda v: (v.get("width") or 0))
    return ranked[-1], variants


def extract_pin(raw: dict) -> dict | None:
    """Normalize a raw pin object into the metadata schema."""
    if not isinstance(raw, dict) or not raw.get("id"):
        return None
    if raw.get("type") not in (None, "pin"):
        return None  # skip boards/users mixed into results

    orig, variants = _best_image(raw.get("images") or {})
    videos = _dig(raw, "videos", "video_list", default={}) or {}
    video_url = None
    if isinstance(videos, dict) and videos:
        v_keys = sorted(k for k in videos if k.startswith("V_"))
        if v_keys:
            video_url = videos[v_keys[-1]].get("url")

    is_video = bool(raw.get("is_video")) or bool(video_url)
    if not orig and not is_video:
        return None

    agg = _dig(raw, "aggregated_pin_data", default={}) or {}
    creator = raw.get("creator") or raw.get("pinner") or {}
    board = raw.get("board") or {}
    pin_id = str(raw["id"])

    width = (orig or {}).get("width") or raw.get("image_width") or 0
    height = (orig or {}).get("height") or raw.get("image_height") or 0

    return {
        "pin_id": pin_id,
        "pin_url": f"{BASE}/pin/{pin_id}/",
        "title": raw.get("title") or raw.get("grid_title") or "",
        "description": raw.get("description") or "",
        "alt_text": raw.get("auto_alt_text")
                    or raw.get("closeup_unified_description") or "",
        "image_url": (orig or {}).get("url") or raw.get("image_large_url") or "",
        "width": width,
        "height": height,
        "aspect_ratio": round(width / height, 3) if width and height else None,
        "image_variants": {k: v.get("url") for k, v in variants.items()},
        "saves": _dig(agg, "aggregated_stats", "saves", default=None)
                 or raw.get("repin_count") or 0,
        "repin_count": raw.get("repin_count") or 0,
        "likes": raw.get("favorite_user_count")
                 or _dig(agg, "aggregated_stats", "done", default=0) or 0,
        "comments": agg.get("comment_count") or raw.get("comment_count") or 0,
        "creator_username": creator.get("username") or "",
        "creator_name": creator.get("full_name") or creator.get("username") or "",
        "creator_profile": (f"{BASE}/{creator['username']}/"
                            if creator.get("username") else ""),
        "board_name": board.get("name") or "",
        "board_url": (f"{BASE}{board['url']}" if board.get("url") else ""),
        "external_link": raw.get("link") or "",
        "domain": raw.get("domain") or "",
        "dominant_color": raw.get("dominant_color") or raw.get("color") or "",
        "created_at": raw.get("created_at") or "",
        "is_video": is_video,
        "video_url": video_url or "",
        "local_file": "",
    }


def search_pins(session: requests.Session, query: str, limit: int,
                delay: float = 1.0, save_cb=None, batch_size: int = 10,
                jitter: float = 0.5) -> list[dict]:
    """Search pins by keyword, paginating with bookmark cursors.

    save_cb(pins) is called every batch_size new items (incremental save).
    """
    pins, seen, bookmark = [], set(), None
    page, saved_count = 1, 0
    prog, task = make_progress(f"[cyan]Searching '{query}'", limit)
    with prog:
        while len(pins) < limit:
            options = {
                "query": query,
                "scope": "pins",
                "page_size": 25,
                "bookmarks": [bookmark] if bookmark else [],
                "redux_normalize_feed": True,
                "no_fetch_context_on_feed": False,
            }
            prog.update(task, description=f"[cyan]Search page {page}")
            data, bookmark = api_data(session, SEARCH_URL, options,
                                      f"/search/pins/?q={quote(query)}",
                                      handler="www/search/[scope].js")
            if not data:
                break
            items = data.get("results") if isinstance(data, dict) else data
            for raw in (items or []):
                pin = extract_pin(raw)
                if pin and pin["pin_id"] not in seen:
                    seen.add(pin["pin_id"])
                    pins.append(pin)
                    prog.update(task, advance=1)
                    if len(pins) >= limit:
                        break
            page += 1
            if save_cb:
                while len(pins) - saved_count >= batch_size:
                    save_cb(pins[:saved_count + batch_size])
                    saved_count += batch_size
            if not bookmark:
                break
            polite_sleep(delay, jitter)
        prog.update(task, description="[green]Search done")
    if save_cb and len(pins) > saved_count:
        save_cb(pins)
    return pins[:limit]


def get_pin_details(session: requests.Session, pin_id: str) -> dict | None:
    """Fetch a single pin's full detail object."""
    options = {"id": pin_id, "field_set_key": "detailed",
               "fetch_visual_search_objects": False}
    data, _ = api_data(session, PIN_URL, options, f"/pin/{pin_id}/",
                       handler="www/pin/[id].js")
    return data if isinstance(data, dict) else None


def enrich_pin(session: requests.Session, pin: dict) -> dict | None:
    """Fetch fresh details for one pin; returns updated pin or None."""
    raw = get_pin_details(session, pin["pin_id"])
    if not raw:
        return None
    fresh = extract_pin(raw)
    if fresh:
        fresh["local_file"] = pin.get("local_file", "")
        return fresh
    return None


def enrich_with_details(session: requests.Session, pins: list[dict],
                        delay: float = 1.0, workers: int = 1,
                        jitter: float = 0.5) -> None:
    """Refresh stats (saves/likes/comments) via PinResource, concurrently."""
    prog, task = make_progress("[magenta]Fetching pin details", len(pins))
    with prog:
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
            futs = {pool.submit(enrich_pin, session, pin): i
                    for i, pin in enumerate(pins)}
            for fut in concurrent.futures.as_completed(futs):
                i = futs[fut]
                prog.update(task, description=f"[magenta]Details: pin {pins[i]['pin_id']}")
                try:
                    fresh = fut.result()
                except Exception as e:  # noqa: BLE001
                    err_console.print(f"  pin {pins[i]['pin_id']}: {e}")
                    fresh = None
                if fresh:
                    pins[i] = fresh
                else:
                    err_console.print(f"  pin {pins[i]['pin_id']}: details unavailable")
                prog.update(task, advance=1)
                polite_sleep(delay / max(1, workers), jitter)


def board_pins(session: requests.Session, board_url: str, limit: int,
               delay: float = 1.0, save_cb=None, batch_size: int = 10,
               jitter: float = 0.5) -> list[dict]:
    """Scrape a board (https://www.pinterest.com/<user>/<slug>/).

    save_cb(pins) is called every batch_size new items (incremental save).
    """
    import re

    m = re.match(r"(?:https?://[^/]+)?/([^/]+)/([^/]+)/?", board_url.strip())
    if not m:
        raise SystemExit(f"Could not parse board URL: {board_url}")
    username, slug = m.group(1), m.group(2)

    options = {"username": username, "slug": slug, "field_set_key": "detailed"}
    board, _ = api_data(session, BOARD_URL, options, board_url,
                        handler=f"www/board/{username}/{slug}.js")
    board_id = (board or {}).get("id")
    if not board_id:
        raise SystemExit("Could not resolve board id — check the URL (must be a board).")
    from .ui import console
    console.print(f"  board: [bold]{(board or {}).get('name')}[/] (id {board_id})")

    pins, seen, bookmark = [], set(), None
    page, saved_count = 1, 0
    prog, task = make_progress("[cyan]Board feed", limit)
    with prog:
        while len(pins) < limit:
            options = {"board_id": board_id, "page_size": 25,
                       "bookmarks": [bookmark] if bookmark else [],
                       "redux_normalize_feed": True}
            prog.update(task, description=f"[cyan]Board feed page {page}")
            data, bookmark = api_data(session, BOARD_FEED_URL, options, board_url,
                                      handler=f"www/board/{username}/{slug}.js")
            if not data:
                break
            items = data.get("results") if isinstance(data, dict) else data
            for raw in (items or []):
                pin = extract_pin(raw)
                if pin and pin["pin_id"] not in seen:
                    seen.add(pin["pin_id"])
                    pins.append(pin)
                    prog.update(task, advance=1)
                    if len(pins) >= limit:
                        break
            page += 1
            if save_cb:
                while len(pins) - saved_count >= batch_size:
                    save_cb(pins[:saved_count + batch_size])
                    saved_count += batch_size
            if not bookmark:
                break
            polite_sleep(delay, jitter)
        prog.update(task, description="[green]Board done")
    if save_cb and len(pins) > saved_count:
        save_cb(pins)
    return pins[:limit]


def suggest_queries(session: requests.Session, term: str) -> list[str]:
    """Live search suggestions from Pinterest's advanced typeahead endpoint."""
    from .config import SUGGEST_URL

    term = term.strip()
    if not term:
        return []
    options = {"term": term, "pin_id": ""}
    data, _ = api_data(session, SUGGEST_URL, options, "/",
                       handler="www/[username].js")
    out: list[str] = []
    if isinstance(data, dict):
        for item in data.get("items", []) or []:
            if isinstance(item, dict):
                q = str(item.get("query") or item.get("label") or "").strip()
                if q and q.lower() not in {o.lower() for o in out}:
                    out.append(q)
    elif isinstance(data, list):
        for item in data:
            q = (item.get("query") if isinstance(item, dict) else str(item)).strip()
            if q and q.lower() not in {o.lower() for o in out}:
                out.append(q)
    return out[:8]
