from datetime import datetime, timedelta
import pytest

from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.project import Project, ProjectUpdate
from app.models.user import User, UserCreate, UserUpdate
from app import crud
from app.core.security import verify_password
from app.core.config import settings
from app.tests.utils import random_email, random_string, random_project, random_user

'''
----------
Users CRUD
----------
'''

@pytest.mark.asyncio
async def test_create_user(async_db: AsyncSession) -> None:
    email = random_email()
    password = random_string()
    
    user = await crud.create_new_user(
        async_db, UserCreate(email=email, password=password)
    )
    
    assert user is not None
    assert user.email == email
    assert verify_password(password, user.hashed_password)

@pytest.mark.asyncio
async def test_delete_user(async_db: AsyncSession, test_user: tuple[User, str]) -> None:
    user = test_user[0]
    assert user is not None
    
    result = await crud.delete_user(async_db, user)
    assert result
    
    users, count = await crud.get_users(async_db)
    assert user not in users
    assert count == 0

@pytest.mark.asyncio
async def test_authenticate_user(async_db: AsyncSession) -> None:
    user_in = {
        "email": settings.superuser_email,
        "password": settings.superuser_password
    }

    await crud.create_new_user(async_db, UserCreate(**user_in)) # type: ignore
    
    user = await crud.authenticate_user(async_db, user_in['email'], user_in['password'])
    assert user is not None
    assert user.email == user_in['email']

@pytest.mark.asyncio
async def test_not_authenticate_user(async_db: AsyncSession) -> None:
    email = random_email()
    password = random_string()
    user = await crud.authenticate_user(async_db, email, password)
    assert user is None

@pytest.mark.asyncio
async def test_get_user(test_user: tuple[User, str], async_db: AsyncSession) -> None:
    user = test_user[0]
    assert user is not None
    
    db_user = await async_db.get(User, user.id)
    
    assert db_user is not None
    assert user.email == db_user.email

@pytest.mark.asyncio
async def test_update_user(test_user: tuple[User, str], async_db: AsyncSession) -> None:
    user, password = test_user
    assert user is not None
    orig_email = user.email
    orig_id = user.id
    
    update = UserUpdate(
        email = random_email(), username = random_string(), password = random_string()
    )
    updated_user = await crud.update_user(async_db, user, update)
    
    assert updated_user.id == orig_id
    assert updated_user.email != orig_email
    assert updated_user.username is not None
    assert not verify_password(password, updated_user.hashed_password)

'''
-------------
Projects CRUD
-------------
'''
@pytest.mark.asyncio
async def test_create_project(async_db: AsyncSession) -> None:
    user, _ = await random_user(async_db)
    project = await random_project(async_db, user)
    
    db_project = await crud.get_project(async_db, user, project.id)
    
    assert db_project is not None
    assert db_project.owner_id == user.id
    assert project.title is not None
    assert project.content is not None
    
    now = datetime.now()
    assert now - project.last_opened < timedelta(seconds=5)
    
@pytest.mark.asyncio
async def test_get_multiple_projects(async_db: AsyncSession) -> None:
    user_1, _ = await random_user(async_db)
    user_2, _ = await random_user(async_db)
    
    proj_1 = await random_project(async_db, user_1)
    proj_2 = await random_project(async_db, user_1)
    await random_project(async_db, user_2)
    
    projects, count = await crud.get_projects(async_db, user_1)
    assert proj_1 == projects[0]
    assert proj_2 == projects[1]
    assert count == 2

@pytest.mark.asyncio
async def test_update_project(async_db: AsyncSession) -> None:
    user, _ = await random_user(async_db)
    proj = await random_project(async_db, user)
    
    title = proj.title
    id = proj.id
    content = proj.content
    last_opened = proj.last_opened
    
    change = ProjectUpdate(title = random_string(5))
    
    updated = await crud.update_project(async_db, proj, change)

    assert updated.title != title
    assert updated.id == id
    assert updated.content == content
    assert last_opened < updated.last_opened

@pytest.mark.asyncio
async def test_delete_project(async_db: AsyncSession) -> None:
    user, _ = await random_user(async_db)
    proj = await random_project(async_db, user)
    id = proj.id
    
    r = await crud.delete_project(async_db, proj)
    assert r.message == "Project deleted successfully"
    
    exists = await async_db.get(Project, id)
    assert not exists

    