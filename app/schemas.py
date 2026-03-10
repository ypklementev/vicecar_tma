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

class MaintenanceItemResponse(BaseModel):
    id: int
    name: str
    cost: float

    class Config:
        from_attributes = True

class MaintenanceRecordResponse(BaseModel):
    id: int
    car_id: int
    date: datetime
    mileage: int
    total_cost: float
    comment: str | None

    items: List[MaintenanceItemResponse]

    class Config:
        from_attributes = True

class RepairItemResponse(BaseModel):
    id: int
    name: str
    cost: float

    class Config:
        from_attributes = True

class RepairRecordResponse(BaseModel):
    id: int
    car_id: int
    date: datetime
    mileage: int
    total_cost: float
    comment: str | None

    items: List[RepairItemResponse]

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    telegram_id: int
    first_name: str
    username: str