from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.core.database import SessionDep
from app.core.exceptions import DatabaseError
from app.core.security import hash_password, verify_password
from app.deps import CurrentUser
from app.models.token import Message
from app.models.user import UpdatePassword, User, UserCreate, UserPublic, UserSelfUpdate, UsersPublic
from app import crud 

router = APIRouter(prefix="/users", tags=["Users"])


"""
Currrent User permission level
"""

@router.post("/signup", response_model=UserPublic)
async def register_user(db: SessionDep, user_in: UserCreate):
    """
    Creates a new user without authorization
    """
    user_exists = await crud.get_user_by_email(db, user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="A user with this email already exists.",
        )
    try:
        user = await crud.create_new_user(db, user_in) 
        return user
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user due to a database error."
        )

@router.get("/self", response_model=UserPublic)
async def read_self_user(current_user: CurrentUser):
    """
    Returns current user data
    """
    return current_user

@router.patch("/self", response_model=UserPublic)
async def update_self_user(
    db: SessionDep, user_in: UserSelfUpdate, current_user: CurrentUser):
    """
    Updates current user's email and/or username
    """
    new_email = user_in.email
    if new_email:
        new_email_exists = await crud.get_user_by_email(db, new_email)
        if new_email_exists and new_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail= "User with this email already exists"
            )
    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.patch("/self/password", response_model=UserPublic)
async def update_self_password(
    db: SessionDep, body: UpdatePassword, current_user: CurrentUser):
    """
    Updates own password
    """
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Password"
        )
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="New password cannot be identical to old password"
        )
    hashed_password = hash_password(body.new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
    
@router.delete("/self", response_model=Message)
async def delete_self_user(db: SessionDep, current_user: CurrentUser):
    """
    Deletes the current user from database
    """
    try:
        return await crud.delete_user(db, current_user)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
"""
Superuser permission level
"""
@router.post("/", response_model=UserPublic)
async def create_user(db: SessionDep, user_in: UserCreate):
    """
    Create new user.
    """
    user_exists = await crud.get_user_by_email(db, user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="A user with this email already exists.",
        )
    try:
        user = await crud.create_new_user(db, user_in) 
        return user
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user due to a database error."
        )

@router.get("/", response_model=UserPublic)
async def search_user_by_email(db: SessionDep, email: str):
    user = await crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    return user

@router.get("/", response_model=UsersPublic)
async def read_users(db: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """
    users, count = await crud.get_users(db, skip, limit)
    if count == 0 or users is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Users Found"
        )
    user_public_list = [UserPublic.model_validate(user) for user in users]
    return (user_public_list, count)

@router.delete("/{user_id}", response_model=Message)
async def delete_user(db: SessionDep, user_id: UUID):
    """
    Delete user from database
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    try:
        return await crud.delete_user(db, user)
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    

