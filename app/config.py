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
    SSH_HOST: str = os.getenv("SSH_HOST", "")
    SSH_PORT: int = int(os.getenv("SSH_PORT", ""))
    SSH_USER: str = os.getenv("SSH_USER", "")
    SSH_KEY_PATH: str = os.getenv("SSH_KEY_PATH", "")
    DB_HOST: str = os.getenv("DB_HOST", "")
    DB_PORT: int = int(os.getenv("DB_PORT", ""))
    DB_USER: str = os.getenv("DB_USER", "")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "")
    SSH_KEY_PASSPHRASE: str = os.getenv("SSH_KEY_PASSPHRASE", "")

settings = Settings()
