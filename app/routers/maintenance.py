from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from app.database import get_db
from app.models import MaintenanceItem, MaintenanceRecord, Car, User
from app.auth import get_current_user
from app.schemas import MaintenanceCreate

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


@router.post("/{car_id}")
def create_maintenance(
    car_id: int,
    data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car = db.query(Car).filter(
        Car.id == car_id,
        Car.user_id == current_user.id
    ).first()

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    total_cost = sum(item.cost or 0 for item in data.items)

    maintenance = MaintenanceRecord(
        car_id=car.id,
        date=data.date,
        mileage=data.mileage,
        total_cost=total_cost,
        comment=data.comment
    )

    db.add(maintenance)
    db.flush()  # получаем maintenance.id

    for item in data.items:
        db.add(
            MaintenanceItem(
                maintenance_id=maintenance.id,
                type=item.type,
                name=item.name,
                cost=item.cost
            )
        )

    if data.mileage > car.current_mileage:
        car.current_mileage = data.mileage

    db.commit()
    db.refresh(maintenance)

    return maintenance


@router.get("/{car_id}")
def get_maintenance_history(
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

    records = db.query(MaintenanceRecord).filter(
        MaintenanceRecord.car_id == car.id
    ).order_by(MaintenanceRecord.date.desc()).all()

    return records
