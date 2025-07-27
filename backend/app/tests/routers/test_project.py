from httpx import AsyncClient
import pytest

from app.models.project import ProjectCreate
from app.tests.utils import random_string


# @pytest.mark.asyncio
# async def test_create_project(async_client: AsyncClient, async_db) -> None:
#     user = await random_user(async_db)
#     data = {"title": random_string(5), "content": random_string(16), "current_user": user}
#     r = await async_client.post("/", json=data)
#     assert r.status_code == 200
#     proj = r.json()
#     assert proj.title == data['title']
#     assert proj.content == data['content']
#     assert "id" in proj
#     assert proj.owner_id == user.id