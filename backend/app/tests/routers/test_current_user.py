import pytest

from httpx import AsyncClient
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.core.security import verify_password
from app.models.user import User
from app.tests.utils import random_email, random_string


@pytest.mark.asyncio
async def test_get_self_user(
    async_client: AsyncClient, token_header: dict[str, str]) -> None:
    """
    Returns current user
    """
    r = await async_client.get("/users/self", headers=token_header)
    assert r.status_code == 200
    assert "id" in r.json() 
    
@pytest.mark.asyncio
async def test_update_self_user(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Updates user email and/or username
    """
    user = (await crud.get_users(async_db))[0][0]
    old_username = user.username
    old_id = str(user.id)
    old_email = user.email
    assert not old_username
    
    update = {"username": random_string(), "email": random_email(),}
    
    r = await async_client.patch("/users/self", json=update, headers=token_header)
    assert r.status_code == 200

    user_data = r.json()
    print(r.json())
    assert old_id == user_data['id']
    assert user_data['username'] != old_username
    assert user_data['email'] != old_email
    
@pytest.mark.asyncio
async def test_update_password(
    async_client: AsyncClient, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    """
    Updates current user password
    """
    user, old_pwd = test_user
    new_pwd = random_string()
    update = {"current_password": old_pwd, "new_password": new_pwd}
    
    r = await async_client.patch(
        url="/users/self/password", json=update, headers=token_header)
    assert r.status_code == 200
    
    # Old password doesn't work but New password works
    assert not verify_password(old_pwd, user.hashed_password)
    assert verify_password(new_pwd, user.hashed_password)
    
    # Try logging in with new password
    data = {"username": user.email, "password": new_pwd}
    r = await async_client.post("/login/token", data=data)
    assert r.status_code == 200
    assert "access_token" in r.json()
    
@pytest.mark.asyncio
async def test_update_password_wrong_current(
    async_client: AsyncClient, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    user, _ = test_user
    update = {"current_password": "wrongpassword", "new_password": random_string()}

    r = await async_client.patch("/users/self/password", json=update, headers=token_header)
    assert r.status_code == 401
    assert r.json()["detail"] == "Incorrect Password"
    

@pytest.mark.asyncio
async def test_delete_self_user(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Deletes current user
    """
    _, count = await crud.get_users(async_db)
    assert count == 1
    r = await async_client.delete("/users/self", headers=token_header)
    assert r.status_code == 200
    _, count = await crud.get_users(async_db)
    assert count == 0