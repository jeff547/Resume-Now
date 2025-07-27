
from httpx import AsyncClient
import pytest

from app import crud
from app.models.user import UserCreate
from app.core.config import settings
from sqlmodel.ext.asyncio.session import AsyncSession


@pytest.mark.asyncio
async def test_get_access_token(async_client: AsyncClient, async_db: AsyncSession):
    user = {
        "username": settings.superuser_email,
        "password": settings.superuser_password
    }
    await crud.create_new_user(async_db, UserCreate(email=user['username'], password=user['password']))
    r = await async_client.post("/login/token", data=user)
    token = r.json()
    assert r.status_code == 200
    assert "access_token" in token
    assert token["access_token"]
    
@pytest.mark.asyncio
async def test_incorrect_password(async_client: AsyncClient, async_db):
    user = {
        "username": settings.superuser_email,
        "password": "wrong"
    }
    await crud.create_new_user(
        async_db,
        UserCreate(email=settings.superuser_email, password=settings.superuser_password)
    )
    r = await async_client.post("/login/token", data=user)
    assert r.status_code == 401
    assert r.json()['detail'] == "Incorrect email or password"