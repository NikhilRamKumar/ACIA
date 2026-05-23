from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.db import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    update_id = Column(
        Integer,
        ForeignKey("competitor_updates.id"),
        nullable=False
    )

    feedback_type = Column(String, nullable=False)
    rating = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    update = relationship("CompetitorUpdate")