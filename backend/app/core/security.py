from datetime import datetime, timedelta, timezone
from typing import Any
import uuid
from passlib.context import CryptContext

import jwt

from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# Creates an access token by encoding user data into a json webtoken  
def create_access_token(
    data: dict, expire_seconds: float = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    ) -> str:
    payload = {
        'exp': datetime.now(timezone.utc) +  timedelta(seconds=expire_seconds),
        'user': data,
        'jti': str(uuid.uuid4())
    }

    encoded_jwt = jwt.encode(
        payload=payload, 
        key=settings.secret_key, 
        algorithm=settings.algorithm
    )
    return encoded_jwt

# Creates an refresh token to reload access tokens without repeated sign in
def create_refresh_token(data: dict, expires_days: int = settings.REFRESH_TOKEN_EXPIRE_DAYS) -> str:
    payload = {
        'exp': datetime.now(timezone.utc) +  timedelta(days=expires_days),
        'user': data,
        'jti': str(uuid.uuid4())
    }
    encoded_jwt = jwt.encode(
        payload=payload, 
        key=settings.secret_key, 
        algorithm=settings.algorithm
    )
    return encoded_jwt
    

# Check if unhashed plain password input is equal to the hashed password in database 
def verify_password(unhashed: str, hashed: str) -> bool:
    return pwd_context.verify(unhashed, hashed)

# hashes plain password using hashing method from config.py
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
    