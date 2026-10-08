"""One server for the API and the built React dashboard."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

if __package__:
    from .analysis import get_dashboard
else:
    from analysis import get_dashboard

FRONTEND = Path(__file__).resolve().parents[1] / "frontend" / "dist"
dashboard_data = get_dashboard()  # Load once; invalid or missing data stops startup.
app = FastAPI(title="Titanic Analysis", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def welcome():
    if (FRONTEND / "index.html").is_file():
        return FileResponse(FRONTEND / "index.html", headers={"Cache-Control": "no-cache"})
    return {"message": "Welcome to Titanic Analysis by Micheal Makuach Aguto. Explore /api/dashboard."}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/dashboard")
def dashboard():
    return dashboard_data


if (FRONTEND / "assets").is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND / "assets"), name="assets")
