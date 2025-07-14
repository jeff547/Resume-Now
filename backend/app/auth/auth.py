from datetime import datetime, timedelta

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends, status

from app.dependencies import SessionDep
from app.core.config import settings
from app.core.security import verify_password
from app.models.user import User
from app.services.user_services import get_user_by_email


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def authenticate_user(email: str, password: str, db: SessionDep) -> User | None:
    user = await get_user_by_email(email, db)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user