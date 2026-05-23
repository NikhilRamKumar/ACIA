from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.update import CompetitorUpdate


def determine_alert(update):
    """
    Determine if an update should generate an alert and return alert details.
    Returns a dict with alert info or None if no alert should be created.
    
    Alert conditions:
    - threat_score >= 7
    - category == "Pricing Change"
    - category == "Product Launch"
    - category == "Model Release"
    - confidence_level == "High"
    - prediction exists and threat_score >= 7
    """
    
    if not update:
        return None
    
    threat_score = update.threat_score or 0
    category = update.category or ""
    confidence_level = update.confidence_level or ""
    prediction = update.prediction
    
    # Determine severity based on threat score
    if threat_score >= 7:
        severity = "High"
    elif 4 <= threat_score < 7:
        severity = "Medium"
    else:
        severity = "Low"
    
    # Check for Pricing Change
    if category == "Pricing Change":
        return {
            "alert_type": "Pricing Change",
            "severity": severity,
            "title": f"Pricing Change Alert: {update.title[:60]}",
            "message": f"Competitor pricing update detected. Score: {threat_score}"
        }
    
    # Check for Product Launch
    if category == "Product Launch":
        return {
            "alert_type": "Product Launch",
            "severity": severity,
            "title": f"Product Launch Alert: {update.title[:60]}",
            "message": f"Competitor product launch detected. Score: {threat_score}"
        }
    
    # Check for Model Release
    if category == "Model Release":
        return {
            "alert_type": "Model Release",
            "severity": severity,
            "title": f"Model Release Alert: {update.title[:60]}",
            "message": f"Competitor model release detected. Score: {threat_score}"
        }
    
    # Check for High Threat (threat_score >= 7)
    if threat_score >= 7:
        return {
            "alert_type": "High Threat",
            "severity": "High",
            "title": f"High Threat Alert: {update.title[:60]}",
            "message": f"Critical threat detected. Threat Score: {threat_score}"
        }
    
    # Check for Strategic Prediction with High Confidence
    if prediction and confidence_level == "High":
        return {
            "alert_type": "Strategic Prediction",
            "severity": severity,
            "title": f"Strategic Prediction Alert: {update.title[:60]}",
            "message": f"High confidence prediction: {prediction[:100]}"
        }
    
    return None


def generate_alert_for_update(update, db: Session):
    """
    Generate an alert for a specific update if conditions are met.
    Skip if alert already exists for this update and alert type.
    
    Returns: True if alert was created, False if skipped
    """
    
    alert_info = determine_alert(update)
    
    if not alert_info:
        return False
    
    # Check if alert already exists for this update and type
    existing_alert = db.query(Alert).filter(
        Alert.update_id == update.id,
        Alert.alert_type == alert_info["alert_type"]
    ).first()
    
    if existing_alert:
        return False
    
    # Create new alert
    new_alert = Alert(
        update_id=update.id,
        alert_type=alert_info["alert_type"],
        severity=alert_info["severity"],
        title=alert_info["title"],
        message=alert_info["message"],
        is_read=False
    )
    
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    return True


def generate_alerts_for_all_updates(db: Session):
    """
    Generate alerts for all qualifying updates.
    
    Returns: tuple (created_count, skipped_count)
    """
    
    created_count = 0
    skipped_count = 0
    
    # Get all updates
    updates = db.query(CompetitorUpdate).all()
    
    print(f"[ALERTS] Checking {len(updates)} updates for alert generation...")
    
    for update in updates:
        if generate_alert_for_update(update, db):
            created_count += 1
            print(f"[ALERTS] ✓ Alert created for update {update.id}: {update.title[:50]}")
        else:
            skipped_count += 1
    
    print(f"[ALERTS] Alert generation complete: {created_count} created, {skipped_count} skipped/existing")
    
    return created_count, skipped_count
