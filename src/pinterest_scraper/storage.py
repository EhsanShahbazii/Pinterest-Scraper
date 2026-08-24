"""Metadata persistence: batched, merge-safe JSON + CSV output."""

from __future__ import annotations

import csv
import json
from pathlib import Path

from .config import CSV_COLUMNS
from .ui import console


def save_outputs(pins: list[dict], out_dir: Path, stem: str) -> dict:
    """Write metadata, merging with any existing files (no duplicates).

    Existing rows with the same pin_id are replaced by the newer data, so
    repeated batch saves keep files consistent and duplicate-free.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / f"{stem}.json"
    csv_path = out_dir / f"{stem}.csv"

    merged: dict[str, dict] = {}
    if json_path.exists():
        try:
            content = json.loads(json_path.read_text(encoding="utf-8"))
            if isinstance(content, list):
                for old in content:
                    if isinstance(old, dict) and old.get("pin_id"):
                        merged[str(old["pin_id"])] = old
        except (ValueError, OSError, TypeError):
            console.print("[yellow]! existing JSON unreadable — overwriting[/]")
    for pin in pins:
        if pin.get("pin_id"):
            merged[str(pin["pin_id"])] = pin

    final = list(merged.values())
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(final)
    return {"json": json_path, "csv": csv_path, "total": len(final)}
