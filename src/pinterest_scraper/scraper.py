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
