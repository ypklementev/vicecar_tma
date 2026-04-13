from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Car, ServiceRecord, ServiceItem, ServiceType, User
from app.auth import get_current_user
from app.schemas import ServiceCreate, ServiceRecordResponse
from app.utils import recalc_service_total

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


@router.post("/{car_id}", response_model=ServiceRecordResponse)
def create_maintenance(
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
        raise HTTPException(status_code=400, detail="Maintenance must contain at least one item")

    total_cost = sum(item.cost or 0 for item in data.items)

    record = ServiceRecord(
        car_id=car.id,
        service_type=ServiceType.MAINTENANCE,
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

    return (
        db.query(ServiceRecord)
        .options(selectinload(ServiceRecord.items))
        .filter(
            ServiceRecord.car_id == car.id,
            ServiceRecord.service_type == ServiceType.MAINTENANCE
        )
        .order_by(ServiceRecord.date.desc())
        .all()
    )