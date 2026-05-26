from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import Base, engine
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate
from app.models.alert import Alert

from app.api.competitor_routes import router as competitor_router
from app.api.update_routes import router as update_router
from app.api.scraper_routes import router as scraper_router
from app.api.ai_routes import router as ai_router
from app.api.vector_routes import router as vector_router
from app.models.feedback import Feedback
from app.api.feedback_routes import router as feedback_router
from app.api.alert_routes import router as alert_router
from app.api.pricing_routes import router as pricing_router
from app.api.comparison_routes import router as comparison_router
from app.api.trend_routes import router as trend_router
from app.api.report_routes import router as report_router

from app.jobs.scheduler import start_scheduler, shutdown_scheduler

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ACIA Backend",
    description="Autonomous Competitive Intelligence Agent Backend API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://acia-frontend.vercel.app",
        "https://acia-frontend-eugbr2bni-nikhilramkumars-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "ACIA backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.on_event("startup")
async def startup_event():
    """Start the background scheduler on application startup."""
    print("\n[APP] FastAPI startup event triggered")
    # Start scheduler in production mode (daily at 9:00 AM)
    # For testing, pass interval_minutes=5 to run every 5 minutes
    start_scheduler(interval_minutes=None)


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown the background scheduler on application shutdown."""
    print("\n[APP] FastAPI shutdown event triggered")
    shutdown_scheduler()



app.include_router(competitor_router)
app.include_router(update_router)
app.include_router(scraper_router)
app.include_router(ai_router)
app.include_router(vector_router)
app.include_router(feedback_router)
app.include_router(alert_router)
app.include_router(pricing_router)
app.include_router(comparison_router)
app.include_router(trend_router)
app.include_router(report_router)