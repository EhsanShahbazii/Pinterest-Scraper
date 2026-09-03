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


def ask(prompt: str, default=""):
    val = input(f"{prompt} [{default}]: ").strip()
    return val or default


def ask_bool(prompt: str, default: bool = False) -> bool:
    d = "Y/n" if default else "y/N"
    return input(f"{prompt} [{d}]: ").strip().lower() in ("y", "yes", "") if default \
        else input(f"{prompt} [{d}]: ").strip().lower() in ("y", "yes")


def ask_int(prompt: str, default: int) -> int:
    try:
        return int(ask(prompt, str(default)))
    except ValueError:
        return default


def interactive() -> argparse.Namespace:
    """Guided wizard that builds the same args as the CLI flags."""
    console.print("[bold magenta]🎨 Pinterest Scraper — Interactive Mode[/]")
    console.print("[dim]Press Enter to accept the [default] value.\n[/]")

    console.print("[bold]What do you want to scrape?[/]")
    console.print("  [cyan]1.[/] Keyword search  (e.g. 'taylor swift')")
    console.print("  [cyan]2.[/] A board URL      (e.g. .../user/board-name/)")
    console.print("  [cyan]3.[/] Specific pin(s)  (IDs or URLs)")
    choice = ask("Choose 1/2/3", "1")

    mode = {"1": "search", "2": "board", "3": "pin"}.get(choice, "search")
    ns = build_parser().parse_args([mode])

    if mode == "search":
        ns.query = ask("Keyword to search", "taylor swift")
    elif mode == "board":
        ns.url = ask("Board URL", "https://www.pinterest.com/SanSwift12/your-voice-can-calm-the-ocean/")
    else:
        refs = ask("Pin ID(s)/URL(s), comma-separated", "").split(",")
        ns.pins = [r.strip() for r in refs if r.strip()]

    ns.limit = ask_int("Max pins", 25)
    ns.download = ask_bool("Download images?", True)
    ns.details = ask_bool("Fetch full details (accurate saves/comments)?", False)
    ns.min_width = ask_int("Minimum image width (0 = any)", 0)
    ns.min_height = ask_int("Minimum image height (0 = any)", 0)
    ns.workers = ask_int("Concurrent workers", 4)
    ns.delay = float(ask("Delay between API pages (seconds)", "1.0"))
    ns.jitter = float(ask("Random jitter on delays (seconds)", "0.5"))
    ns.batch_size = ask_int("Save metadata every N items", 10)
    ns.out = ask("Output directory", "output")
    ns.proxy = ask("Proxy or comma-separated proxies (blank = none)", "")
    ns.no_dedup = not ask_bool("Skip already-seen pins (dedup)?", True)
    return ns
