from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import RepairItem, RepairRecord


def recalc_repair_total(db: Session, repair_id: int) -> float:
    total = (
        db.query(func.coalesce(func.sum(RepairItem.cost), 0))
        .filter(RepairItem.repair_id == repair_id)
        .scalar()
    )

    db.query(RepairRecord).filter(
        RepairRecord.id == repair_id
    ).update({"total_cost": total})

    return total