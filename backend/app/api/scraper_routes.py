from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate
from app.services.scraper_service import extract_blog_updates

router = APIRouter(
    prefix="/scraper",
    tags=["Scraper"]
)


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

    if not scraped_updates:
        return {
            "message": "No updates found",
            "competitor": competitor.name,
            "saved_count": 0,
            "skipped_count": 0,
            "updates": []
        }

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
            content=item["content"],
            source_type=item["source_type"]
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

    return {
        "message": "Scraping completed",
        "competitor": competitor.name,
        "blog_url": competitor.blog_url,
        "saved_count": len(saved_updates),
        "skipped_count": skipped_count,
        "updates": saved_updates
    }


@router.post("/all")
def scrape_all_competitors(db: Session = Depends(get_db)):
    competitors = db.query(Competitor).all()

    final_result = []

    for competitor in competitors:
        if not competitor.blog_url:
            final_result.append({
                "competitor": competitor.name,
                "message": "No blog URL available",
                "saved_count": 0,
                "skipped_count": 0
            })
            continue

        scraped_updates = extract_blog_updates(
            blog_url=competitor.blog_url,
            max_items=5
        )

        saved_count = 0
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
                content=item["content"],
                source_type=item["source_type"]
            )

            db.add(new_update)
            db.commit()
            db.refresh(new_update)

            saved_count += 1

        final_result.append({
            "competitor": competitor.name,
            "blog_url": competitor.blog_url,
            "saved_count": saved_count,
            "skipped_count": skipped_count
        })

    return {
        "message": "Scraping completed for all competitors",
        "results": final_result
    }