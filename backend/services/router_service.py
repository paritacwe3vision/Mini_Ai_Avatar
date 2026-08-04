"""
router_service.py

Decides whether a user question requires
live internet information or not.
"""

LIVE_KEYWORDS = [

    # Time related
    "today",
    "latest",
    "current",
    "now",
    "recent",
    "breaking",

    # Weather
    "weather",
    "temperature",
    "rain",
    "forecast",

    # News
    "news",
    "headline",
    "politics",
    "political",

    # Finance
    "stock",
    "share price",
    "bitcoin",
    "crypto",
    "gold rate",
    "silver price",
    "market",

    # Sports
    "score",
    "match",
    "ipl",
    "football",
    "cricket",
    "fifa",
    "nba",

    # General live data
    "traffic",
    "flight",
    "earthquake",
    "election"
]


def needs_web_search(question: str) -> bool:

    question = question.lower()

    for keyword in LIVE_KEYWORDS:

        if keyword in question:
            return True

    return False