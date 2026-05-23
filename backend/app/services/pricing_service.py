import re
from sqlalchemy.orm import Session
from app.models.update import CompetitorUpdate


# Pricing-related keywords to detect
PRICING_KEYWORDS = [
    'price', 'pricing', 'cost', 'subscription', 'plan',
    'free', 'pro', 'premium', 'enterprise', 'discount',
    'cheaper', 'expensive', 'billing', 'credit', 'usage',
    'tokens', 'per month', 'monthly', 'annual', 'yearly',
    'pay', 'fee', 'charge', 'tier', 'rate', 'license',
    'revenue', 'monetiz'
]


def is_pricing_related(update):
    """
    Check if an update is pricing-related by searching title, content, summary, and url.
    Returns True if any pricing keyword is found.
    """
    
    if not update:
        return False
    
    # Combine all text fields for searching
    text_to_search = ''
    
    if update.title:
        text_to_search += update.title + ' '
    if update.content:
        text_to_search += update.content + ' '
    if update.summary:
        text_to_search += update.summary + ' '
    if update.url:
        text_to_search += update.url + ' '
    
    # Convert to lowercase for case-insensitive matching
    text_lower = text_to_search.lower()
    
    # Check for each pricing keyword
    for keyword in PRICING_KEYWORDS:
        # Use word boundary regex for more accurate matching
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            return True
    
    return False


def detect_pricing_change_for_update(update, db: Session):
    """
    Detect if an update is pricing-related and update it accordingly.
    
    If pricing detected:
    - Set update.category = "Pricing Change"
    - If threat_score is None or less than 7, set threat_score = 7
    - Set/append threat_reason
    - Save update
    - Optionally create alert
    
    Returns: True if pricing change was detected and updated, False otherwise
    """
    
    if not is_pricing_related(update):
        return False
    
    # Check if already marked as pricing change to avoid duplicate processing
    if update.category == "Pricing Change":
        return False
    
    # Update category
    update.category = "Pricing Change"
    
    # Update threat score if needed
    threat_score = update.threat_score or 0
    if threat_score < 7:
        update.threat_score = 7
    
    # Update threat reason
    pricing_reason = "Pricing-related movement detected. Pricing changes can affect customer adoption, competitor positioning, and market switching behavior."
    if update.threat_reason:
        if pricing_reason not in update.threat_reason:
            update.threat_reason = f"{update.threat_reason} {pricing_reason}"
    else:
        update.threat_reason = pricing_reason
    
    # Save update
    db.add(update)
    db.commit()
    db.refresh(update)
    
    print(f"[PRICING] ✓ Pricing change detected for update {update.id}: {update.title[:50]}")
    
    # Try to create alert if alert service is available
    try:
        from app.services.alert_service import generate_alert_for_update
        generate_alert_for_update(update, db)
        print(f"[PRICING] ✓ Alert generated for pricing update {update.id}")
    except ImportError:
        print(f"[PRICING] ℹ Alert service not available, skipping alert generation")
    except Exception as e:
        print(f"[PRICING] ⚠ Error generating alert for update {update.id}: {str(e)}")
    
    return True


def detect_pricing_changes_for_all(db: Session):
    """
    Detect pricing changes for all updates.
    
    Returns: tuple (checked_count, detected_count, updated_count)
    """
    
    checked_count = 0
    detected_count = 0
    updated_count = 0
    
    # Get all updates
    updates = db.query(CompetitorUpdate).all()
    
    print(f"[PRICING] Checking {len(updates)} updates for pricing changes...")
    
    for update in updates:
        checked_count += 1
        
        if is_pricing_related(update):
            detected_count += 1
            
            if detect_pricing_change_for_update(update, db):
                updated_count += 1
    
    print(f"[PRICING] Detection complete: {checked_count} checked, {detected_count} pricing-related, {updated_count} updated")
    
    return checked_count, detected_count, updated_count
