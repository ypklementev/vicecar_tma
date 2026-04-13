from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import ServiceItem, ServiceRecord


def recalc_service_total(db: Session, record_id: int) -> float:
    total = (
        db.query(func.coalesce(func.sum(ServiceItem.cost), 0))
        .filter(ServiceItem.record_id == record_id)
        .scalar()
    )

    db.query(ServiceRecord).filter(
        ServiceRecord.id == record_id
    ).update({"total_cost": total})

    return total


def apply_service_update(db: Session, record: ServiceRecord, data) -> ServiceRecord:
    """Update scalar fields and optionally full-replace items in one shot."""

    for field, value in data.model_dump(exclude={"items"}, exclude_unset=True).items():
        setattr(record, field, value)

    if data.items is not None:
        for old_item in record.items:
            db.delete(old_item)
        db.flush()

        for item in data.items:
            db.add(ServiceItem(record_id=record.id, **item.model_dump()))

        record.total_cost = sum(i.cost or 0 for i in data.items)

    return record