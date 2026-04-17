from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routers import cars, maintenance, repairs, service, users
from app.routers.v2 import router as router_v2
from app.scheduler import start_scheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# v1 — legacy routes, kept for frontend compatibility
app.include_router(cars.router)
app.include_router(service.router)
app.include_router(maintenance.router)
app.include_router(repairs.router)
app.include_router(users.router)

# v2 — new unified API
app.include_router(router_v2)

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.on_event("startup")
def startup_event():
    start_scheduler()


@app.get("/")
def serve_app():
    return "root /"