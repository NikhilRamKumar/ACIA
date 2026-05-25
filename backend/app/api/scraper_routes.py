from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate
from app.services.hybrid_scraper_service import collect_updates_from_competitor

router = APIRouter(
    prefix="/scraper",
    tags=["Scraper"]
)


def save_scraped_updates_to_db(competitor, scraped_updates, db: Session):
    saved_updates = []
    skipped_count = 0

    for item in scraped_updates:
        existing_update = db.query(CompetitorUpdate).filter(
            CompetitorUpdate.url == item["url"]
        ).first()

        if existing_update:
            skipped_count += 1
            continue

        new_update = CompetitorUpdate(
            competitor_id=competitor.id,
            title=item["title"],
            url=item["url"],
            content=item.get("content"),
            source_type=item.get("source_type", "blog")
        )

        db.add(new_update)
        db.commit()
        db.refresh(new_update)

        saved_updates.append({
            "id": new_update.id,
            "title": new_update.title,
            "url": new_update.url,
            "source_type": new_update.source_type
        })

    return saved_updates, skipped_count


@router.post("/competitor/{competitor_id}")
def scrape_competitor_blog(competitor_id: int, db: Session = Depends(get_db)):
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    if not competitor.blog_url:
        raise HTTPException(
            status_code=400,
            detail="Competitor blog URL not available"
        )

    scraped_updates = extract_blog_updates(
        blog_url=competitor.blog_url,
        max_items=5
    )

    saved_updates, skipped_count = save_scraped_updates_to_db(
        competitor=competitor,
        scraped_updates=scraped_updates,
        db=db
    )

    return {
        "message": "Scraping completed",
        "competitor": competitor.name,
        "blog_url": competitor.blog_url,
        "scraped_count": len(scraped_updates),
        "saved_count": len(saved_updates),
        "skipped_count": skipped_count,
        "updates": saved_updates
    }


@router.post("/domain/{domain}")
def scrape_competitors_by_domain(domain: str, db: Session = Depends(get_db)):
    """
    Scrape competitors from a specific domain with timeout protection.
    Each competitor has strict timeouts and limited article extraction.
    
    Args:
        domain: Domain key (e.g., 'mobile_phones', 'ai_genai')
        db: Database session
    
    Returns:
        200 OK response with detailed scraping results for each competitor
        Includes counts: success, failed, skipped, no_updates, saved_total
    """
    
    try:
        competitors = db.query(Competitor).filter(
            Competitor.domain == domain
        ).all()

        if not competitors:
            return {
                "message": "Domain scraping completed",
                "domain": domain,
                "total_competitors": 0,
                "success_count": 0,
                "failed_count": 0,
                "skipped_count": 0,
                "no_updates_count": 0,
                "saved_total": 0,
                "results": []
            }

        final_result = []
        success_count = 0
        failed_count = 0
        skipped_count = 0
        no_updates_count = 0
        saved_total = 0

        for competitor in competitors:
            result = {
                "competitor": competitor.name,
                "status": "success",
                "scraped_count": 0,
                "saved_count": 0,
                "skipped_count": 0,
                "error": None
            }

            try:
                # Skip if no blog URL
                if not competitor.blog_url:
                    result["status"] = "skipped"
                    result["error"] = "No blog URL available"
                    skipped_count += 1
                    final_result.append(result)
                    continue

                # Extract blog updates with timeout protection
                # Max 3 items per competitor
                scraped_updates = collect_updates_from_competitor(
                    competitor=competitor,
                    max_items=3
                )

                result["scraped_count"] = len(scraped_updates)

                # If no updates found, mark as no_updates (not failure)
                if not scraped_updates:
                    result["status"] = "no_updates"
                    no_updates_count += 1
                    final_result.append(result)
                    continue

                # Save updates to database
                saved_updates, skipped = save_scraped_updates_to_db(
                    competitor=competitor,
                    scraped_updates=scraped_updates,
                    db=db
                )

                result["saved_count"] = len(saved_updates)
                result["skipped_count"] = skipped
                result["status"] = "success"
                success_count += 1
                saved_total += len(saved_updates)

            except Exception as e:
                # Catch any error for this competitor and continue
                # Do not stop the whole scraping for one competitor's error
                result["status"] = "failed"
                result["error"] = str(e)
                failed_count += 1

            finally:
                final_result.append(result)

        # Build response message
        if success_count > 0:
            message = "Domain scraping completed"
        elif failed_count == 0 and no_updates_count > 0:
            message = "Domain scraping completed. No new updates found in any competitors."
        else:
            message = "Domain scraping completed with failures"

        return {
            "message": message,
            "domain": domain,
            "total_competitors": len(competitors),
            "success_count": success_count,
            "failed_count": failed_count,
            "skipped_count": skipped_count,
            "no_updates_count": no_updates_count,
            "saved_total": saved_total,
            "results": final_result
        }
    
    except Exception as e:
        # Database or other critical error
        # Still return 200 OK with error info
        return {
            "message": f"Domain scraping failed: {str(e)}",
            "domain": domain,
            "total_competitors": 0,
            "success_count": 0,
            "failed_count": 1,
            "skipped_count": 0,
            "no_updates_count": 0,
            "saved_total": 0,
            "results": [],
            "error": str(e)
        }


@router.post("/all")
def scrape_all_competitors(db: Session = Depends(get_db)):
    """
    Scrape all competitors from all domains.
    Note: For faster scraping, use POST /scraper/domain/{domain} to scrape a specific domain.
    """
    
    competitors = db.query(Competitor).all()

    final_result = []

    for competitor in competitors:
        if not competitor.blog_url:
            final_result.append({
                "competitor": competitor.name,
                "message": "No blog URL available",
                "scraped_count": 0,
                "saved_count": 0,
                "skipped_count": 0
            })
            continue

        scraped_updates = extract_blog_updates(
            blog_url=competitor.blog_url,
            max_items=5
        )

        saved_updates, skipped_count = save_scraped_updates_to_db(
            competitor=competitor,
            scraped_updates=scraped_updates,
            db=db
        )

        final_result.append({
            "competitor": competitor.name,
            "blog_url": competitor.blog_url,
            "scraped_count": len(scraped_updates),
            "saved_count": len(saved_updates),
            "skipped_count": skipped_count
        })

    return {
        "message": "Scraping completed for all competitors. Tip: Use /scraper/domain/{domain} for faster domain-specific scraping.",
        "results": final_result
    }