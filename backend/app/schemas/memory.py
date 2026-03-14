from datetime import datetime
from pydantic import BaseModel, Field


class MemoryCreate(BaseModel):
    client_id: str = Field(min_length=1)

    lat: float
    lng: float

    track_id: str = Field(min_length=1)
    track_name: str = Field(min_length=1)
    artist_name: str = Field(min_length=1)

    album_image: str | None = None
    preview_url: str | None = None

    memory_text: str | None = None
    memory_date: str | None = None

    place_name: str | None = None
    country: str | None = None

    source: str = "manual"


class MemoryRead(BaseModel):
    id: int
    client_id: str

    lat: float
    lng: float

    place_name: str | None = None
    country: str | None = None

    track_id: str
    track_name: str
    artist_name: str

    album_image: str | None = None
    preview_url: str | None = None

    memory_text: str | None = None
    memory_date: str | None = None

    source: str
    created_at: datetime

    model_config = {"from_attributes": True}