from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Car, ServiceRecord, User
from app.auth import get_current_user
from app.schemas import CarCreate
from app.services.oil import calculate_oil_status

router = APIRouter(prefix="/cars", tags=["Cars v2"])


@router.get("/")
def get_my_cars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Car).filter(Car.user_id == current_user.id).all()


@router.post("/")
def create_car(
    car_data: CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car = Car(
        user_id=current_user.id,
        **car_data.model_dump()
    )

    db.add(car)
    db.commit()
    db.refresh(car)

    return car


@router.get("/{car_id}/oil-status")
def get_oil_status(
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

    return calculate_oil_status(car, db)


@router.get("/{car_id}/service-book")
def get_service_book(
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

    records = (
        db.query(ServiceRecord)
        .filter(ServiceRecord.car_id == car.id)
        .order_by(ServiceRecord.date.desc())
        .all()
    )

    return [
        {
            "type": r.service_type.value,
            "id": r.id,
            "date": r.date,
            "mileage": r.mileage,
            "total_cost": r.total_cost,
        }
        for r in records
    ]