import pytest

from httpx import AsyncClient
from sqlmodel.ext.asyncio.session import AsyncSession

@pytest.mark.asyncio
async def test_get_self_user(
    async_client: AsyncClient, async_db: AsyncSession, normal_user_token_header: dict[str, str]):
    """
    Returns current user
    """
    r = await async_client.get("/users/self", headers=normal_user_token_header)
    assert r.status_code == 200
    print(r.json())

# # @pytest.mark.asyncio
# async def test_