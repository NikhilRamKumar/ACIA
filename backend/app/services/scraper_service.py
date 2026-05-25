import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


# Standard headers for web requests
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    )
}

# File extensions to skip
SKIP_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',  # Images
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',  # Documents
    '.zip', '.exe', '.iso', '.dmg'  # Archives
}

# URL schemes to skip
SKIP_SCHEMES = {'mailto', 'tel', 'javascript', 'ftp', 'data'}


def is_valid_article_url(url: str) -> bool:
    """
    Check if a URL is a valid article link.
    
    Returns False for:
    - Empty URLs
    - mailto:, tel:, javascript:, etc.
    - Fragment-only URLs (#)
    - Non-HTTP(S) URLs
    - Image/document files
    - Duplicate paths like /hub/hub/
    
    Args:
        url: URL to validate
    
    Returns:
        True if URL is valid, False otherwise
    """
    
    if not url or not isinstance(url, str):
        return False
    
    url = url.strip()
    
    # Skip empty URLs
    if not url or url == '#':
        return False
    
    # Skip fragment-only URLs
    if url.startswith('#'):
        return False
    
    try:
        parsed = urlparse(url)
        
        # Only allow HTTP and HTTPS
        if parsed.scheme not in {'http', 'https'}:
            return False
        
        # Must have a netloc (domain)
        if not parsed.netloc:
            return False
        
        # Get the path and check for skip extensions
        path = parsed.path.lower()
        
        for ext in SKIP_EXTENSIONS:
            if path.endswith(ext):
                return False
        
        # Skip duplicate path segments like /hub/hub/
        path_parts = [p for p in path.split('/') if p]
        if len(path_parts) >= 2:
            for i in range(len(path_parts) - 1):
                if path_parts[i] == path_parts[i + 1]:
                    return False
        
        # Skip obvious social/share links
        social_indicators = {'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 
                            'youtube.com', 'pinterest.com', 'reddit.com', 'x.com',
                            'share', 'tweet', 'like', 'follow', 'subscribe'}
        
        url_lower = url.lower()
        for indicator in social_indicators:
            if indicator in url_lower:
                return False
        
        return True
    
    except Exception:
        return False


def fetch_page_html(url: str, timeout: int = 8):
    """
    Fetch HTML content from a webpage with strict timeout.
    
    Args:
        url: URL to fetch
        timeout: Request timeout in seconds (default 8 seconds)
    
    Returns:
        HTML content as string, or None on error
    """

    try:
        response = requests.get(
            url, 
            headers=HEADERS, 
            timeout=timeout,
            allow_redirects=True
        )
        
        # Handle HTTP errors gracefully
        if response.status_code >= 400:
            print(f"HTTP {response.status_code} fetching {url}")
            return None
        
        return response.text

    except requests.exceptions.Timeout:
        print(f"Timeout fetching {url} (timeout={timeout}s)")
        return None
    except requests.exceptions.ConnectionError:
        print(f"Connection error fetching {url}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {type(e).__name__}")
        return None
    except Exception as e:
        print(f"Unexpected error fetching {url}: {e}")
        return None


def fetch_article_content(article_url: str, fallback_title: str = None, max_length: int = 5000, timeout: int = 6):
    """
    Fetch and extract full article content from a given URL.
    
    Strategy:
    1. Try to extract from <article> tag
    2. Fall back to <main> tag
    3. Fall back to collecting <p> tags
    4. Clean and join paragraphs
    5. Limit content length
    6. If fetch fails, return fallback_title if provided
    
    Args:
        article_url: URL of the article
        fallback_title: Content to use if fetch fails (typically the article title)
        max_length: Maximum content length (default 5000 characters)
        timeout: Request timeout in seconds (default 6 seconds)
    
    Returns:
        Full article text, fallback_title if provided, or None
    """
    
    html = fetch_page_html(article_url, timeout=timeout)
    
    if not html:
        # Return fallback content if fetch failed
        return fallback_title
    
    try:
        soup = BeautifulSoup(html, "lxml")
        
        # Try to find article content in specific order
        content_container = None
        
        # Priority 1: <article> tag
        article_tag = soup.find("article")
        if article_tag:
            content_container = article_tag
        
        # Priority 2: <main> tag
        if not content_container:
            main_tag = soup.find("main")
            if main_tag:
                content_container = main_tag
        
        # Priority 3: Collect all <p> tags from body
        if not content_container:
            body_tag = soup.find("body")
            if body_tag:
                content_container = body_tag
        
        if not content_container:
            return fallback_title
        
        # Extract all paragraph text
        paragraphs = []
        
        # First try to get all p tags
        for p in content_container.find_all("p", recursive=True):
            text = p.get_text(strip=True)
            if text and len(text) > 20:  # Skip very short paragraphs
                paragraphs.append(text)
        
        # If no paragraphs found, try to get all text
        if not paragraphs:
            text = content_container.get_text(strip=True)
            if text:
                paragraphs = [text]
        
        if not paragraphs:
            return fallback_title
        
        # Join paragraphs with newlines
        full_content = "\n\n".join(paragraphs)
        
        # Clean up excessive whitespace
        full_content = " ".join(full_content.split())
        
        # Limit length
        if len(full_content) > max_length:
            full_content = full_content[:max_length] + "..."
        
        return full_content if full_content else fallback_title
    
    except Exception as e:
        print(f"Error parsing article from {article_url}: {type(e).__name__}")
        return fallback_title


def extract_blog_updates(blog_url: str, max_items: int = 3):
    """
    Extract blog/news article links from a competitor blog page.
    For each valid article, fetch and extract full article content with timeout.
    
    Args:
        blog_url: URL of the blog/news page
        max_items: Maximum number of articles to extract (default 3)
    
    Returns:
        List of update dictionaries with title, url, content, and source_type
        Returns empty list on error - never raises exception
    """

    try:
        html = fetch_page_html(blog_url, timeout=8)

        if not html:
            return []

        soup = BeautifulSoup(html, "lxml")

        updates = []
        seen_urls = set()

        links = soup.find_all("a", href=True)

        for link in links:
            # Stop if we've collected enough articles
            if len(updates) >= max_items:
                break
                
            title = link.get_text(strip=True)
            href = link.get("href")

            if not title or not href:
                continue

            if len(title) < 15:
                continue

            # Properly join relative URLs
            full_url = urljoin(blog_url, href)

            # Skip invalid URLs
            if not is_valid_article_url(full_url):
                continue

            # Skip duplicates
            if full_url in seen_urls:
                continue

            seen_urls.add(full_url)

            # Try to fetch full article content with 6-second timeout
            # Pass title as fallback if fetch fails
            article_content = fetch_article_content(
                full_url, 
                fallback_title=title,
                timeout=6
            )
            
            # Use fetched content if available, otherwise use title as fallback
            content = article_content if article_content else title

            updates.append({
                "title": title,
                "url": full_url,
                "content": content,
                "source_type": "blog"
            })

        return updates
    
    except Exception as e:
        # Log error but never raise - return empty list
        print(f"Error extracting blog updates from {blog_url}: {type(e).__name__}: {e}")
        return []