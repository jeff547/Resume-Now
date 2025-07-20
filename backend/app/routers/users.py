from typing import Sequence
from uuid import UUID
from fastapi import APIRouter, HTTPException


from app.core.database import SessionDep
from app.models.user import User, UserCreate
from app import crud 

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=User)
async def create_user(user_in: UserCreate, db: SessionDep):
    user_exists = await crud.get_user_by_email(db, user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=409, 
            detail="A user with this email already exists.",
        )
    user = await crud.create_new_user(db,user_in) 
    if not user:
        raise HTTPException(
            status_code=500,
            detail="Failed to create user due to a database error."
        )
    return user

@router.get("/", response_model=User)
async def search_user_by_email(email: str, db: SessionDep):
    user = await crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    return user

@router.get("/", response_model=Sequence[User])
async def read_users(db: SessionDep, skip: int = 0, limit: int = 100):
    users = await crud.get_users(db, skip, limit)
    if not users:
        raise HTTPException(
            status_code=404,
            detail="No users found."
        )
    return users

@router.delete("/", response_model=User)
async def delete_user(db: SessionDep, user_id: UUID):
    try:
        await crud.delete_user(db, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

