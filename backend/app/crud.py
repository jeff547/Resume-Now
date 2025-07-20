from typing import Sequence
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.core.database import SessionDep
from app.models.user import User, UserCreate
from app.core.security import hash_password
from app.models.project import Project, ProjectCreate

'''
----------
Users CRUD
----------
'''

async def get_users(db: SessionDep, skip: int = 0, limit: int = 100) -> Sequence[User] | None:
    statement = select(User).offset(skip).limit(limit)
    result = await db.exec(statement)
    users = result.all()
    if not users:
        return None
    return users

async def get_user_by_email(db: SessionDep, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    result = await db.exec(statement)
    user = result.first()
    return user

async def create_new_user(db: SessionDep,user_in: UserCreate) -> User | None:
    db_user = User(
        email = user_in.email,
        username = user_in.username,
        hashed_password = hash_password(user_in.password)
    )
    db.add(db_user)
    
    try:
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except IntegrityError:
        await db.rollback()
        return None
        
async def delete_user(db: SessionDep, user_id: UUID) -> None:
    user = await db.get(User, user_id)
    if not user:
        raise ValueError("User not found")
    try:
        await db.delete(user)
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise RuntimeError("Failed to delete user due to database error") from e
        
        
'''
-------------
Projects CRUD
-------------
'''

async def create_new_project(
    current_user: User, project_in: ProjectCreate, db: SessionDep
    ) -> Project | None:
    db_project = Project(
        title = project_in.title,
        content = project_in.content,
        last_opened = project_in.last_opened,
        created_at = datetime.now(timezone.utc),
        owner_id= current_user.id,
    )
    db.add(db_project)
    
    try:
        await db.commit()
        await db.refresh(db_project)
        return db_project
    except IntegrityError:
        await db.rollback()
        return None
        