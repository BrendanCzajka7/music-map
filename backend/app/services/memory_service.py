from sqlalchemy.orm import Session

from app.repositories.memory_repository import MemoryRepository
from app.schemas.memory import MemoryCreate


class MemoryService:
    def __init__(self, db: Session):
        self.repo = MemoryRepository(db)

    def create_memory(self, payload: MemoryCreate):
        return self.repo.create(payload)

    def list_memories_for_client(self, client_id: str):
        return self.repo.list_for_client(client_id)