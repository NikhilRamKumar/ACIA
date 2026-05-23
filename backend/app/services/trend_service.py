from sqlalchemy.orm import Session
from app.models.update import CompetitorUpdate
from app.models.competitor import Competitor
from datetime import datetime, timedelta
from collections import Counter


def get_recent_updates(db: Session, domain=None, days=30):
    """
    Get updates from the last N days.
    If domain is provided, filter by competitor domain.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.scraped_at >= cutoff_date
    )
    
    if domain:
        query = query.join(Competitor).filter(Competitor.domain == domain)
    
    return query.all()


def count_categories(updates):
    """Count frequency of categories in updates."""
    categories = []
    for update in updates:
        if update.category:
            categories.append(update.category)
    
    counter = Counter(categories)
    return [
        {"category": cat, "count": count}
        for cat, count in counter.most_common()
    ]


def count_threat_levels(updates):
    """Categorize updates by threat level."""
    low_count = 0
    medium_count = 0
    high_count = 0
    
    for update in updates:
        threat = update.threat_score or 0
        if threat >= 7:
            high_count += 1
        elif threat >= 4:
            medium_count += 1
        else:
            low_count += 1
    
    return {
        "low": low_count,
        "medium": medium_count,
        "high": high_count
    }


def identify_top_competitors(updates):
    """Identify top competitors by update count."""
    competitors = []
    for update in updates:
        if update.competitor and update.competitor.name:
            competitors.append(update.competitor.name)
    
    counter = Counter(competitors)
    return [
        {"competitor": comp, "count": count}
        for comp, count in counter.most_common(5)
    ]


def generate_trend_summary(updates, domain_name="AI / GenAI"):
    """
    Generate a readable trend summary from updates using rule-based logic.
    """
    if not updates:
        return "Not enough update data to generate trend summary."
    
    categories = count_categories(updates)
    threat_levels = count_threat_levels(updates)
    top_competitors = identify_top_competitors(updates)
    
    # Build summary from top categories
    summary_parts = []
    
    # Overall market activity
    total = len(updates)
    summary_parts.append(f"The {domain_name} domain shows strong competitive activity with {total} recent updates.")
    
    # Category analysis
    if categories:
        top_cat = categories[0]
        if top_cat['category'] == 'Model Release':
            summary_parts.append(f"Model releases are the dominant activity ({top_cat['count']} updates), indicating aggressive innovation across competitors.")
        elif top_cat['category'] == 'Pricing Change':
            summary_parts.append(f"Pricing changes are leading competitive moves ({top_cat['count']} updates), suggesting market consolidation or strategy shifts.")
        elif top_cat['category'] == 'Product Launch':
            summary_parts.append(f"Product launches are accelerating ({top_cat['count']} updates), showing sustained product momentum.")
        else:
            summary_parts.append(f"{top_cat['category']} activities are most common ({top_cat['count']} updates).")
    
    # Threat analysis
    if threat_levels['high'] > 0:
        summary_parts.append(f"High-threat updates ({threat_levels['high']}) require immediate attention, indicating critical competitive moves.")
    
    # Competitive intensity
    if top_competitors:
        top_comp = top_competitors[0]
        summary_parts.append(f"{top_comp['competitor']} leads in activity with {top_comp['count']} updates, indicating aggressive positioning.")
    
    # Market outlook
    if threat_levels['high'] > (total * 0.3):
        summary_parts.append("The market shows elevated competitive intensity with significant threat levels across competitors.")
    else:
        summary_parts.append("Overall threat levels remain moderate, suggesting stable competitive positioning.")
    
    return " ".join(summary_parts)


def generate_strategic_insight(updates, domain_name="AI / GenAI"):
    """Generate strategic insights from updates."""
    categories = count_categories(updates)
    threat_levels = count_threat_levels(updates)
    top_competitors = identify_top_competitors(updates)
    
    insights = []
    
    # Pricing insight
    pricing_count = next((cat['count'] for cat in categories if cat['category'] == 'Pricing Change'), 0)
    if pricing_count > len(updates) * 0.2:
        insights.append("Monitor pricing dynamics closely — frequent changes indicate market volatility.")
    
    # Model release insight
    model_count = next((cat['count'] for cat in categories if cat['category'] == 'Model Release'), 0)
    if model_count > 0:
        insights.append("Track model releases and benchmarks from top competitors to stay ahead on capability parity.")
    
    # Threat insight
    if threat_levels['high'] > 0:
        insights.append(f"Prioritize {threat_levels['high']} high-threat updates requiring strategic response.")
    
    # Default insight if no specific patterns
    if not insights:
        insights.append(f"Focus competitive analysis on {top_competitors[0]['competitor'] if top_competitors else 'leading competitors'} and emerging market trends.")
    
    return " ".join(insights)
