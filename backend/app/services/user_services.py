from typing import Sequence

from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from fastapi import HTTPException

from app.dependencies import SessionDep
from ..models.user import *
from app.core.security import hash_password

async def get_users(db: SessionDep) -> Sequence[User]:
    statement = select(User)
    result = await db.exec(statement)
    users = result.all()
    if not users:
        raise HTTPException(
            status_code=404,
            detail="No users found."
        )
    return users

async def get_user_by_email(email: str, db: SessionDep) -> User | None:
    statement = select(User).where(User.email == email)
    result = await db.exec(statement)
    user = result.first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    return user

async def create_user(user_in: UserCreate, db: SessionDep) -> User:
    user_exists = await get_user_by_email(user_in.email, db)
    if (user_exists):
        raise HTTPException(
            status_code=409, 
            detail="A user with this email already exists.",
        )
    
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
        raise HTTPException(
            status_code=500,
            detail="Failed to create user due to a database error."
        )