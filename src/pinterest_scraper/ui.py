"""Rich-based terminal UI: console, banners, progress bars, summary table."""

from __future__ import annotations

import sys

from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.progress import (BarColumn, MofNCompleteColumn, SpinnerColumn,
                           TextColumn, TimeElapsedColumn)
from rich.table import Table

console = Console()
err_console = Console(stderr=True, style="bold red")


def banner(mode: str, limit: int, dedup: bool, download: bool,
           workers: int, delay: float, jitter: float, proxies: int) -> None:
    """Print the start-of-run banner panel."""
    console.print(Panel.fit(
        "[bold magenta]Pinterest Scraper[/] :artist_palette:\n"
        f"[cyan]mode:[/] {mode}   [cyan]limit:[/] {limit}   "
        f"[cyan]dedup:[/] {'off' if not dedup else 'on'}   "
        f"[cyan]download:[/] {download}\n"
        f"[cyan]workers:[/] {workers}   [cyan]delay:[/] {delay}s "
        f"(± {jitter}s jitter)   "
        f"[cyan]proxies:[/] {proxies if proxies else 'none'}",
        border_style="magenta"))


def make_progress(desc: str, total: int) -> tuple[Progress, object]:
    """Create a standard spinner+bar progress task."""
    prog = Progress(SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    BarColumn(), MofNCompleteColumn(), TimeElapsedColumn(),
                    console=console)
    task = prog.add_task(desc, total=total)
    return prog, task


def print_summary(stem: str, stats: dict | None, dedupe, saved: dict) -> None:
    """Pretty end-of-run summary table."""
    table = Table(title=f"Results — {stem}", box=box.ROUNDED,
                  header_style="bold magenta")
    table.add_column("metric", style="cyan")
    table.add_column("value", style="green", justify="right")
    table.add_column("metric", style="cyan")
    table.add_column("value", style="green", justify="right")
    table.add_row("new pins collected", str(dedupe.new_pins),
                  "duplicates skipped", str(dedupe.dup_pins))
    if stats:
        table.add_row("images downloaded", str(stats["downloaded"]),
                      "already on disk", str(stats["skipped_existing"]))
        table.add_row("below min size", str(stats["skipped_small"]),
                      "video-only", str(stats["skipped_video"]))
        table.add_row("failed downloads", str(stats["failed"]), "", "")
    table.add_row("total rows in metadata", str(saved["total"]), "", "")
    console.print(table)
    console.print(f"  [dim]metadata:[/] {saved['json']}")
    console.print(f"  [dim]          {saved['csv']}")


def die(msg: str, code: int = 1) -> None:
    err_console.print(msg)
    sys.exit(code)
