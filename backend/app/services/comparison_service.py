import re
from sqlalchemy.orm import Session
from app.models.update import CompetitorUpdate
from app.models.competitor import Competitor
from datetime import datetime, timedelta


# Feature keyword detection dictionary
FEATURE_KEYWORDS = {
    "AI Model": ["model", "llm", "gpt", "claude", "gemini", "mistral", "reasoning", "neural", "transformer"],
    "API": ["api", "endpoint", "developer", "sdk", "platform", "rest", "graphql"],
    "Pricing": ["price", "pricing", "cost", "plan", "subscription", "pro", "enterprise", "free", "tier"],
    "Search": ["search", "answer engine", "retrieval", "web search", "semantic", "query"],
    "RAG": ["rag", "retrieval", "vector", "embedding", "knowledge base", "semantic search"],
    "Agents": ["agent", "workflow", "automation", "tool use", "orchestration"],
    "Enterprise": ["enterprise", "business", "team", "organization", "security", "sso", "admin"],
    "Mobile App": ["mobile", "app", "android", "ios", "iphone", "smartphone"],
    "Camera": ["camera", "lens", "sensor", "photo", "video", "megapixel", "optics"],
    "Battery": ["battery", "charging", "fast charging", "mah", "watt", "wireless charge"],
    "Processor": ["chip", "processor", "snapdragon", "tensor", "a17", "a18", "bionic", "qualcomm"],
    "Display": ["display", "screen", "oled", "amoled", "refresh rate", "lcd", "resolution"],
    "Partnership": ["partner", "partnership", "collaboration", "integration", "acquisition", "acquire"],
    "Market Expansion": ["india", "europe", "global", "region", "launch", "expansion", "market"],
    "Safety": ["safety", "alignment", "ethics", "responsible", "guardrail", "mitigate"],
    "Observability": ["observability", "monitoring", "trace", "logging", "debug", "analytics"],
    "Foldable": ["foldable", "fold", "flexible", "hinge", "durability"],
    "Coding": ["coding", "code generation", "developer", "programming", "codebase"],
}


def extract_features_from_text(text: str):
    """
    Extract detected features from text by matching against FEATURE_KEYWORDS.
    Returns list of detected feature categories.
    """
    if not text:
        return []
    
    text_lower = text.lower()
    detected_features = set()
    
    for feature_category, keywords in FEATURE_KEYWORDS.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                detected_features.add(feature_category)
                break
    
    return sorted(list(detected_features))


def build_competitor_feature_comparison(db: Session, domain=None):
    """
    Build a feature comparison across competitors.
    Groups features by competitor and returns structured comparison data.
    
    Returns: list of competitor feature profiles
    """
    
    # Query updates
    query = db.query(CompetitorUpdate).join(Competitor)
    
    if domain:
        query = query.filter(Competitor.domain == domain)
    
    updates = query.all()
    
    # Group updates by competitor
    competitor_updates = {}
    for update in updates:
        comp_id = update.competitor_id
        if comp_id not in competitor_updates:
            competitor_updates[comp_id] = []
        competitor_updates[comp_id].append(update)
    
    # Build feature profiles
    comparison_data = []
    
    for comp_id, comp_updates in competitor_updates.items():
        if not comp_updates:
            continue
        
        competitor = comp_updates[0].competitor
        
        # Extract all features from all updates for this competitor
        all_features = set()
        max_threat_score = 0
        latest_title = ""
        top_categories = {}
        
        for update in comp_updates:
            # Extract features from title, content, summary
            text = f"{update.title or ''} {update.content or ''} {update.summary or ''}"
            features = extract_features_from_text(text)
            all_features.update(features)
            
            # Track threat score
            if update.threat_score and update.threat_score > max_threat_score:
                max_threat_score = update.threat_score
            
            # Track latest update
            if not latest_title:
                latest_title = update.title or "No title"
            
            # Count categories
            if update.category:
                top_categories[update.category] = top_categories.get(update.category, 0) + 1
        
        # Get top 3 categories
        sorted_categories = sorted(top_categories.items(), key=lambda x: x[1], reverse=True)[:3]
        top_cats = [cat[0] for cat in sorted_categories]
        
        profile = {
            "competitor_id": competitor.id,
            "competitor_name": competitor.name,
            "domain": competitor.domain,
            "features": sorted(list(all_features)),
            "feature_count": len(all_features),
            "latest_update_title": latest_title,
            "highest_threat_score": max_threat_score,
            "top_categories": top_cats,
            "update_count": len(comp_updates)
        }
        
        comparison_data.append(profile)
    
    # Sort by threat score descending
    comparison_data.sort(key=lambda x: x['highest_threat_score'], reverse=True)
    
    return comparison_data
