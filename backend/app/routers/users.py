from fastapi import APIRouter

from app.dependencies import SessionDep
from app.models.user import User, UserCreate
from app.services.user_services import create_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=User)
async def create_user(user_in: UserCreate, db: SessionDep):
    return create_user(user_in, db)