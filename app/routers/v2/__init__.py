from fastapi import APIRouter

from app.routers.v2 import cars, service, users

router = APIRouter(prefix="/v2")

router.include_router(cars.router)
router.include_router(service.router)
router.include_router(users.router)