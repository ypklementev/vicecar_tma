import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://car_user:strongpassword@localhost/car_service"
    )
    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
    DEV_MODE: bool = os.getenv("DEV_MODE", "false").lower() == "true"


settings = Settings()
