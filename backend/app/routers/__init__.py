from . import memories
from fastapi import APIRouter

router = APIRouter()
router.include_router(memories.router)