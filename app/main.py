from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.database import engine
from app.integrations.telegram import send_message
from app.models import Base
from app.routers import cars, maintenance, repairs, users
from app.scheduler import start_scheduler
from app.schemas import Message
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # разрешить все домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cars.router)
app.include_router(maintenance.router)
app.include_router(users.router)
app.include_router(repairs.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.on_event("startup")
def startup_event():
    start_scheduler()


@app.get("/")
def serve_app():
    return "root /"

# @app.post("/send_message")
# def sender(message: Message):
#     try:
#         send_message(message.user, message.text)
#     except:
#         raise HTTPException(status_code=405, detail="Invalid Data") 