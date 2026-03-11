from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

from app.database import get_db
from app.models import Car, RepairRecord, RepairItem, User
from app.auth import get_current_user
from app.schemas import RepairCreate, RepairItemCreate, RepairItemUpdate, RepairRecordResponse, RepairUpdate
from app.utils import recalc_repair_total

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

@router.patch("/{repair_id}")
def edit_repair(
    repair_id: int,
    repair_data: RepairUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repair = db.query(RepairRecord).filter(
        RepairRecord.id == repair_id
    ).first()

    if not repair:
        raise HTTPException(status_code=404, detail="Repair not found")
    
    update_data = repair_data.model_dump(exclude={"items"}, exclude_unset=True)

    for field, value in update_data.items():
        setattr(repair, field, value)

    db.commit()
    db.refresh(repair)

    return repair


@router.post("/{repair_id}/items")
def add_repair_item(
    repair_id: int,
    data: RepairItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repair = (
        db.query(RepairRecord)
        .join(Car)
        .filter(
            RepairRecord.id == repair_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not repair:
        raise HTTPException(404, "Repair not found")

    item = RepairItem(
        repair_id=repair.id,
        name=data.name,
        cost=data.cost,
        type=data.type
    )

    db.add(item)
    db.flush()

    recalc_repair_total(db, repair.id)

    db.commit()
    db.refresh(item)

    return item


@router.patch("/items/{item_id}")
def edit_repair_item(
    item_id: int,
    data: RepairItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = (
        db.query(RepairItem)
        .join(RepairRecord)
        .join(Car)
        .filter(
            RepairItem.id == item_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(404, "Item not found")

    old_cost = item.cost

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    db.flush()

    recalc_repair_total(db, item.repair_id)

    db.commit()

    return item


@router.delete("/items/{item_id}")
def delete_repair_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = (
        db.query(RepairItem)
        .join(RepairRecord)
        .join(Car)
        .filter(
            RepairItem.id == item_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(404, "Item not found")

    db.delete(item)
    db.flush()

    recalc_repair_total(db, item.repair_id)

    db.commit()

    return {"status": "deleted"}