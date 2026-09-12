from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="Autonomous Data Watcher API",
    description="Backend API for automated time-series anomaly detection, plain-English summary generation, and email alerts.",
    version="1.0.0"
)

# Enable CORS for frontend integration (React + Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vite (http://localhost:5173) and local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints under /api prefix
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Autonomous Data Watcher API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
