import uuid
from httpx import AsyncClient
import pytest
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.models.project import Project
from app.models.user import User
from app.tests.conftest import test_user
from app.tests.utils import random_project, random_string, random_user


@pytest.mark.asyncio
async def test_create_project(
    async_client: AsyncClient, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    """
    Creates a new project
    """
    user = test_user[0]
    data = {"title": random_string(5), "content": random_string(16)}
    
    r = await async_client.post("/projects/", json=data, headers=token_header)
    print(r.json()) # debug
    assert r.status_code == 200 # Successful http request
    proj = r.json()
    
    # Checks
    assert proj['title'] == data['title'] # Title is same as input
    assert proj['content'] == data['content'] # Content is same as input
    assert "id" in proj # ID is generated
    assert proj['owner_id'] == str(user.id) # Owner ID matches

@pytest.mark.asyncio
async def test_read_project(
    async_client: AsyncClient, async_db: AsyncSession, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    # Set up
    user = test_user[0]
    proj = await random_project(async_db=async_db, db_user=user)
    
    r = await async_client.get(f"/projects/{proj.id}", headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 200 # Successful http request
    assert json["id"] == str(proj.id) # ID is same as db
    # Same params as input
    assert json["title"] == proj.title  
    assert json["owner_id"] == str(user.id)
    
@pytest.mark.asyncio
async def test_read_project_not_found(
    async_client: AsyncClient, token_header: dict[str, str]) -> None:
    """
    Read project that doesn't exist
    """
    r = await async_client.get(f"/projects/{uuid.uuid4()}", headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 404 # HTTP 404 NOT FOUND
    assert json['detail'] == "Project not found"

@pytest.mark.asyncio
async def test_read_project_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Read other users project without permission
    """
    other_user = (await random_user(async_db))[0]
    proj = await random_project(async_db, other_user)
    
    r = await async_client.get(f"/projects/{proj.id}", headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 401 # HTTP 401 UNAUTHORIZED
    assert json['detail'] == "You do not have permission to access this project"
    
@pytest.mark.asyncio
async def test_read_multiple_projects(
    async_client: AsyncClient, async_db: AsyncSession, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    """
    Creates and retrieves multiple projects
    """
    user = test_user[0]
    await random_project(async_db, user)
    await random_project(async_db, user)
    
    r = await async_client.get("/projects/", headers=token_header)
    json = r.json()
    proj_1 = json['data'][0]
    proj_2 = json['data'][1]
    
    # Checks
    assert r.status_code == 200 # Successful http request
    assert json['count'] == 2 # Two count projects
    assert proj_1['id'] != proj_2['id'] # Different IDs
    assert proj_1['owner_id'] == proj_2['owner_id'] # Same Owner
    assert proj_1['title'] != proj_2['title'] # Different Titles

@pytest.mark.asyncio
async def test_update_project(
    async_client: AsyncClient, async_db: AsyncSession, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    """
    Update an project
    """
    # Setup
    user = test_user[0]
    proj = await random_project(async_db, user)
    orig_proj = proj.model_dump()
    update = {"title": random_string(5), "content": random_string(16)}
    
    # HTTP REQUEST
    r = await async_client.patch(
        url=f"/projects/{proj.id}",
        json=update,
        headers=token_header)
    assert r.status_code == 200

    # Checks
    json = r.json()
    assert json["title"] != orig_proj["title"] # Changed title
    assert json["content"] != orig_proj["content"] # Changed Content
    assert json["id"] == str(proj.id) # ID is kept
    assert json["owner_id"] == str(proj.owner_id) # Owner isn't changed

@pytest.mark.asyncio
async def test_update_project_not_found(
    async_client: AsyncClient, token_header: dict[str, str]) -> None:
    """
    Update project that doesn't exist
    """
    update = {"title": random_string(5), "content": random_string(16)}
    r = await async_client.patch(
        url=f"/projects/{uuid.uuid4()}",
        json=update,
        headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 404 # HTTP 404 NOT FOUND
    assert json['detail'] == "Project not found"

@pytest.mark.asyncio
async def test_update_project_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Update other users project without permission
    """
    user = (await random_user(async_db))[0]
    proj = await random_project(async_db, user)
    update = {"title": random_string(5), "content": random_string(16)}
    
    # HTTP REQUEST
    r = await async_client.patch(
        url=f"/projects/{proj.id}",
        json=update,
        headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 401 # HTTP 401 UNAUTHORIZED
    assert json['detail'] == "You do not have permission to access this project"

@pytest.mark.asyncio
async def test_delete_project(
    async_client: AsyncClient, async_db: AsyncSession, test_user: tuple[User, str], token_header: dict[str, str]
) -> None:
    """
    Deletes project
    """
    # Setup
    user = test_user[0]
    proj = await random_project(async_db, user)
    
    # HTTP Request
    r = await async_client.delete(f"/projects/{proj.id}", headers=token_header)
    assert r.status_code == 200 # Success
    assert r.json()["message"] == "Project deleted successfully"
    
    assert not await async_db.get(Project, proj.id) # Check no longer in database
    
@pytest.mark.asyncio
async def test_delete_project_not_found(
    async_client: AsyncClient, token_header: dict[str, str]) -> None:
    """
    Update project that doesn't exist
    """
    r = await async_client.delete(
        url=f"/projects/{uuid.uuid4()}",
        headers=token_header)
    
    # Checks
    assert r.status_code == 404 # HTTP 404 NOT FOUND
    assert r.json()['detail'] == "Project not found"

@pytest.mark.asyncio
async def test_delete_project_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Update other users project without permission
    """
    user = (await random_user(async_db))[0]
    proj = await random_project(async_db, user)
    
    # HTTP REQUEST
    r = await async_client.delete(
        url=f"/projects/{proj.id}",
        headers=token_header)
    json = r.json()
    
    # Checks
    assert r.status_code == 401 # HTTP 401 UNAUTHORIZED
    assert json['detail'] == "You do not have permission to access this project"