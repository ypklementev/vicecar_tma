from sqlalchemy import String, Integer, ForeignKey, Boolean, Date, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(unique=True, index=True)
    username: Mapped[str | None]
    first_name: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    cars: Mapped[list["Car"]] = relationship(back_populates="user")


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    brand: Mapped[str]
    model: Mapped[str]
    year: Mapped[int]
    vin: Mapped[str | None]
    current_mileage: Mapped[int]
    oil_change_interval_km: Mapped[int] = mapped_column(default=8000)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    last_oil_notification_mileage: Mapped[int | None] = mapped_column(nullable=True)

    user: Mapped["User"] = relationship(back_populates="cars")
    maintenances: Mapped[list["MaintenanceRecord"]
                         ] = relationship(back_populates="car")
    repairs: Mapped[list["RepairRecord"]] = relationship(back_populates="car")


class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id"))
    date: Mapped[datetime]
    mileage: Mapped[int]
    total_cost: Mapped[float]
    comment: Mapped[str | None]

    car: Mapped["Car"] = relationship(back_populates="maintenances")
    items: Mapped[list["MaintenanceItem"]] = relationship(
        back_populates="maintenance",
        cascade="all, delete-orphan"
    )


class MaintenanceItem(Base):
    __tablename__ = "maintenance_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    maintenance_id: Mapped[int] = mapped_column(ForeignKey("maintenance_records.id"))

    type: Mapped[str | None] = mapped_column(nullable=True)
    name: Mapped[str]
    cost: Mapped[float | None]

    maintenance: Mapped["MaintenanceRecord"] = relationship(back_populates="items")


class RepairRecord(Base):
    __tablename__ = "repair_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id"))
    date: Mapped[datetime]
    mileage: Mapped[int]
    total_cost: Mapped[float]
    comment: Mapped[str | None]

    car: Mapped["Car"] = relationship(back_populates="repairs")
    items: Mapped[list["RepairItem"]] = relationship(
        back_populates="repair",
        cascade="all, delete-orphan"
    )


class RepairItem(Base):
    __tablename__ = "repair_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    repair_id: Mapped[int] = mapped_column(ForeignKey("repair_records.id"))

    name: Mapped[str]
    type: Mapped[str | None]
    cost: Mapped[float]

    repair: Mapped["RepairRecord"] = relationship(back_populates="items")
