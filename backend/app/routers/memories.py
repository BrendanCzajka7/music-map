from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.memory import MemoryCreate, MemoryRead
from app.services.memory_service import MemoryService

router = APIRouter(prefix="/memories", tags=["memories"])


@router.post("", response_model=MemoryRead)
def create_memory(payload: MemoryCreate, db: Session = Depends(get_db)):
    service = MemoryService(db)
    return service.create_memory(payload)


@router.get("", response_model=list[MemoryRead])
def get_memories(
    client_id: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    service = MemoryService(db)
    return service.list_memories_for_client(client_id)