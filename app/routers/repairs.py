from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

from app.database import get_db
from app.models import Car, RepairRecord, RepairItem, User
from app.auth import get_current_user
from app.schemas import RepairCreate, RepairRecordResponse

router = APIRouter(
    prefix="/repairs",
    tags=["Repairs"]
)

@router.post("/{car_id}")
def create_repair(
    car_id: int,
    data: RepairCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car = db.query(Car).filter(
        Car.id == car_id,
        Car.user_id == current_user.id
    ).first()

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    if not data.items:
        raise HTTPException(status_code=400, detail="Repair must contain at least one item")

    total_cost = sum(item.cost for item in data.items)

    repair = RepairRecord(
        car_id=car.id,
        date=data.date,
        mileage=data.mileage,
        total_cost=total_cost,
        comment=data.comment
    )

    db.add(repair)
    db.flush()  # получаем repair.id

    for item in data.items:
        db.add(
            RepairItem(
                repair_id=repair.id,
                type=item.type,
                name=item.name,
                cost=item.cost
            )
        )

    # обновляем пробег машины
    if data.mileage > car.current_mileage:
        car.current_mileage = data.mileage

    db.commit()
    db.refresh(repair)

    return repair


@router.get("/{car_id}", response_model=list[RepairRecordResponse])
def get_repairs(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car = db.query(Car).filter(
        Car.id == car_id,
        Car.user_id == current_user.id
    ).first()

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    repairs = (
        db.query(RepairRecord)
        .options(selectinload(RepairRecord.items))
        .filter(RepairRecord.car_id == car.id)
        .order_by(RepairRecord.date.desc())
        .all()
    )

    return repairs