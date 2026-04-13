from sqlalchemy import String, Integer, ForeignKey, Boolean, Date, Numeric, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base
import enum


class ServiceType(str, enum.Enum):
    MAINTENANCE = "maintenance"
    REPAIR = "repair"


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
    service_records: Mapped[list["ServiceRecord"]] = relationship(back_populates="car")

    @property
    def maintenances(self):
        return [r for r in self.service_records if r.service_type == ServiceType.MAINTENANCE]

    @property
    def repairs(self):
        return [r for r in self.service_records if r.service_type == ServiceType.REPAIR]


class ServiceRecord(Base):
    __tablename__ = "service_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id"))
    service_type: Mapped[ServiceType] = mapped_column(
        Enum(ServiceType), nullable=False, index=True
    )
    date: Mapped[datetime]
    mileage: Mapped[int]
    total_cost: Mapped[float]
    comment: Mapped[str | None]

    car: Mapped["Car"] = relationship(back_populates="service_records")
    items: Mapped[list["ServiceItem"]] = relationship(
        back_populates="record",
        cascade="all, delete-orphan"
    )


class ServiceItem(Base):
    __tablename__ = "service_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    record_id: Mapped[int] = mapped_column(ForeignKey("service_records.id"))
    name: Mapped[str]
    type: Mapped[str | None] = mapped_column(nullable=True)
    cost: Mapped[float | None]

    record: Mapped["ServiceRecord"] = relationship(back_populates="items")