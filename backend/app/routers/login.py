from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import SessionDep
from app.core.config import settings
from app.core import security
from app.models.token import Token
from app import crud


router = APIRouter(tags=["login"])

@router.post("/login/token")
async def login_access_token(
    db: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token | None:
    """
    OAuth2-compatible token login, get an access token for api requests
    """
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = security.create_access_token(
        data=user.email, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")