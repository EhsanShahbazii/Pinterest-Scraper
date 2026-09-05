"""Persistent deduplication of pins across runs."""

from __future__ import annotations

import json
from pathlib import Path

from .ui import console


class DedupeStore:
    """Persistent set of pin IDs + image URLs seen in previous runs.

    Also self-heals: on startup it scans existing metadata files in the
    output dir, so data saved by a crashed run is never re-collected.
    """

    def __init__(self, path: Path, enabled: bool = True,
                 scan_dir: Path | None = None):
        self.path = path
        self.enabled = enabled
        self.pin_ids: set[str] = set()
        self.image_urls: set[str] = set()
        self.new_pins = 0
        self.dup_pins = 0
        if enabled and path.exists():
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                self.pin_ids = set(data.get("pin_ids", []))
                self.image_urls = set(data.get("image_urls", []))
            except (ValueError, OSError, TypeError):
                console.print("[yellow]! dedupe store unreadable — starting fresh[/]")
        if enabled and scan_dir and scan_dir.exists():
            for jf in scan_dir.glob("*.json"):
                if jf.name == path.name:
                    continue
                try:
                    items = json.loads(jf.read_text(encoding="utf-8"))
                    if isinstance(items, list):
                        for old in items:
                            if isinstance(old, dict):
                                pid = str(old.get("pin_id") or "")
                                if pid:
                                    self.pin_ids.add(pid)
                                url = (old.get("image_url") or "").split("?")[0]
                                if url:
                                    self.image_urls.add(url)
                except (ValueError, OSError, TypeError):
                    pass

    def filter(self, pins: list[dict]) -> list[dict]:
        """Keep only pins not seen before (by pin_id and image_url)."""
        if not self.enabled:
            self.new_pins = len(pins)
            return pins
        out, seen_here = [], set()
        for pin in pins:
            key_url = (pin.get("image_url") or "").split("?")[0]
            if pin["pin_id"] in self.pin_ids or pin["pin_id"] in seen_here \
                    or (key_url and key_url in self.image_urls):
                self.dup_pins += 1
                continue
            seen_here.add(pin["pin_id"])
            out.append(pin)
        self.new_pins = len(out)
        return out

    def add(self, pins: list[dict]) -> None:
        if not self.enabled:
            return
        for pin in pins:
            self.pin_ids.add(pin["pin_id"])
            if pin.get("image_url"):
                self.image_urls.add(pin["image_url"].split("?")[0])

    def save(self) -> None:
        if not self.enabled:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps({
            "pin_ids": sorted(self.pin_ids),
            "image_urls": sorted(self.image_urls),
        }), encoding="utf-8")
