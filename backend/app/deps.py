from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.core.config import settings
from app.core.database import SessionDep
from app.models.token import TokenPayload
from app.models.user import User
from app import crud


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")
TokenDep = Annotated[str, Depends(oauth2_scheme)]

async def get_current_user(db: SessionDep, token: TokenDep) -> User:    
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
    if not token_data.user:
        raise HTTPException(status_code=404, detail="Missing email in token")
    user = await crud.get_user_by_email(db, token_data.user.email)
    if not user:
        raise HTTPException(status_code=404, detail=f"User not found {token_data.user.email}")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user