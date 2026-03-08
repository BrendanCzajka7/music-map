from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/memories")
def get_memories():
    return [
        {
            "lat": 37.7749,
            "lng": -122.4194,
            "song": "Holocene",
            "text": "Watching sunset"
        },
        {
            "lat": 40.7128,
            "lng": -74.0060,
            "song": "Midnight City",
            "text": "First night in NYC"
        }
    ]