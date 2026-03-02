from datetime import datetime
from typing import List
from pydantic import BaseModel


class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    vin: str | None = None
    current_mileage: int


class MaintenanceItemCreate(BaseModel):
    type: str | None
    name: str
    cost: float | None


class MaintenanceCreate(BaseModel):
    date: datetime
    mileage: int
    comment: str | None
    items: List[MaintenanceItemCreate]

class Message(BaseModel):
    text: str
    user: int


class RepairItemCreate(BaseModel):
    type: str | None
    name: str
    cost: float


class RepairCreate(BaseModel):
    date: datetime
    mileage: int
    comment: str | None
    items: List[RepairItemCreate]