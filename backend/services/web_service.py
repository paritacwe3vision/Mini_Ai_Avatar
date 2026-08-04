"""
web_service.py

Handles live web search using Tavily.
"""

import os

from tavily import TavilyClient
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


client = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)


def search_web(query: str) -> str:

    response = client.search(

        query=query,

        search_depth="advanced",

        max_results=5,

        include_answer=True
    )

    answer = response.get("answer", "")

    results = response.get("results", [])

    text = ""

    if answer:

        text += f"Summary:\n{answer}\n\n"

    for item in results:

        text += f"Title: {item['title']}\n"

        text += f"Content: {item['content']}\n"

        text += f"URL: {item['url']}\n\n"

    return text