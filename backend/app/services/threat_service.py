"""
Threat and risk scoring service for competitive updates.
Provides realistic threat assessment based on content analysis.
"""

import re
from typing import Optional


def get_threat_level(score: Optional[int]) -> str:
    """
    Convert threat score to threat level label.
    
    1-3: Low
    4-6: Medium
    7-10: High
    """
    if score is None:
        return "Unknown"
    if score >= 7:
        return "High"
    if score >= 4:
        return "Medium"
    return "Low"


def calculate_threat_score(
    title: str,
    content: Optional[str] = None,
    summary: Optional[str] = None,
    category: Optional[str] = None,
    competitor_domain: Optional[str] = None
) -> int:
    """
    Calculate realistic threat score based on content analysis.
    
    Strategy:
    1. Start with base score from category
    2. Apply keyword adjustments
    3. Clamp between 1-10
    
    Args:
        title: Update title
        content: Full update content
        summary: AI summary if available
        category: Content category
        competitor_domain: Competitor domain
    
    Returns:
        Threat score (1-10)
    """
    
    # Base score by category
    base_scores = {
        "Documentation Update": 2,
        "Research Update": 4,
        "Hiring Signal": 4,
        "Partnership": 5,
        "Product Launch": 6,
        "Model Release": 7,
        "Pricing Change": 7,
        "Market Expansion": 6,
        "Funding News": 5,
        "Other": 3,
    }
    
    score = base_scores.get(category, 3) if category else 3
    
    # Combine text for analysis
    text = f"{title} {content or ''} {summary or ''}".lower()
    
    # Major impact indicators (+1 each, max +2)
    major_keywords = {
        "enterprise": 1,
        "customer": 1,
        "customers": 1,
        "global": 1,
        "launch": 1,
        "availability": 1,
        "production": 1,
        "benchmark": 1,
        "major": 1,
    }
    
    major_adjustments = 0
    for keyword, value in major_keywords.items():
        if keyword in text:
            major_adjustments = min(major_adjustments + value, 2)
    score += major_adjustments
    
    # Pricing impact (+1)
    pricing_keywords = ["pricing", "cheaper", "cost", "subscription", "plan", "free", "pro", "discount"]
    if any(keyword in text for keyword in pricing_keywords):
        score += 1
    
    # Product capability changes (+1)
    product_keywords = ["new model", "new phone", "new feature", "ai feature", "integration", "release", "upgrade", "capability"]
    if any(keyword in text for keyword in product_keywords):
        score += 1
    
    # Minor/documentation updates (-1)
    minor_keywords = ["minor", "docs", "documentation", "guide", "tutorial", "example", "support", "blog post", "article", "news"]
    if any(keyword in text for keyword in minor_keywords):
        # Only apply penalty if no major keywords found
        if major_adjustments == 0 and not any(k in text for k in pricing_keywords + product_keywords):
            score -= 1
    
    # Clamp between 1 and 10
    return max(1, min(10, score))


def generate_risk_explanation(
    score: Optional[int],
    category: Optional[str] = None,
    text: Optional[str] = None
) -> str:
    """
    Generate human-readable risk explanation based on score and context.
    
    Args:
        score: Threat score (1-10)
        category: Update category
        text: Combined title + content for context
    
    Returns:
        Risk explanation string
    """
    
    if score is None:
        return "Threat level not yet assessed."
    
    threat_level = get_threat_level(score)
    
    if threat_level == "High":
        if category == "Pricing Change":
            return "This update is rated High because it includes pricing changes that may affect competitive positioning and customer acquisition costs."
        elif category == "Model Release":
            return "This update is rated High because it indicates significant product capability advancement that may impact market position."
        elif category == "Product Launch":
            return "This update is rated High because it represents a new market initiative with potential competitive impact."
        else:
            return "This update is rated High because it includes signals such as product launches, pricing changes, major features, or market expansion that may affect competitive positioning."
    
    elif threat_level == "Medium":
        if category == "Partnership":
            return "This update is rated Medium because partnerships can affect distribution and market reach, warranting close monitoring."
        elif category == "Market Expansion":
            return "This update is rated Medium because it signals expansion into new markets or customer segments."
        elif category == "Hiring Signal":
            return "This update is rated Medium because hiring announcements may indicate new capabilities or market focus areas."
        else:
            return "This update is rated Medium because it may affect product positioning or user adoption, but there is limited evidence of immediate market disruption."
    
    else:  # Low
        return "This update is rated Low because it appears to be informational or documentation-related, with limited immediate competitive impact."


def assess_threat_reason(
    title: str,
    content: Optional[str],
    summary: Optional[str],
    category: Optional[str],
    score: int
) -> str:
    """
    Generate threat reason explaining why this score was assigned.
    
    Args:
        title: Update title
        content: Full content
        summary: AI summary
        category: Category
        score: Calculated threat score
    
    Returns:
        Threat reason string
    """
    
    reasons = []
    text = f"{title} {content or ''} {summary or ''}".lower()
    
    # Category-based reasons
    if category:
        reasons.append(f"Categorized as: {category}")
    
    # Keyword-based reasons
    if any(k in text for k in ["pricing", "cheaper", "cost", "subscription", "plan", "discount"]):
        reasons.append("Contains pricing signals")
    
    if any(k in text for k in ["new model", "new phone", "new feature", "ai feature", "release", "upgrade"]):
        reasons.append("Indicates product capability changes")
    
    if any(k in text for k in ["enterprise", "customer", "customers", "global"]):
        reasons.append("References enterprise or global scale")
    
    if any(k in text for k in ["partnership", "integration", "collaboration"]):
        reasons.append("Involves partnerships or integrations")
    
    if any(k in text for k in ["funding", "investment", "series", "ipo", "acquisition"]):
        reasons.append("Related to funding or M&A activity")
    
    # Score-based reason
    threat_level = get_threat_level(score)
    reasons.append(f"Overall threat assessment: {threat_level}")
    
    return "; ".join(reasons) if reasons else "Update analyzed but no specific signals detected"
