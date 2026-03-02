from sqlalchemy.orm import Session
from app.models import MaintenanceItem, MaintenanceRecord, Car


def get_last_oil_change(car: Car, db: Session):
    return (
        db.query(MaintenanceRecord)
        .join(MaintenanceItem)
        .filter(
            MaintenanceRecord.car_id == car.id,
            MaintenanceItem.type == "oil"
        )
        .order_by(MaintenanceRecord.mileage.desc())
        .first()
    )


def calculate_oil_status(car: Car, db: Session):
    last_record = get_last_oil_change(car, db)

    if not last_record:
        return {
            "status": "no_data",
            "message": "Нет данных о замене масла"
        }

    next_change_mileage = last_record.mileage + car.oil_change_interval_km
    remaining_km = next_change_mileage - car.current_mileage

    if remaining_km <= 0:
        status = "overdue"
    elif remaining_km <= 500:
        status = "soon"
    else:
        status = "ok"

    return {
        "status": status,
        "last_change_mileage": last_record.mileage,
        "next_change_mileage": next_change_mileage,
        "current_mileage": car.current_mileage,
        "remaining_km": remaining_km
    }


