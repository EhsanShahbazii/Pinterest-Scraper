"""Central configuration: endpoints, fingerprints, and schema constants."""

BASE = "https://www.pinterest.com"
SEARCH_URL = f"{BASE}/resource/BaseSearchResource/get/"
PIN_URL = f"{BASE}/resource/PinResource/get/"
BOARD_URL = f"{BASE}/resource/BoardResource/get/"
SUGGEST_URL = f"{BASE}/resource/AdvancedTypeaheadResource/get/"
BOARD_FEED_URL = f"{BASE}/resource/BoardFeedResource/get/"

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
]

ACCEPT_LANGS = [
    "en-US,en;q=0.9", "en-GB,en;q=0.8", "en-US,en;q=0.9,de;q=0.7",
    "en-US,en;q=0.8,es;q=0.6", "en-US,en;q=0.9,fr;q=0.6",
]

REFERERS = [
    "https://www.pinterest.com/", "https://www.pinterest.com/search/pins/",
    "https://www.pinterest.com/ideas/", "https://www.google.com/",
]

CSV_COLUMNS = [
    "pin_id", "pin_url", "title", "description", "alt_text",
    "image_url", "width", "height", "aspect_ratio",
    "saves", "repin_count", "likes", "comments",
    "creator_username", "creator_name", "creator_profile",
    "board_name", "board_url",
    "external_link", "domain", "dominant_color", "created_at",
    "is_video", "video_url", "local_file",
]

__version__ = "1.0.0"
