import httpx
import os

from typing import List
from schemas import NewsArticleResponse

WORLD_NEWS_API_KEY = os.getenv("WORLD_NEWS_API_KEY")
WORLD_NEWS_API_BASE_URL = "https://api.worldnewsapi.com"
TOP_NEWS_ENDPOINT = f"{WORLD_NEWS_API_BASE_URL}/top-news"
SEARCH_NEWS_ENDPOINT = f"{WORLD_NEWS_API_BASE_URL}/search-news"

async def get_top_news(country: str = "fr", language: str = "fr") -> List[NewsArticleResponse]:
    """
    Récupère le top news depuis l'API World News.
    """
    if not WORLD_NEWS_API_KEY:
        raise ValueError("WORLD_NEWS_API_KEY is not set in environment variables.")


    url = TOP_NEWS_ENDPOINT
    params = {
        "api-key": WORLD_NEWS_API_KEY,
        "source-country": country,
        "language": language
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            print(f"An unexpected error occurred while fetching news: {str(e)}")
            return []

        simplified_articles = []
        
        for cluster in data.get("top_news", []):
            for article in cluster.get("news", []):
                title = article.get("title")
                summary = article.get("summary")
                if title or summary:
                    simplified_articles.append(
                        NewsArticleResponse(
                            title=title or "",
                            summary=summary or ""
                        )
                    )


        return simplified_articles

async def get_searched_news(query: str, country: str = "fr", language: str = "fr") -> List[NewsArticleResponse]:
    """
    Récupère les news depuis l'API World News.
    """
    if not WORLD_NEWS_API_KEY:
        print("Warning: WORLD_NEWS_API_KEY is missing.")
        return [] 

    url = SEARCH_NEWS_ENDPOINT
    params = {
        "api-key": WORLD_NEWS_API_KEY,
        "source-country": country,
        "language": language,
        "text": query,
        "number": 10
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            print(f"An unexpected error occurred while fetching news: {str(e)}")
            return []

        simplified_articles = []

        for article in data.get("news", []):
            title = article.get("title")
            summary = article.get("summary")
            if title or summary:
                simplified_articles.append(
                    NewsArticleResponse(
                        title=title or "",
                        summary=summary or ""
                    )
                )

        return simplified_articles

        