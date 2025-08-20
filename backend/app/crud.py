from typing import Tuple, Sequence
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import func, select

from app.core.database import SessionDep
from app.core.exceptions import AuthorizationError, DatabaseError, NotFoundError
from app.models.token import Message
from app.models.user import User, UserCreate, UserUpdate
from app.core.security import hash_password, verify_password
from app.models.project import Project, ProjectCreate, ProjectUpdate

'''
----------
Users CRUD
----------
'''

async def get_users(db: SessionDep, skip: int = 0, limit: int = 100) -> Tuple[Sequence[User], int]:
    """
    Retrieve users.
    """
    count_statement = select(func.count()).select_from(User)
    count_result = await db.exec(count_statement)
    count = count_result.one()
    
    statement = select(User).offset(skip).limit(limit)
    result = await db.exec(statement)
    users = result.all()
    return users, count

async def get_user_by_email(db: SessionDep, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    result = await db.exec(statement)
    user = result.first()
    return user

async def create_new_user(db: SessionDep, user_in: UserCreate) -> User:
    """
    Create new user.
    """
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
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to create user due to database error") from e
    
async def update_user(db: SessionDep, db_user: User, user_in: UserUpdate) -> User:
    """
    Updates a existing user
    """
    if user_in.email is not None:
        db_user.email = user_in.email
    if user_in.username is not None:
        db_user.username = user_in.username
    if user_in.password is not None:
        hashed_password = hash_password(user_in.password)
        db_user.hashed_password = hashed_password
        
    try:
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to update user due to database error") from e
        
async def delete_user(db: SessionDep, db_user: User) -> Message:
    """
    Removes existing user from database
    """
    try:
        await db.delete(db_user)
        await db.commit()
        return Message(message="User deleted successfully")
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to delete user due to database error") from e

async def authenticate_user(db: SessionDep, email: str, password: str) -> User | None:
    """
    Authenticates a exisitng user
    """
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
        
'''
-------------
Projects CRUD
-------------
'''

async def create_new_project(
     db: SessionDep, current_user: User, project_in: ProjectCreate,
    ) -> Project:
    """
    Create a new project
    """
    db_project = Project(
        title = project_in.title,
        content = project_in.content,
        last_opened = datetime.now(timezone.utc),
        created_at = datetime.now(timezone.utc),
        owner_id= current_user.id,
    )
    db.add(db_project)
    
    try:
        await db.commit()
        await db.refresh(db_project)
        return db_project
    except IntegrityError as e:
        await db.rollback()
        raise DatabaseError("Failed to create project due to database error") from e 

async def get_projects(
    db: SessionDep, current_user: User, skip: int = 0, limit: int = 100
    )-> Tuple[Sequence[Project], int]:
    """
    Retrieve current users items.
    """
    count_statement = (
        select(func.count())
        .select_from(Project)
        .where(Project.owner_id == current_user.id)
    )
    count_result = await db.exec(count_statement)
    count = count_result.one()
    
    statement = (
        select(Project)
       .where(Project.owner_id == current_user.id)
       .offset(skip)
       .limit(limit)
    )
    result = await db.exec(statement)
    projects = result.all()
    
    return (projects, count)

async def get_project(
    db: SessionDep, current_user: User, project_id: UUID) -> Project:
    """
    Retrieve a project by ID from current user
    """
    project = await db.get(Project, project_id)
    if not project:
        raise NotFoundError("Project not found")
    if current_user.id != project.owner_id:
        raise AuthorizationError("You do not have permission to access this project")
    return project

async def update_project(
    db: SessionDep, db_project: Project, project_in: ProjectUpdate) -> Project:
    """
    Updates a project and returns it
    """
    db_project.last_opened = datetime.now(timezone.utc)
    if project_in.title is not None:
        db_project.title = project_in.title
    if project_in.content is not None:
        db_project.content = project_in.content
    
    try:
        await db.commit()
        await db.refresh(db_project)
        return db_project
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to update project due to database error") from e

async def delete_project(db: SessionDep, project: Project) -> Message:
    """
    Deletes project from database
    """
    try:
        await db.delete(project)
        await db.commit()
        return Message(message="Project deleted successfully")
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to delete project") from e