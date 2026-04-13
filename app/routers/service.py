from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import Optional

from app.database import get_db
from app.models import Car, ServiceRecord, ServiceItem, ServiceType, User
from app.auth import get_current_user
from app.schemas import (
    ServiceCreate,
    ServiceUpdate,
    ServiceItemCreate,
    ServiceItemUpdate,
    ServiceRecordResponse,
)
from app.utils import recalc_service_total, apply_service_update

router = APIRouter(
    prefix="/service",
    tags=["Service"]
)


@router.post("/{car_id}", response_model=ServiceRecordResponse)
def create_service_record(
    car_id: int,
    data: ServiceCreate,
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
        raise HTTPException(status_code=400, detail="Service record must contain at least one item")

    total_cost = sum(item.cost or 0 for item in data.items)

    record = ServiceRecord(
        car_id=car.id,
        service_type=data.service_type,
        date=data.date,
        mileage=data.mileage,
        total_cost=total_cost,
        comment=data.comment
    )

    db.add(record)
    db.flush()

    for item in data.items:
        db.add(ServiceItem(
            record_id=record.id,
            type=item.type,
            name=item.name,
            cost=item.cost
        ))

    if data.mileage > car.current_mileage:
        car.current_mileage = data.mileage

    db.commit()
    db.refresh(record)

    return record


@router.get("/{car_id}", response_model=list[ServiceRecordResponse])
def get_service_history(
    car_id: int,
    service_type: Optional[ServiceType] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car = db.query(Car).filter(
        Car.id == car_id,
        Car.user_id == current_user.id
    ).first()

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    query = (
        db.query(ServiceRecord)
        .options(selectinload(ServiceRecord.items))
        .filter(ServiceRecord.car_id == car.id)
    )

    if service_type:
        query = query.filter(ServiceRecord.service_type == service_type)

    return query.order_by(ServiceRecord.date.desc()).all()


@router.patch("/{record_id}", response_model=ServiceRecordResponse)
def edit_service_record(
    record_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = (
        db.query(ServiceRecord)
        .join(Car)
        .filter(
            ServiceRecord.id == record_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Service record not found")

    apply_service_update(db, record, data)

    db.commit()
    db.refresh(record)

    return record


@router.post("/{record_id}/items")
def add_service_item(
    record_id: int,
    data: ServiceItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = (
        db.query(ServiceRecord)
        .join(Car)
        .filter(
            ServiceRecord.id == record_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Service record not found")

    item = ServiceItem(
        record_id=record.id,
        name=data.name,
        cost=data.cost,
        type=data.type
    )

    db.add(item)
    db.flush()

    recalc_service_total(db, record.id)

    db.commit()
    db.refresh(item)

    return item


@router.patch("/items/{item_id}")
def edit_service_item(
    item_id: int,
    data: ServiceItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = (
        db.query(ServiceItem)
        .join(ServiceRecord)
        .join(Car)
        .filter(
            ServiceItem.id == item_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.flush()
    recalc_service_total(db, item.record_id)
    db.commit()

    return item


@router.delete("/items/{item_id}")
def delete_service_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = (
        db.query(ServiceItem)
        .join(ServiceRecord)
        .join(Car)
        .filter(
            ServiceItem.id == item_id,
            Car.user_id == current_user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    record_id = item.record_id

    db.delete(item)
    db.flush()

    recalc_service_total(db, record_id)
    db.commit()

    return {"status": "deleted"}