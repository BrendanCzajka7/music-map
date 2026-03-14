from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from app.core.db import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(String, index=True, nullable=False)

    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    place_name = Column(String, nullable=True)
    country = Column(String, nullable=True)

    track_id = Column(String, nullable=False)
    track_name = Column(String, nullable=False)
    artist_name = Column(String, nullable=False)

    album_image = Column(String, nullable=True)
    preview_url = Column(String, nullable=True)

    memory_text = Column(Text, nullable=True)
    memory_date = Column(String, nullable=True)

    source = Column(String, nullable=False, default="manual")

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)