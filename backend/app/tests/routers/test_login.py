import time
from httpx import AsyncClient
import pytest

from app import crud
from app.core.security import create_access_token
from app.models.user import User, UserCreate
from app.core.config import settings
from sqlmodel.ext.asyncio.session import AsyncSession


@pytest.mark.asyncio
async def test_login(async_client: AsyncClient, async_db: AsyncSession):
    user = {
        "username": settings.superuser_email,
        "password": settings.superuser_password
    }
    await crud.create_new_user(async_db, UserCreate(email=user['username'], password=user['password']))
    r = await async_client.post("/test/login/token", data=user)
    token = r.json()
    assert r.status_code == 200
    assert "access_token" in token
    assert token["access_token"]
    assert 'refresh_token' in r.cookies
    
@pytest.mark.asyncio
async def test_incorrect_password(async_client: AsyncClient, async_db: AsyncSession):
    user = {
        "username": settings.superuser_email,
        "password": "wrong"
    }
    await crud.create_new_user(
        async_db,
        UserCreate(email=settings.superuser_email, password=settings.superuser_password)
    )
    r = await async_client.post("/test/login/token", data=user)
    assert r.status_code == 401
    assert r.json()['detail'] == "Incorrect email or password"
    
@pytest.mark.asyncio
async def test_token_expiration(async_client: AsyncClient, test_user: tuple[User, str]):
    # Initialize user and tokens
    user = test_user[0]
    user_data = {"email": user.email, 'user_uid': str(user.id)}
    access_token = create_access_token(data=user_data, expire_seconds = 1)
    
    # Call Current User with valid access_token
    r = await async_client.get('/users/self', headers= {"Authorization": f"Bearer {access_token}"})
    assert r.status_code == 200
    
    # Call again with expired access token
    time.sleep(1)
    r = await async_client.get('/users/self', headers= {"Authorization": f"Bearer {access_token}"})
    assert r.status_code == 403

@pytest.mark.asyncio
async def test_refresh(async_client: AsyncClient, test_user: tuple[User, str]):
    # Initialize user and tokens
    user, pwd = test_user
    user_data = {"username": user.email, "password": pwd}
    
    # Login new user
    r = await async_client.post("/test/login/token", data=user_data)
    assert r.status_code == 200
    orig_access_token =  r.json()['access_token']
    orig_refresh_token = r.cookies['refresh_token']
    
    # Refresh access token
    r = await async_client.get("/token/refresh")
    print(async_client.cookies)
    assert r.status_code == 200
    new_access_token = r.json()['access_token']
    assert new_access_token != orig_access_token
    
    # Rotate refresh token 
    new_refresh_token = r.cookies['refresh_token']
    assert new_refresh_token != orig_refresh_token
    
    # Call new access token
    r = await async_client.get('/users/self', headers= {"Authorization": f"Bearer {new_access_token}"})
    assert r.status_code == 200

@pytest.mark.asyncio
async def test_invalid_refresh_token(async_client: AsyncClient, test_user: tuple[User, str]):
    # Initialize user and tokens
    user, pwd = test_user
    user_data = {"username": user.email, 'password': pwd}
    
    # Login new user
    r = await async_client.post("/test/login/token", data=user_data)
    assert r.status_code == 200
    async_client.cookies['refresh_token'] = "Invalid_refresh_token"
    
    # Refresh access token
    r = await async_client.get("/token/refresh")
    assert r.status_code == 401
    
@pytest.mark.asyncio
async def test_logout(async_client: AsyncClient, test_user : tuple[User, str]) -> None:
    # Initialize user and tokens
    user, pwd = test_user
    user_data = {"username": user.email, 'password': pwd}
    
    # Login new user
    r = await async_client.post("/test/login/token", data=user_data)
    assert r.status_code == 200
    
    # Logout user
    r = await async_client.delete('/logout')
    assert r.status_code == 200
    assert 'refresh_token' not in async_client.cookies
    
    # No cookies
    r = await async_client.get("/token/refresh")
    assert r.json()['detail'] == "No refresh token"