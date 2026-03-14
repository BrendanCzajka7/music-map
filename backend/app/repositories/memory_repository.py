from sqlalchemy.orm import Session

from app.models.memory import Memory
from app.schemas.memory import MemoryCreate


class MemoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, payload: MemoryCreate) -> Memory:
        db_obj = Memory(**payload.model_dump())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def list_for_client(self, client_id: str) -> list[Memory]:
        return (
            self.db.query(Memory)
            .filter(Memory.client_id == client_id)
            .order_by(Memory.created_at.desc())
            .all()
        )