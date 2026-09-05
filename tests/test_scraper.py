"""Unit tests for pinterest_scraper."""

import json
import tempfile
import unittest
from pathlib import Path

from pinterest_scraper.config import __version__
from pinterest_scraper.dedupe import DedupeStore
from pinterest_scraper.downloader import download_all, download_image
from pinterest_scraper.scraper import _best_image, extract_pin
from pinterest_scraper.storage import save_outputs
from pinterest_scraper.web.server import Job, ScrapeRequest


class TestScraperCore(unittest.TestCase):
    def test_version(self):
        self.assertEqual(__version__, "1.3.0")

    def test_extract_pin_valid(self):
        raw = {
            "id": 123456789,
            "type": "pin",
            "title": "Test Pin",
            "description": "A test description",
            "images": {
                "236x": {"url": "https://i.pinimg.com/236x/abc.jpg", "width": 236, "height": 300},
                "736x": {"url": "https://i.pinimg.com/736x/abc.jpg", "width": 736, "height": 935},
            },
            "creator": {"username": "photographer", "full_name": "Photo Pro"},
            "board": {"name": "Inspiration", "url": "/photographer/inspiration/"},
            "repin_count": 42,
        }
        pin = extract_pin(raw)
        self.assertIsNotNone(pin)
        self.assertEqual(pin["pin_id"], "123456789")
        self.assertEqual(pin["title"], "Test Pin")
        self.assertEqual(pin["width"], 736)
        self.assertEqual(pin["height"], 935)
        self.assertEqual(pin["creator_username"], "photographer")
        self.assertEqual(pin["board_name"], "Inspiration")
        self.assertEqual(pin["saves"], 42)
        self.assertAlmostEqual(pin["aspect_ratio"], 0.787, places=2)

    def test_extract_pin_skips_non_pins(self):
        self.assertIsNone(extract_pin({"id": 1, "type": "board"}))
        self.assertIsNone(extract_pin({"id": 2, "type": "user"}))
        self.assertIsNone(extract_pin({}))

    def test_best_image_empty(self):
        largest, variants = _best_image({})
        self.assertIsNone(largest)
        self.assertEqual(variants, {})


class TestStorageAndDedupe(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.out_dir = Path(self.tmp_dir.name)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_dedupe_store(self):
        store_path = self.out_dir / ".seen_pins.json"
        store = DedupeStore(store_path, enabled=True)
        pins = [
            {"pin_id": "1", "image_url": "https://example.com/1.jpg"},
            {"pin_id": "2", "image_url": "https://example.com/2.jpg"},
            {"pin_id": "1", "image_url": "https://example.com/1.jpg"},
        ]
        filtered = store.filter(pins)
        self.assertEqual(len(filtered), 2)
        store.add(filtered)
        store.save()

        # Reload store and verify persistence
        new_store = DedupeStore(store_path, enabled=True)
        self.assertIn("1", new_store.pin_ids)
        self.assertIn("2", new_store.pin_ids)
        second_filter = new_store.filter(pins)
        self.assertEqual(len(second_filter), 0)

    def test_save_outputs(self):
        pins = [
            {"pin_id": "100", "title": "Pin 100", "saves": 10},
            {"pin_id": "200", "title": "Pin 200", "saves": 20},
        ]
        res = save_outputs(pins, self.out_dir, "test_job")
        self.assertTrue(res["json"].exists())
        self.assertTrue(res["csv"].exists())
        self.assertEqual(res["total"], 2)

        # Merge with updated data
        updated_pins = [
            {"pin_id": "100", "title": "Pin 100 Updated", "saves": 15},
            {"pin_id": "300", "title": "Pin 300", "saves": 30},
        ]
        res2 = save_outputs(updated_pins, self.out_dir, "test_job")
        self.assertEqual(res2["total"], 3)
        data = json.loads(res2["json"].read_text(encoding="utf-8"))
        p100 = next(p for p in data if p["pin_id"] == "100")
        self.assertEqual(p100["title"], "Pin 100 Updated")


class TestDownloader(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.out_dir = Path(self.tmp_dir.name)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_existing_image_sets_local_file(self):
        # Pre-create image file
        existing_file = self.out_dir / "999.jpg"
        existing_file.write_bytes(b"fake image data")

        pin = {"pin_id": "999", "image_url": "https://example.com/999.jpg", "local_file": ""}
        import requests
        session = requests.Session()
        res = download_image(session, pin, self.out_dir)
        self.assertEqual(res, "EXISTS")
        self.assertEqual(pin["local_file"], "999.jpg")


class TestWebJob(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.out_dir = Path(self.tmp_dir.name)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_scrape_request_ignores_extra(self):
        req = ScrapeRequest(mode="search", query="cat", show_insights=True, lang="en")
        self.assertEqual(req.query, "cat")
        self.assertEqual(req.mode, "search")

    def test_job_does_not_crash_on_store(self):
        req = ScrapeRequest(mode="search", query="test", limit=2, download=False, details=False, dedup=False)
        job = Job(req, self.out_dir)
        # Mock search_pins to return test data without network
        import pinterest_scraper.web.server as srv
        original_search = srv.search_pins
        try:
            srv.search_pins = lambda session, query, limit, **kw: [
                {"pin_id": "p1", "image_url": "https://example.com/p1.jpg", "local_file": ""},
                {"pin_id": "p2", "image_url": "https://example.com/p2.jpg", "local_file": ""},
            ]
            job._run()
            self.assertEqual(len(job.pins), 2)
            self.assertEqual(job.error, "")
        finally:
            srv.search_pins = original_search

    def test_board_pins_invalid_url_raises_value_error(self):
        from pinterest_scraper.scraper import board_pins
        import requests
        session = requests.Session()
        with self.assertRaises(ValueError):
            board_pins(session, "invalid_url_without_user_and_slug", 10)

    def test_xlsx_response(self):
        from pinterest_scraper.web.server import _xlsx_response
        pins = [{"pin_id": "1", "title": "Pin One", "saves": 100}]
        resp = _xlsx_response(pins)
        self.assertEqual(resp.media_type, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    def test_zip_response(self):
        from pinterest_scraper.web.server import _zip_response
        pins = [{"pin_id": "1", "local_file": "1.jpg"}]
        resp = _zip_response(pins)
        self.assertEqual(resp.media_type, "application/zip")


if __name__ == "__main__":
    unittest.main()
