import os
from typing import List, Dict, Any

import requests
from dotenv import load_dotenv

load_dotenv()

SERPER_ENDPOINT = "https://google.serper.dev/search"


class SerperConfigurationError(ValueError):
    """Raised when the Serper API is not properly configured."""


def search_serper(query: str, *, max_results: int = 3) -> List[Dict[str, Any]]:
    """
    Perform a Serper (Google) search for the provided query and return a subset of the results.

    Args:
        query: Text to search on the web.
        max_results: Maximum number of organic results to return.

    Returns:
        A list of dictionaries with title, snippet, and link keys.

    Raises:
        SerperConfigurationError: If the SERPER_API_KEY environment variable is missing.
        requests.HTTPError: When the Serper API returns an error status.
    """
    api_key = os.getenv("SERPER_API_KEY") or os.environ.get("SERPER_API_KEY")
    if not api_key:
        raise SerperConfigurationError("Serper API key is not configured.")

    payload = {"q": query}
    headers = {
        "X-API-KEY": api_key,
        "Content-Type": "application/json",
    }

    response = requests.post(SERPER_ENDPOINT, json=payload, headers=headers, timeout=15)
    response.raise_for_status()

    data = response.json()
    organic_results = data.get("organic", []) or []

    trimmed_results = []
    for item in organic_results[:max_results]:
        title = item.get("title")
        snippet = item.get("snippet")
        link = item.get("link")

        if not any((title, snippet, link)):
            continue

        trimmed_results.append(
            {
                "title": title or "",
                "snippet": snippet or "",
                "link": link or "",
            }
        )

    # If there were no organic results, try to surface knowledge graph summary when available.
    if not trimmed_results and data.get("knowledgeGraph"):
        kg = data["knowledgeGraph"]
        trimmed_results.append(
            {
                "title": kg.get("title", ""),
                "snippet": kg.get("description", ""),
                "link": kg.get("website", ""),
            }
        )

    return trimmed_results

