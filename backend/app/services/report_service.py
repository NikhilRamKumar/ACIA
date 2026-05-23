from sqlalchemy.orm import Session
from app.models.update import CompetitorUpdate
from app.models.competitor import Competitor
from datetime import datetime, timedelta
from collections import Counter
from app.services.trend_service import (
    get_recent_updates, count_categories, count_threat_levels,
    identify_top_competitors, generate_trend_summary, generate_strategic_insight
)


def generate_competitor_report(db: Session, domain=None, days=30):
    """
    Generate a comprehensive competitive intelligence report.
    """
    
    # Get recent updates
    updates = get_recent_updates(db, domain, days)
    
    if not updates:
        return {
            "report_title": f"ACIA Competitive Intelligence Report - {domain or 'All Domains'}",
            "domain": domain,
            "generated_at": datetime.utcnow().isoformat(),
            "time_window_days": days,
            "executive_summary": "No updates available for the selected period.",
            "total_updates": 0,
            "top_competitors": [],
            "top_categories": [],
            "high_threat_updates": [],
            "pricing_changes": [],
            "product_launches": [],
            "model_releases": [],
            "key_predictions": [],
            "recommended_actions": []
        }
    
    # Analyze data
    categories = count_categories(updates)
    threat_levels = count_threat_levels(updates)
    top_competitors = identify_top_competitors(updates)
    trend_summary = generate_trend_summary(updates, domain or "market")
    strategic_insight = generate_strategic_insight(updates, domain or "market")
    
    # Extract specific update types
    high_threat_updates = []
    pricing_changes = []
    product_launches = []
    model_releases = []
    key_predictions = []
    
    for update in sorted(updates, key=lambda u: u.threat_score or 0, reverse=True):
        # High threat updates (top 10)
        if (update.threat_score or 0) >= 7 and len(high_threat_updates) < 10:
            high_threat_updates.append({
                "title": update.title or "Untitled",
                "competitor": update.competitor.name if update.competitor else "Unknown",
                "threat_score": update.threat_score or 0,
                "summary": update.summary or update.content[:200] if update.content else "",
                "category": update.category,
                "prediction": update.prediction
            })
        
        # Pricing changes
        if update.category == "Pricing Change":
            pricing_changes.append({
                "title": update.title or "Untitled",
                "competitor": update.competitor.name if update.competitor else "Unknown",
                "summary": update.summary or "Pricing-related update",
                "threat_score": update.threat_score or 0
            })
        
        # Product launches
        if update.category == "Product Launch":
            product_launches.append({
                "title": update.title or "Untitled",
                "competitor": update.competitor.name if update.competitor else "Unknown",
                "summary": update.summary or "Product launch detected",
                "threat_score": update.threat_score or 0
            })
        
        # Model releases
        if update.category == "Model Release":
            model_releases.append({
                "title": update.title or "Untitled",
                "competitor": update.competitor.name if update.competitor else "Unknown",
                "summary": update.summary or "Model release detected",
                "threat_score": update.threat_score or 0
            })
        
        # Key predictions
        if update.prediction and (update.confidence_level == "High"):
            key_predictions.append({
                "competitor": update.competitor.name if update.competitor else "Unknown",
                "prediction": update.prediction,
                "confidence": update.confidence_level,
                "threat_score": update.threat_score or 0
            })
    
    # Generate recommended actions
    recommended_actions = []
    
    if pricing_changes:
        recommended_actions.append(f"Monitor pricing changes weekly ({len(pricing_changes)} detected)")
    
    if high_threat_updates:
        recommended_actions.append(f"Prepare strategic responses for {len(high_threat_updates)} high-threat updates")
    
    if top_competitors:
        competitors_str = ", ".join([c['competitor'] for c in top_competitors[:3]])
        recommended_actions.append(f"Create competitive battlecards for: {competitors_str}")
    
    if model_releases:
        recommended_actions.append(f"Track model releases and capability benchmarks ({len(model_releases)} releases)")
    
    if threat_levels['high'] > 0:
        recommended_actions.append(f"Escalate {threat_levels['high']} high-severity threats to leadership")
    
    # Default action if list is empty
    if not recommended_actions:
        recommended_actions.append("Continue monitoring competitive landscape for emerging threats")
    
    domain_name = domain or "All Domains"
    
    return {
        "report_title": f"ACIA Competitive Intelligence Report - {domain_name}",
        "domain": domain,
        "generated_at": datetime.utcnow().isoformat(),
        "time_window_days": days,
        "executive_summary": trend_summary,
        "total_updates": len(updates),
        "top_competitors": top_competitors,
        "top_categories": categories,
        "high_threat_updates": high_threat_updates,
        "pricing_changes": pricing_changes,
        "product_launches": product_launches,
        "model_releases": model_releases,
        "key_predictions": key_predictions,
        "threat_distribution": threat_levels,
        "strategic_insight": strategic_insight,
        "recommended_actions": recommended_actions
    }
