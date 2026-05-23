from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from app.database.db import SessionLocal
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate
from app.services.scraper_service import extract_blog_updates


scheduler = BackgroundScheduler()


def run_daily_scraping_job():
    """
    Background job that scrapes all competitors' blog updates daily.
    Runs internal Python functions with direct database access.
    """
    
    print(f"\n{'='*80}")
    print(f"[SCHEDULER] Daily scraping job started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}")
    
    # Create a new database session for this job
    db = SessionLocal()
    
    try:
        # Get all competitors
        competitors = db.query(Competitor).all()
        
        if not competitors:
            print("[SCHEDULER] No competitors found in database")
            return
        
        print(f"[SCHEDULER] Found {len(competitors)} competitors")
        
        total_saved = 0
        total_skipped = 0
        total_errors = 0
        
        # Scrape each competitor
        for competitor in competitors:
            
            if not competitor.blog_url:
                print(f"[SCHEDULER] Skipping '{competitor.name}' - no blog URL")
                continue
            
            print(f"\n[SCHEDULER] Scraping: {competitor.name}")
            print(f"[SCHEDULER]   Blog URL: {competitor.blog_url}")
            
            try:
                # Extract blog updates using internal function
                scraped_updates = extract_blog_updates(
                    blog_url=competitor.blog_url,
                    max_items=5
                )
                
                if not scraped_updates:
                    print(f"[SCHEDULER]   No updates found")
                    continue
                
                print(f"[SCHEDULER]   Found {len(scraped_updates)} articles")
                
                # Save only new updates to database
                saved_count = 0
                skipped_count = 0
                
                for item in scraped_updates:
                    # Check if URL already exists
                    existing = db.query(CompetitorUpdate).filter(
                        CompetitorUpdate.url == item["url"]
                    ).first()
                    
                    if existing:
                        skipped_count += 1
                        print(f"[SCHEDULER]     ⊘ Duplicate: {item['title'][:50]}...")
                        continue
                    
                    # Create new update record
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
                    
                    saved_count += 1
                    print(f"[SCHEDULER]     ✓ Saved: {item['title'][:50]}...")
                
                print(f"[SCHEDULER]   Saved: {saved_count} | Skipped: {skipped_count}")
                total_saved += saved_count
                total_skipped += skipped_count
            
            except Exception as e:
                total_errors += 1
                print(f"[SCHEDULER] ✗ Error scraping {competitor.name}: {str(e)}")
                continue
        
        # Summary
        print(f"\n{'='*80}")
        print(f"[SCHEDULER] Job completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"[SCHEDULER] Total Saved: {total_saved} | Skipped: {total_skipped} | Errors: {total_errors}")
        print(f"{'='*80}\n")
    
    except Exception as e:
        print(f"[SCHEDULER] ✗ Fatal error in scraping job: {str(e)}")
    
    finally:
        # Always close the database session
        db.close()


def start_scheduler(interval_minutes: int = None):
    """
    Start the background scheduler.
    
    Args:
        interval_minutes: If provided, run job every N minutes (for testing).
                         If None, run daily at 9:00 AM.
    """
    
    if interval_minutes:
        # Test mode: run every N minutes
        scheduler.add_job(
            run_daily_scraping_job,
            'interval',
            minutes=interval_minutes,
            id='daily_scraping_job',
            name='Daily Scraping Job (Test Mode)',
            replace_existing=True
        )
        print(f"[SCHEDULER] Started in TEST mode - runs every {interval_minutes} minutes")
    else:
        # Production mode: run daily at 9:00 AM
        scheduler.add_job(
            run_daily_scraping_job,
            'cron',
            hour=9,
            minute=0,
            id='daily_scraping_job',
            name='Daily Scraping Job (9:00 AM)',
            replace_existing=True
        )
        print("[SCHEDULER] Started in PRODUCTION mode - runs daily at 9:00 AM")
    
    if not scheduler.running:
        scheduler.start()
        print("[SCHEDULER] ✓ Background scheduler started successfully")


def shutdown_scheduler():
    """
    Safely shutdown the background scheduler.
    """
    
    if scheduler.running:
        scheduler.shutdown(wait=True)
        print("[SCHEDULER] ✓ Background scheduler shut down successfully")
