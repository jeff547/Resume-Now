from datetime import datetime, timedelta, timezone
from typing import Any
from passlib.context import CryptContext

import jwt

from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# Creates an access token by encoding user data into a json webtoken  
def create_access_token(data: str | Any, expires_delta: timedelta) -> str:
    expiration = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expiration, "sub": str(data)}
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# Check if unhashed plain password input is equal to the hashed password in database 
def verify_password(unhashed: str, hashed: str) -> bool:
    return pwd_context.verify(unhashed, hashed)

# hashes plain password using hashing method from config.py
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
    