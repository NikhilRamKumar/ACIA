import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def fetch_page_html(url: str):
    """
    Fetch HTML content from a webpage.
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.text

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return None


def extract_blog_updates(blog_url: str, max_items: int = 5):
    """
    Extract blog/news article links from a competitor blog page.
    This is a generic scraper. It tries to collect article titles and URLs.
    """

    html = fetch_page_html(blog_url)

    if not html:
        return []

    soup = BeautifulSoup(html, "lxml")

    updates = []
    seen_urls = set()

    links = soup.find_all("a", href=True)

    for link in links:
        title = link.get_text(strip=True)
        href = link.get("href")

        if not title or not href:
            continue

        if len(title) < 15:
            continue

        full_url = urljoin(blog_url, href)

        if full_url in seen_urls:
            continue

        seen_urls.add(full_url)

        updates.append({
            "title": title,
            "url": full_url,
            "content": title,
            "source_type": "blog"
        })

        if len(updates) >= max_items:
            break

    return updates