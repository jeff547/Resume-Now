import jwt
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, status, Response, Cookie
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
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
) -> Token | None:
    """
    OAuth2-compatible token login, get an access token for api requests
    """
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    # Check authentication
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    # Creates access token
    access_token = security.create_access_token(
        data={"email": user.email, "user_uid": str(user.id)}
    )
    # Creates refresh token
    refresh_token = security.create_refresh_token(
        data={"email": user.email, "user_uid": str(user.id)}
    )

    # Set HTTP only refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # HTTPS
        samesite="strict",  # prevents CSRF
        max_age=7 * 24 * 60 * 60,
    )

    return Token(access_token=access_token, token_type="bearer")


@router.post("/test/login/token")
async def test_login_access_token(
    db: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
) -> Token | None:
    """
    OAuth2-compatible token login, get an access token for api requests
    """
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    # Check authentication
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    # Creates access token
    access_token = security.create_access_token(
        data={"email": user.email, "user_uid": str(user.id)}
    )
    # Creates refresh token
    refresh_token = security.create_refresh_token(
        data={"email": user.email, "user_uid": str(user.id)}
    )

    # Set HTTP only refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Not sent over HTTPS
        samesite="strict",  # prevents CSRF
        max_age=7 * 24 * 60 * 60,
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/token/refresh")
async def refresh_access_token(
    response: Response, refresh_token: str | None = Cookie(default=None)
) -> Token | None:
    if refresh_token is None:
        raise HTTPException(status_code=404, detail="No refresh token")
    try:
        # Decode refresh token
        payload = jwt.decode(
            refresh_token, settings.secret_key, algorithms=[settings.algorithm]
        )
        user_data = payload["user"]
        # Create a new valid access token
        new_access_token = security.create_access_token(user_data)
        # Rotates the refresh token to prevent reuse attacks
        new_refresh_token = security.create_refresh_token(user_data)
        # Set HTTP only refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=True,  # HTTPS
            samesite="strict",  # prevents CSRF
            max_age=7 * 24 * 60 * 60,
        )
        return Token(access_token=new_access_token, token_type="bearer")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.delete("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
