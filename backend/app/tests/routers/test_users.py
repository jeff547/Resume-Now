from uuid import UUID
from httpx import AsyncClient
import pytest

from app.models.user import User
from app import crud
from app.core.security import verify_password
from ..conftest import async_client, async_db
from ..utils import random_email, random_string, create_user

@pytest.mark.asyncio
async def test_create_user(async_client: AsyncClient, async_db):
    email = random_email()
    password = random_string()
    
    response = await create_user(async_client, email, password)
    
    data = response.json()
    
    assert response.status_code == 200
    assert data["email"] == email
    assert verify_password(password, data['hashed_password'])
    assert 'id' in data
    
    user = await crud.get_user_by_email(async_db, email)
    assert user is not None
    assert user.email == email

    
@pytest.mark.asyncio
async def test_exisiting_email(async_client: AsyncClient):
    email = random_email()
    password = random_string()
    
    response_1 = await create_user(async_client, email, password)
    response_2 = await create_user(async_client, email, password)
    
    assert response_1.status_code == 200
    assert response_2.status_code == 409
    assert response_2.json()['detail'] == "A user with this email already exists."

@pytest.mark.asyncio
async def test_query_multiple_users(async_client: AsyncClient, async_db, k: int = 5):
    emails = []
    for i in range(k):
        emails.append(random_email())
        password = random_string()
        response = await create_user(async_client, emails[i], password)
        assert response.status_code == 200
        assert response.json()["email"] == emails[i]
    users = await crud.get_users(async_db, 0, k)
    assert users is not None
    for i in range(k):
        assert emails[i] == users[i].email
        
@pytest.mark.asyncio
async def test_delete_user(async_client: AsyncClient, async_db):
    email = random_email()
    password = random_string()
    
    response = await create_user(async_client, email, password)
    user_id = UUID(response.json()['id'])
    assert response.status_code == 200
    
    result = await crud.delete_user(async_db, user_id)
    assert result is None
    
    user = await crud.get_user_by_email(async_db, email)
    assert user is None
    
    
    

    
    
    
    
    
        