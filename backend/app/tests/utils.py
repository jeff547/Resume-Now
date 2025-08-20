from datetime import datetime, timezone
import random, string

from pydantic import EmailStr
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.models.project import ProjectCreate, Project
from app.models.user import User, UserCreate
from app.core.config import settings

"""
Generate random objects for testing purposes
"""

def random_string(length: int = 16) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))

def random_email() -> EmailStr:
    name : str = random_string(16)
    domain : str = random.choice(["example.com", "gmail.com", "hotmail.com"])
    return f'{name}{random.randint(10, 9999)}@{domain}'

async def random_user(async_db: AsyncSession) -> tuple[User, str]:
    email = random_email()
    password = random_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_new_user( db=async_db, user_in=user_in)
    return user, password

async def random_project(async_db: AsyncSession, db_user: User) -> Project:
    project_in = ProjectCreate(
        title = random_string(5),
        content = random_string(16),
    )
    project = await crud.create_new_project(async_db, db_user, project_in)
    return project