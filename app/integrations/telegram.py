import requests
from app.config import settings


def send_message(chat_id: int, text: str) -> None:
    url = f"https://api.telegram.org/bot{settings.BOT_TOKEN}/sendMessage"

    response = requests.post(
        url,
        json={
            "chat_id": chat_id,
            "text": text
        },
        timeout=10
    )

    if not response.ok:
        print("Telegram error:", response.text)