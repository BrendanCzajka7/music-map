from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import Base, engine
from app.routers.memories import router as memories_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(memories_router)


@app.get("/health")
def health():
    return {"status": "ok"}