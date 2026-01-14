from datetime import datetime, timezone
from typing import Sequence, Tuple
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import func, select

from app.core.database import SessionDep
from app.core.exceptions import AuthorizationError, DatabaseError, NotFoundError
from app.core.security import hash_password, verify_password
from app.models.resume import Resume, ResumeCreate, ResumeUpdate
from app.models.token import Message
from app.models.user import User, UserCreate, UserUpdate

"""
----------
Users CRUD
----------
"""


async def get_users(
    db: SessionDep, skip: int = 0, limit: int = 100
) -> Tuple[Sequence[User], int]:
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
        email=user_in.email,
        username=user_in.username,
        hashed_password=hash_password(user_in.password),
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


"""
-------------
Resumes CRUD
-------------
"""


async def create_new_resume(
    db: SessionDep,
    current_user: User,
    resume_in: ResumeCreate,
) -> Resume:
    """
    Create a new resume
    """

    db_resume = Resume(
        title=resume_in.title,
        input_data=resume_in.input_data,
        last_opened=datetime.now(timezone.utc),
        created_at=datetime.now(timezone.utc),
        owner_id=current_user.id,
        owner=current_user,
    )

    db.add(db_resume)

    try:
        await db.commit()
        await db.refresh(db_resume)
        return db_resume
    except IntegrityError as e:
        await db.rollback()
        raise DatabaseError("Failed to create resume due to database error") from e


async def get_resumes(
    db: SessionDep, current_user: User, skip: int = 0, limit: int = 100
) -> Tuple[Sequence[Resume], int]:
    """
    Retrieve current users items.
    """
    count_statement = (
        select(func.count())
        .select_from(Resume)
        .where(Resume.owner_id == current_user.id)
    )
    count_result = await db.exec(count_statement)
    count = count_result.one()

    statement = (
        select(Resume)
        .where(Resume.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    result = await db.exec(statement)
    resumes = result.all()

    return (resumes, count)


async def get_resume(db: SessionDep, current_user: User, resume_id: UUID) -> Resume:
    """
    Retrieve a resume by ID from current user
    """
    resume = await db.get(Resume, resume_id)
    if not resume:
        raise NotFoundError("Resume not found")
    if current_user.id != resume.owner_id:
        raise AuthorizationError("You do not have permission to access this resume")
    return resume


async def update_resume(
    db: SessionDep, db_resume: Resume, resume_in: ResumeUpdate
) -> Resume:
    """
    Updates a resume and returns it
    """
    db_resume.last_opened = datetime.now(timezone.utc)
    if resume_in.title is not None:
        db_resume.title = resume_in.title
    if resume_in.input_data is not None:
        db_resume.input_data = resume_in.input_data

    try:
        await db.commit()
        await db.refresh(db_resume)
        return db_resume
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to update resume due to database error") from e


async def delete_resume(db: SessionDep, resume: Resume) -> Message:
    """
    Deletes resume from database
    """
    try:
        await db.delete(resume)
        await db.commit()
        return Message(message="Resume deleted successfully")
    except Exception as e:
        await db.rollback()
        raise DatabaseError("Failed to delete resume") from e
