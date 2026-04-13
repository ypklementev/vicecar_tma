from datetime import datetime
from typing import List
from pydantic import BaseModel

from app.models import ServiceType


# ── Car ───────────────────────────────────────────────────────────────────────

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    vin: str | None = None
    current_mileage: int


# ── Service items ─────────────────────────────────────────────────────────────

class ServiceItemCreate(BaseModel):
    type: str | None = None
    name: str
    cost: float | None = None


class ServiceItemUpdate(BaseModel):
    name: str | None = None
    cost: float | None = None
    type: str | None = None


class ServiceItemResponse(BaseModel):
    id: int
    name: str
    cost: float | None
    type: str | None

    class Config:
        from_attributes = True


# ── Service records ───────────────────────────────────────────────────────────

class ServiceCreate(BaseModel):
    service_type: ServiceType
    date: datetime
    mileage: int
    comment: str | None = None
    items: List[ServiceItemCreate]


class ServiceUpdate(BaseModel):
    date: datetime | None = None
    mileage: int | None = None
    comment: str | None = None
    items: list[ServiceItemCreate] | None = None


class ServiceRecordResponse(BaseModel):
    id: int
    car_id: int
    service_type: ServiceType
    date: datetime
    mileage: int
    total_cost: float
    comment: str | None
    items: List[ServiceItemResponse]

    class Config:
        from_attributes = True


# ── Misc ──────────────────────────────────────────────────────────────────────

class Message(BaseModel):
    text: str
    user: int


class UserResponse(BaseModel):
    id: int
    telegram_id: int
    first_name: str
    username: str