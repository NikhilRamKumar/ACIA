import feedparser
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

from app.services.scraper_service import extract_blog_updates

# Standard headers for web requests
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    )
}

# Keywords for filtering sitemap URLs
SITEMAP_KEYWORDS = {
    'blog', 'news', 'newsroom', 'updates', 'product', 
    'release', 'announcement', 'press', 'article', 'post'
}

# Protection limits for sitemap processing
MAX_SITEMAPS_PER_COMPETITOR = 10
MAX_SITEMAP_URLS = 20
MAX_RECURSION_DEPTH = 2


def get_domain_from_url(url: str) -> str:
    """Extract domain from URL."""
    try:
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"
    except Exception:
        return url


def get_possible_rss_urls(blog_url: str) -> list:
    """
    Generate common RSS feed URL candidates from a blog URL.
    
    Tries these patterns:
    - blog_url + "/feed"
    - blog_url + "/rss"
    - blog_url + "/rss.xml"
    - website_url + "/feed"
    - website_url + "/rss.xml"
    
    Args:
        blog_url: The blog or website URL
    
    Returns:
        List of possible RSS feed URLs
    """
    candidates = []
    
    if not blog_url:
        return candidates
    
    # Remove trailing slashes
    blog_url = blog_url.rstrip('/')
    website_url = get_domain_from_url(blog_url)
    
    # Common RSS patterns
    patterns = [
        f"{blog_url}/feed",
        f"{blog_url}/rss",
        f"{blog_url}/rss.xml",
        f"{website_url}/feed",
        f"{website_url}/rss.xml"
    ]
    
    candidates = list(set(patterns))  # Remove duplicates
    return candidates


def fetch_rss_feed(rss_url: str, max_items: int = 5) -> list:
    """
    Fetch and parse an RSS feed.
    
    Args:
        rss_url: URL of the RSS feed
        max_items: Maximum number of items to extract
    
    Returns:
        List of update dictionaries with title, url, content, source_type
    """
    updates = []
    
    try:
        response = requests.get(rss_url, headers=HEADERS, timeout=10)
        
        # Handle HTTP errors - 404 and 401 are not critical
        if response.status_code == 404:
            # Silently skip 404 - RSS not available
            return []
        elif response.status_code == 401:
            # Silently skip 401 - RSS not available
            return []
        elif response.status_code >= 400:
            print(f"HTTP {response.status_code} fetching RSS {rss_url}")
            return []
        
        response.raise_for_status()
        
        feed = feedparser.parse(response.text)
        
        # Check if feed has entries
        if not feed.get('entries'):
            return []
        
        for entry in feed.entries[:max_items]:
            try:
                title = entry.get('title', '')
                url = entry.get('link', '')
                content = entry.get('summary', '') or entry.get('title', '')
                
                if not title or not url:
                    continue
                
                # Clean content
                if content:
                    # Remove HTML tags from content
                    soup = BeautifulSoup(content, 'html.parser')
                    content = soup.get_text(strip=True)[:1000]  # Limit to 1000 chars
                
                updates.append({
                    "title": title,
                    "url": url,
                    "content": content,
                    "source_type": "rss"
                })
            except Exception as e:
                print(f"Error parsing RSS entry: {e}")
                continue
        
        return updates
    
    except requests.exceptions.Timeout:
        print(f"Timeout fetching RSS from {rss_url}")
        return []
    except requests.exceptions.RequestException as e:
        # Generic network errors only - 404/401 already handled above
        print(f"Error fetching RSS {rss_url}: {type(e).__name__}")
        return []
    except Exception as e:
        print(f"Error parsing RSS feed {rss_url}: {e}")
        return []


def get_rss_updates(blog_url: str, max_items: int = 5) -> list:
    """
    Try multiple RSS feed URLs and collect updates.
    
    Args:
        blog_url: The blog/website URL
        max_items: Maximum number of items to collect
    
    Returns:
        List of updates from RSS feeds
    """
    updates = []
    
    try:
        rss_urls = get_possible_rss_urls(blog_url)
        
        for rss_url in rss_urls:
            if updates:  # If we already have updates, stop trying
                break
            
            feed_updates = fetch_rss_feed(rss_url, max_items=max_items)
            updates.extend(feed_updates)
        
        return updates[:max_items]
    
    except Exception as e:
        print(f"Error getting RSS updates: {e}")
        return []


def get_sitemap_urls(website_url: str, visited_sitemaps=None, depth: int = 0, 
                     max_depth: int = MAX_RECURSION_DEPTH, processed_count: list = None) -> list:
    """
    Fetch and parse sitemap URLs from a website with protection against infinite recursion.
    
    Tries only:
    - website_url + "/sitemap.xml"
    - website_url + "/sitemap_index.xml"
    
    Args:
        website_url: The website URL
        visited_sitemaps: Set of already visited sitemap URLs (prevents loops)
        depth: Current recursion depth
        max_depth: Maximum recursion depth allowed
        processed_count: List to track number of sitemaps processed
    
    Returns:
        List of URLs from sitemap
    """
    urls = []
    
    if not website_url:
        return urls
    
    # Initialize tracking variables on first call
    if visited_sitemaps is None:
        visited_sitemaps = set()
    if processed_count is None:
        processed_count = [0]  # Use list to allow modification in nested calls
    
    # Check recursion depth limit
    if depth > max_depth:
        return urls
    
    # Check if we've processed too many sitemaps
    if processed_count[0] >= MAX_SITEMAPS_PER_COMPETITOR:
        return urls
    
    # Ensure proper domain format
    website_url = website_url.rstrip('/')
    
    # Try to get domain if full URL provided
    if '://' in website_url:
        parsed = urlparse(website_url)
        domain = f"{parsed.scheme}://{parsed.netloc}"
    else:
        domain = website_url
    
    # Only try these two sitemap URLs per domain (not recursive in recursion)
    sitemap_candidates = [
        f"{domain}/sitemap.xml",
        f"{domain}/sitemap_index.xml"
    ]
    
    try:
        for sitemap_url in sitemap_candidates:
            # Skip if already visited (prevents infinite loops)
            if sitemap_url in visited_sitemaps:
                continue
            
            visited_sitemaps.add(sitemap_url)
            processed_count[0] += 1
            
            # Don't process more sitemaps if we've hit the limit
            if processed_count[0] >= MAX_SITEMAPS_PER_COMPETITOR:
                break
            
            try:
                response = requests.get(sitemap_url, headers=HEADERS, timeout=10)
                
                # Skip if not found or forbidden
                if response.status_code in [404, 403, 401]:
                    continue
                
                response.raise_for_status()
                
                # Parse XML
                root = ET.fromstring(response.content)
                
                # Handle sitemap index (multiple sitemaps)
                namespaces = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
                
                # First check if this is a sitemap index
                sitemap_locs = root.findall('.//sm:sitemap/sm:loc', namespaces)
                if not sitemap_locs:
                    sitemap_locs = root.findall('.//sitemap/loc')
                
                if sitemap_locs:
                    # This is a sitemap index, recursively fetch each nested sitemap
                    for loc in sitemap_locs:
                        if loc.text:
                            # Only recurse if we haven't hit limits
                            if processed_count[0] < MAX_SITEMAPS_PER_COMPETITOR and depth < max_depth:
                                nested_urls = get_sitemap_urls(
                                    loc.text,
                                    visited_sitemaps=visited_sitemaps,
                                    depth=depth + 1,
                                    max_depth=max_depth,
                                    processed_count=processed_count
                                )
                                urls.extend(nested_urls)
                                
                                # Stop if we've collected enough
                                if len(urls) >= MAX_SITEMAP_URLS:
                                    return urls[:MAX_SITEMAP_URLS]
                else:
                    # This is a regular sitemap, extract URLs
                    url_locs = root.findall('.//sm:url/sm:loc', namespaces)
                    if not url_locs:
                        url_locs = root.findall('.//url/loc')
                    
                    for loc in url_locs:
                        if loc.text:
                            urls.append(loc.text)
                            # Stop if we've collected enough
                            if len(urls) >= MAX_SITEMAP_URLS:
                                return urls[:MAX_SITEMAP_URLS]
                
                # If we successfully got URLs, don't try other sitemaps
                if urls:
                    break
            
            except requests.exceptions.Timeout:
                # Timeout is expected and ok, just skip this sitemap
                continue
            except requests.exceptions.RequestException as e:
                # Network errors - skip silently
                continue
            except RecursionError:
                print(f"Sitemap recursion stopped for {sitemap_url}")
                return urls
            except ET.ParseError:
                # XML parsing error - skip silently
                continue
            except Exception as e:
                # Unexpected errors - log once and continue
                print(f"Sitemap processing error for {sitemap_url}: {type(e).__name__}")
                continue
    
    except RecursionError:
        print(f"Sitemap recursion error while processing {website_url}")
        return urls
    except Exception as e:
        print(f"Error getting sitemap URLs for {website_url}: {e}")
        return []
    
    return urls[:MAX_SITEMAP_URLS]  # Limit total URLs collected


def clean_url_to_title(url: str) -> str:
    """
    Create a clean title from a URL slug.
    
    Example: "https://example.com/blog/ai-revolution" -> "AI Revolution"
    """
    try:
        parsed = urlparse(url)
        path = parsed.path.strip('/')
        
        # Get the last part of path
        parts = path.split('/')
        slug = parts[-1] if parts else ''
        
        # Remove common file extensions
        if '.' in slug:
            slug = slug.rsplit('.', 1)[0]
        
        # Replace hyphens and underscores with spaces
        slug = slug.replace('-', ' ').replace('_', ' ')
        
        # Title case
        title = slug.title()
        
        return title if title else "Article"
    
    except Exception:
        return "Article"


def fetch_page_title(url: str) -> str:
    """
    Try to fetch the page title from a URL.
    
    Returns:
        Page title or None on error
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to find title in meta og:title first
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            return og_title.get('content')
        
        # Try <title> tag
        title_tag = soup.find('title')
        if title_tag and title_tag.string:
            return title_tag.string.strip()
        
        # Try h1 tag
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text(strip=True)
        
        return None
    
    except Exception as e:
        print(f"Error fetching page title from {url}: {e}")
        return None


def get_sitemap_updates(website_url: str, max_items: int = 5) -> list:
    """
    Collect updates from sitemap URLs that match blog/news keywords.
    
    Args:
        website_url: The website URL
        max_items: Maximum number of items to collect
    
    Returns:
        List of updates from sitemap
    """
    updates = []
    
    try:
        sitemap_urls = get_sitemap_urls(website_url)
        
        if not sitemap_urls:
            return []
        
        # Filter for blog/news related URLs
        filtered_urls = []
        for url in sitemap_urls:
            url_lower = url.lower()
            # Check if URL contains any of the keywords
            if any(keyword in url_lower for keyword in SITEMAP_KEYWORDS):
                filtered_urls.append(url)
        
        # If no keyword matches, use all URLs (but limit to recent-looking ones)
        if not filtered_urls:
            filtered_urls = sitemap_urls
        
        # Collect updates from filtered URLs
        for url in filtered_urls[:max_items]:
            try:
                # Try to fetch page title
                title = fetch_page_title(url)
                
                # If no title, create one from URL slug
                if not title:
                    title = clean_url_to_title(url)
                
                updates.append({
                    "title": title,
                    "url": url,
                    "content": title,  # Use title as content initially
                    "source_type": "sitemap"
                })
            
            except Exception as e:
                print(f"Error processing sitemap URL {url}: {e}")
                continue
        
        return updates
    
    except Exception as e:
        print(f"Error getting sitemap updates: {e}")
        return []


def collect_updates_from_competitor(competitor, max_items: int = 5) -> list:
    """
    Hybrid scraper: Try multiple methods to collect updates.
    
    Methods tried in order:
    1. RSS feeds
    2. Sitemap URLs
    3. Existing BeautifulSoup HTML scraper (fallback)
    
    Args:
        competitor: Competitor model object with blog_url
        max_items: Maximum number of items to collect
    
    Returns:
        List of updates from any available source
    """
    
    if not competitor.blog_url:
        return []
    
    try:
        # Method 1: Try RSS feeds
        print(f"Trying RSS feeds for {competitor.name}...")
        rss_updates = get_rss_updates(competitor.blog_url, max_items=max_items)
        
        if rss_updates:
            print(f"Found {len(rss_updates)} updates via RSS for {competitor.name}")
            return rss_updates[:max_items]
        
        print(f"No RSS updates for {competitor.name}, trying sitemap...")
        
        # Method 2: Try sitemap
        website_url = get_domain_from_url(competitor.blog_url)
        sitemap_updates = get_sitemap_updates(website_url, max_items=max_items)
        
        if sitemap_updates:
            print(f"Found {len(sitemap_updates)} updates via sitemap for {competitor.name}")
            return sitemap_updates[:max_items]
        
        print(f"No sitemap updates for {competitor.name}, falling back to HTML scraping...")
        
        # Method 3: Fallback to existing HTML scraper
        html_updates = extract_blog_updates(competitor.blog_url, max_items=max_items)
        
        if html_updates:
            print(f"Found {len(html_updates)} updates via HTML scraping for {competitor.name}")
            return html_updates[:max_items]
        
        print(f"No updates collected for {competitor.name}")
        return []
    
    except Exception as e:
        print(f"Error collecting updates for {competitor.name}: {e}")
        # Last resort: try HTML scraper anyway
        try:
            return extract_blog_updates(competitor.blog_url, max_items=max_items)
        except Exception as fallback_error:
            print(f"Fallback HTML scraper also failed for {competitor.name}: {fallback_error}")
            return []
