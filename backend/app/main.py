from fastapi import FastAPI

from app.database.db import Base, engine
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate
from app.api.competitor_routes import router as competitor_router
from app.api.update_routes import router as update_router
from app.api.scraper_routes import router as scraper_router
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ACIA Backend",
    description="Autonomous Competitive Intelligence Agent Backend API",
    version="1.0.0"
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


app.include_router(competitor_router)
app.include_router(update_router)
app.include_router(scraper_router)
