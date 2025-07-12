

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlmodel import Session
from ..models import User
from datetime import datetime, timezone
from fastapi import HTTPException, Depends, status
from ..database import SessionDep

ACCESS_TOKEN_EXPIRE_MINUTES = 15
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)