"""Library usage: search pins and print high-quality image URLs."""

from pinterest_scraper.http import build_session
from pinterest_scraper.scraper import search_pins
from pinterest_scraper.storage import save_outputs
from pathlib import Path

session = build_session()
pins = search_pins(session, "Ana de Armas", limit=10)

for pin in pins:
    print(f"{pin['pin_id']}  {pin['width']}x{pin['height']}  saves={pin['saves']}\n  {pin['image_url']}")

save_outputs(pins, Path("output"), "taylor_swift")
