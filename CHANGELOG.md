# Changelog

## 1.0.0 (2026-09-03)

### Features
- Keyword search, board scraping, and single-pin details via Pinterest's
  internal JSON resource endpoints (no login required).
- Highest-quality `originals` image URLs + full metadata (saves, comments,
  creator, board, external link, colors, video URLs).
- Persistent deduplication (`pin_id` + image URL) with self-healing from
  existing metadata files.
- Batched, merge-safe metadata persistence (JSON + CSV).
- Concurrent downloads and detail fetching (`--workers`).
- Random per-request fingerprints: user-agent, Accept-Language, Referer.
- Random delay jitter (`--jitter`), proxy rotation (`--proxy`), 429 cooldown.
- Rich CLI: banner, live progress bars, results table, interactive wizard.
