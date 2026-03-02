from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "telegram_id": current_user.telegram_id,
        "first_name": current_user.first_name,
        "username": current_user.username
    }