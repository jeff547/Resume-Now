from httpx import AsyncClient
import pytest
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.models.user import UserCreate
from app.tests.utils import random_email, random_string

@pytest.mark.asyncio
async def test_create_user(async_client: AsyncClient):
    user_in = {"email": random_email(), "password": random_string()}
    
    r = await async_client.post("/users/", json=user_in)
    
    data = r.json()
    
    assert r.status_code == 200
    assert data["email"] == user_in['email']
    assert 'id' in data
    
    r = await async_client.get("/users/", params={"email": user_in['email']})
    assert r.status_code == 200

@pytest.mark.asyncio
async def test_exisiting_email(async_client: AsyncClient):
    user_in = {"email": random_email(), "password": random_string(),}

    r1 = await async_client.post("/users/", json=user_in)
    r2 = await async_client.post("/users/", json=user_in)
    
    assert r1.status_code == 200
    assert r2.status_code == 409
    assert r2.json()['detail'] == "A user with this email already exists."

@pytest.mark.asyncio
async def test_delete_user(async_client: AsyncClient, async_db: AsyncSession):
    user = await crud.create_new_user(
        async_db, UserCreate(email=random_email(), password=random_string()))
    assert user is not None
    user_id = user.id
    r = await async_client.delete(f'/users/{user_id}')
    assert r.status_code == 200
    deleted_user = r.json()
    assert deleted_user["message"] == "User deleted successfully"


    
    
    
    
    
        