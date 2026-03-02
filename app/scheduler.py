from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Car, User
from app.services.oil import calculate_oil_status
from app.integrations.telegram import send_message  # сделаем дальше


scheduler = BackgroundScheduler()

def check_oil_changes():
    db: Session = SessionLocal()

    try:
        cars = db.query(Car).all()

        for car in cars:
            status = calculate_oil_status(car, db)

            if status["status"] == "overdue":
                next_mileage = status["next_change_mileage"]

                if car.last_oil_notification_mileage == next_mileage:
                    continue  # уже уведомляли

                user = db.query(User).filter(User.id == car.user_id).first()

                if user:
                    text = (
                        f"🚗 {car.brand} {car.model}\n"
                        f"Пора менять масло!\n"
                        f"Текущий пробег: {car.current_mileage} км\n"
                        f"Рекомендуемая замена: {next_mileage} км"
                    )

                    send_message(user.telegram_id, text)

                    car.last_oil_notification_mileage = next_mileage
                    db.commit()

    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(
        check_oil_changes,
        trigger="interval",
        hours=12
    )
    scheduler.start()