"""Command-line interface: subcommands, options, and interactive wizard."""

from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path

import requests

from . import __version__, config
from .config import BASE
from .dedupe import DedupeStore
from .downloader import download_all
from .http import build_session, polite_sleep
from .scraper import (board_pins, enrich_with_details, extract_pin,
                      get_pin_details, search_pins)
from .storage import save_outputs
from .ui import console, die, err_console, print_summary, banner


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="pinterest-scraper",
        description=("🎨 Scrape Pinterest: high-quality image URLs + metadata, "
                     "deduplicated, batch-saved, with random fingerprints."))
    p.add_argument("-V", "--version", action="version",
                   version=f"pinterest-scraper {config.__version__}")
    sub = p.add_subparsers(dest="mode")

    def common(sp):
        sp.add_argument("-n", "--limit", type=int, default=25, help="max pins")
        sp.add_argument("-o", "--out", default="output", help="output directory")
        sp.add_argument("--download", action="store_true", help="download images")
        sp.add_argument("--details", action="store_true",
                        help="fetch full details per pin (slower, richer stats)")
        sp.add_argument("--min-width", type=int, default=0, help="min image width")
        sp.add_argument("--min-height", type=int, default=0, help="min image height")
        sp.add_argument("--workers", type=int, default=4,
                        help="threads for downloads and detail fetching")
        sp.add_argument("--delay", type=float, default=1.0,
                        help="seconds between API pages (be polite: >= 1)")
        sp.add_argument("--jitter", type=float, default=0.5,
                        help="random extra seconds added to every delay (0=off)")
        sp.add_argument("--proxy", default="",
                        help="proxy or comma-separated list, e.g. "
                             "http://user:pass@host:port,http://host2:port")
        sp.add_argument("--timeout", type=int, default=20,
                        help="API request timeout in seconds")
        sp.add_argument("--batch-size", type=int, default=10,
                        help="save metadata to disk every N items")
        sp.add_argument("--no-dedup", action="store_true",
                        help="disable deduplication (re-scrape everything)")

    s1 = sub.add_parser("search", help="search by keyword, e.g. 'taylor swift'")
    common(s1)
    s1.add_argument("query")

    s2 = sub.add_parser("pin", help="one or more pin URLs/IDs")
    common(s2)
    s2.add_argument("pins", nargs="+")

    s3 = sub.add_parser("board", help="a board URL, e.g. .../user/board-name/")
    common(s3)
    s3.add_argument("url")

    sub.add_parser("interactive", help="guided interactive mode (default)")
    return p
