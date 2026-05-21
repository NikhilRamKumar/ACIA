from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base


class CompetitorUpdate(Base):
    __tablename__ = "competitor_updates"

    id = Column(Integer, primary_key=True, index=True)

    competitor_id = Column(Integer, ForeignKey("competitors.id"), nullable=False)

    title = Column(String, nullable=False)
    url = Column(String, unique=True, nullable=False)
    content = Column(Text, nullable=True)

    source_type = Column(String, default="blog")

    published_date = Column(DateTime, nullable=True)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    summary = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    threat_score = Column(Integer, nullable=True)
    threat_reason = Column(Text, nullable=True)

    prediction = Column(Text, nullable=True)
    confidence_level = Column(String, nullable=True)
    recommended_response = Column(Text, nullable=True)

    competitor = relationship(
        "Competitor",
        back_populates="updates"
    )