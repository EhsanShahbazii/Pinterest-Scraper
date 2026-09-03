# 🎨 Pinterest Scraper

> Scrape Pinterest with Python — high-quality pin images, full metadata,
> deduplicated & batch-saved, wrapped in a beautiful CLI.

[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Code style: rich CLI](https://img.shields.io/badge/UI-rich-ff69b4)](https://github.com/Textualize/rich)

`pinterest-scraper` talks to the same internal JSON resource endpoints the
Pinterest website uses, so you get **structured data — not scraped HTML**:
original-resolution image URLs, save/comment counts, creator & board info,
external links, dominant colors, video URLs and more. No login, no API key.

## ✨ Features

- 🔍 **Three modes** — keyword `search`, whole `board`, or specific `pin`(s)
- 🖼 **Best quality** — images auto-upgraded to Pinterest `originals` CDN URLs
- 📊 **Full metadata** — saves, repins, likes, comments, creator, board, link,
  domain, dominant color, created date, video URLs, all image-size variants
- 🧹 **Persistent dedup** — never downloads or stores a pin twice (survives
  restarts; self-heals from your own metadata files)
- 💾 **Batched saving** — metadata written to disk every N items (crash-safe),
  merge-safe JSON + CSV output
- ⚡ **Concurrent** — parallel detail-fetching and multi-threaded downloads
- 🥸 **Random fingerprints** — per-request user-agent / Accept-Language /
  Referer rotation, random delay jitter, optional proxy pool rotation
- 🚦 **Rate-limit aware** — HTTP 429 randomized cooldown, exponential backoff
- 🖥 **Gorgeous CLI** — rich banner, live progress bars, results table, and a
  fully guided interactive wizard
- ♻️ **Resumable** — existing files are skipped, not re-downloaded

## 📦 Install

```bash
git clone https://github.com/EhsanShahbazii/Pinterest-Scraper.git
cd Pinterest-Scraper
python3 -m venv .venv && source .venv/bin/activate
pip install .
```

Requires Python 3.10+. Dependencies: `requests`, `rich` (installed
automatically).

## 🚀 Quick start

```bash
# Guided wizard (also the default when you run the command with no args)
pinterest-scraper

# Search a singer and download images ≥600px wide
pinterest-scraper search "taylor swift" -n 25 --download --min-width 600

# Rich per-pin stats, fetched concurrently
pinterest-scraper search "ariana grande" -n 50 --download --details --workers 6

# Scrape a whole board
pinterest-scraper board "https://www.pinterest.com/SanSwift12/your-voice-can-calm-the-ocean/" -n 100 --download

# Fetch specific pins
pinterest-scraper pin 69524387998262863 --download

# Full power: proxies + jitter + batch saving
pinterest-scraper search "dua lipa" -n 100 --download --details \
  --workers 6 --delay 1 --jitter 0.8 --batch-size 10 \
  --proxy "http://p1:8080,http://p2:8080"
```

Or as a Python library:

```python
from pinterest_scraper.http import build_session
from pinterest_scraper.scraper import search_pins

session = build_session()
pins = search_pins(session, "taylor swift", limit=10)
print(pins[0]["image_url"], pins[0]["saves"])
```

## 🧭 Commands & options

| Command | Description |
|---|---|
| `pinterest-scraper` | interactive wizard (default) |
| `pinterest-scraper search <query>` | keyword search |
| `pinterest-scraper board <url>` | scrape a board |
| `pinterest-scraper pin <id-or-url>...` | specific pins |
| `pinterest-scraper --help / -V` | help / version |

| Option | Default | Description |
|---|---|---|
| `-n, --limit` | 25 | max pins |
| `-o, --out` | `output/` | output directory |
| `--download` | off | download images |
| `--details` | off | per-pin detail fetch (accurate stats) |
| `--min-width/--min-height` | 0 | resolution filter |
| `--workers` | 4 | concurrent threads (downloads + details) |
| `--delay` | 1.0 | seconds between API pages |
| `--jitter` | 0.5 | random extra seconds on every sleep |
| `--proxy` | — | proxy or comma-separated pool (rotated per request) |
| `--timeout` | 20 | API request timeout (s) |
| `--batch-size` | 10 | save metadata every N items |
| `--no-dedup` | off | disable deduplication |

## 📁 Output layout

```
output/
├── images/<pin_id>.jpg      # highest-quality originals
├── <query>.json             # full metadata (all image variants included)
├── <query>.csv              # flattened, spreadsheet-ready
└── .seen_pins.json          # dedup store (delete to re-scrape)
```

## 🛡 Anti-detection & ethics

Every request gets a fresh fingerprint: 6 browser user-agents, 5
Accept-Language variants, randomized referers, jittered delays, optional
proxy rotation, and a dedicated 429 cooldown with exponential backoff.

Please be a good citizen: public data only, keep `--delay ≥ 1`, and remember
images belong to their creators — don't republish without permission.

## 🧱 Project structure

```
src/pinterest_scraper/
├── cli.py          # argparse subcommands + interactive wizard
├── config.py       # endpoints, fingerprint pools, CSV schema
├── http.py         # session, retries, proxy rotation, API helpers
├── scraper.py      # search / board / pin-details / normalization
├── downloader.py   # concurrent resumable image downloads
├── dedupe.py       # persistent self-healing dedup store
├── storage.py      # merge-safe batched JSON/CSV persistence
└── ui.py           # rich banner, progress bars, summary table
```

## 🤝 Contributing

PRs welcome! `pip install -e .` for a dev install, then run
`pinterest-scraper --help` to verify.

## 📄 License

MIT — see [LICENSE](LICENSE).
