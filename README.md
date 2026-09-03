# Pinterest Scraper

Scrape Pinterest pins in Python: search by keyword (e.g. singers like "Taylor
Swift"), collect **all available metadata**, and download the **highest-quality
image** (Pinterest `originals` CDN URL) for each pin. Only uses the Python
standard library + `requests`.

## How it works

It calls the same internal JSON resource endpoints the Pinterest website uses:

| Endpoint | Purpose |
|---|---|
| `resource/BaseSearchResource/get/` | keyword search, paginated via bookmark cursors |
| `resource/PinResource/get/` | full details of one pin (accurate saves/comments) |
| `resource/BoardResource/get/` + `resource/BoardFeedResource/get/` | scrape a whole board |

Per-pin data collected: pin ID & URL, title, description, alt text, **original
image URL** (+ all size variants, width/height/aspect ratio), save count,
repin count, comment count, creator (username, name, profile URL), board name
& URL, external link & domain, dominant color, created date, video flag/URL.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Usage

```bash
# Search for a singer and download 25 images (>=600px wide) + metadata
.venv/bin/python pinterest_scraper.py search "taylor swift" -n 25 --download --min-width 600

# Slower + richer per-pin stats (saves/comments from the pin page itself)
.venv/bin/python pinterest_scraper.py search "ariana grande" -n 50 --download --details --delay 1.5

# Just metadata, no downloads
.venv/bin/python pinterest_scraper.py search "billie eilish" -n 10

# Scrape a specific pin or board
.venv/bin/python pinterest_scraper.py pin 69524387998262863 --download
.venv/bin/python pinterest_scraper.py board "https://www.pinterest.com/SanSwift12/your-voice-can-calm-the-ocean/" -n 100 --download
```

Options: `-n/--limit`, `-o/--out` (default `output/`), `--download`,
`--details`, `--min-width`, `--min-height`, `--workers` (download threads,
default 4), `--delay` (seconds between API pages, default 1),
`--no-dedup` (disable deduplication).

Options: `-n/--limit`, `-o/--out` (default `output/`), `--download`,
`--details`, `--min-width`, `--min-height`, `--workers` (threads for downloads
*and* detail-fetching, default 4), `--delay` (seconds between API pages,
default 1), `--jitter` (random extra seconds on every sleep, default 0.5),
`--proxy` (one or comma-separated proxies, rotated randomly per request),
`--timeout` (API request timeout, default 20s),
`--batch-size` (save metadata every N items, default 10),
`--no-dedup` (disable deduplication).

## Anti-detection features

- **Random user-agent rotation**: every API request and every image download
  gets a fresh random fingerprint — 6 browser user-agents (Chrome/Firefox,
  macOS/Windows/Linux), 5 Accept-Language variants, and randomized Referers.
- **Random small delays**: all sleeps are randomized — `delay` plus up to
  `--jitter` seconds (page pauses, per-worker stagger before downloads,
  detail-fetch pacing). Downloads also get a small random stagger so bursts
  don't look robotic.
- **Proxy rotation**: pass `--proxy "http://p1:port,http://p2:port"` and each
  request picks a random proxy from the pool.
- **Rate-limit handling**: HTTP 429 triggers an extra randomized cooldown,
  with exponential backoff on retries (403/5xx handled too).
- **Concurrency**: `--workers` runs detail-fetching and image downloads in
  parallel thread pools.

## Batched saving (crash-safe)

- Metadata is written to disk incrementally: every `--batch-size` (default 10)
  new items, the collected pins are merged into `<stem>.json` / `<stem>.csv`
  and saved. If the script is interrupted, everything up to the last batch is
  already on disk.
- Each save **merges** with existing rows (replacing by `pin_id`), so files
  never contain duplicates, and later runs refresh stats of known pins.
- The dedup store also self-heals: on startup it scans existing metadata
  files in the output dir, so even if `.seen_pins.json` is deleted, pins
  already in your JSON/CSV are never re-collected or re-downloaded.

## Deduplication (always on)

- A persistent store at `<out>/.seen_pins.json` remembers every pin ID and
  image URL ever collected — re-running the same or overlapping searches
  skips known pins automatically (no duplicate downloads, no duplicate
  metadata rows). Existing metadata files are also scanned on startup, so
  batch-saved data from crashed runs is never re-collected either.
- Within a run, duplicates by pin ID and by image URL are also filtered.
- Downloads skip files already on disk; metadata files are merged into the
  existing JSON/CSV without duplicating rows.
- The end-of-run summary shows exactly how many duplicates were skipped.

## UI

The CLI uses [`rich`](https://github.com/Textualize/rich): a banner panel,
live progress bars for search / detail-fetch / downloads, and a rounded
results table with download stats.

**Output** — in the output dir:

- `images/<pin_id>.jpg` — highest-quality original images
- `<query>.json` — full metadata (including all image-variant URLs)
- `<query>.csv` — flattened metadata for spreadsheets
- `.seen_pins.json` — dedup store (delete it to re-scrape everything)

Downloads are resumable (existing files are skipped) and images smaller than
`--min-width`/`--min-height` are filtered out. Sized image URLs (`736x`, …)
are automatically upgraded to `/originals/`.

## Notes & ethics

- Works with public/logged-out data only; no account or credentials needed.
- Keep `--delay >= 1` to avoid rate limiting (HTTP 403/429 = slow down).
- Pinterest may change its internal endpoints; if requests start failing,
  compare with what the website sends in DevTools (Network tab).
- Images are copyrighted by their creators — don't republish without
  permission. Scraping public data for personal analysis is generally low-risk
  (see *hiQ v. LinkedIn*), but this is not legal advice.
