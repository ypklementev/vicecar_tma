import json
import hashlib
import hmac
from urllib.parse import parse_qsl

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.config import settings


def verify_telegram_webapp(init_data: str) -> dict:
    parsed = parse_qsl(init_data, keep_blank_values=True)

    data = {}
    hash_from_telegram = None

    for key, value in parsed:
        if key == "hash":
            hash_from_telegram = value
        elif key != "signature":  # ВАЖНО
            data[key] = value

    if not hash_from_telegram:
        raise HTTPException(status_code=400, detail="Invalid Telegram data")

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(data.items())
    )

    secret_key = hmac.new(
        settings.BOT_TOKEN.encode(),
        b"WebAppData",
        hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, hash_from_telegram):
        raise HTTPException(403, "Invalid Telegram signature")

    return data


def get_current_user(
    x_telegram_init_data: str = Header(None),
    db: Session = Depends(get_db)
) -> User:

    # DEV режим (мок-пользователь)
    if settings.DEV_MODE and not x_telegram_init_data:
        telegram_id = 665817354
        first_name = "DevUser"
        username = "devuser"

        user = db.query(User).filter(User.telegram_id == telegram_id).first()

        if not user:
            user = User(
                telegram_id=telegram_id,
                first_name=first_name,
                username=username
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return user

    # PROD режим (Telegram)
    if not x_telegram_init_data:
        raise HTTPException(status_code=401, detail="Missing Telegram auth")

    data = verify_telegram_webapp(x_telegram_init_data)

    user_data = json.loads(data.get("user"))

    telegram_id = user_data["id"]

    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    if not user:
        # user = User(
        #     telegram_id=telegram_id,
        #     username=user_data.get("username"),
        #     first_name=user_data.get("first_name")
        # )
        # db.add(user)
        # db.commit()
        # db.refresh(user)
        raise HTTPException(status_code=403, detail="Forbidden")

    return user
