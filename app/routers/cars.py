from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Car, MaintenanceRecord, RepairRecord
from app.auth import get_current_user
from app.models import User
from app.schemas import CarCreate
from app.services.oil import calculate_oil_status

router = APIRouter(prefix="/cars", tags=["Cars"])

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

    maintenances = db.query(MaintenanceRecord).filter(
        MaintenanceRecord.car_id == car.id
    ).all()

    repairs = db.query(RepairRecord).filter(
        RepairRecord.car_id == car.id
    ).all()

    combined = []

    for m in maintenances:
        combined.append({
            "type": "maintenance",
            "id": m.id,
            "date": m.date,
            "mileage": m.mileage,
            "total_cost": m.total_cost
        })

    for r in repairs:
        combined.append({
            "type": "repair",
            "id": r.id,
            "date": r.date,
            "mileage": r.mileage,
            "total_cost": r.total_cost
        })

    combined.sort(key=lambda x: x["date"], reverse=True)

    return combined