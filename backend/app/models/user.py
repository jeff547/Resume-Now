from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, SQLModel, Relationship
from pydantic import EmailStr

if TYPE_CHECKING:
    from .project import Project

# ============================
# User Model
# ============================

# Base properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    username: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=64)
    last_name: str | None = Field(default=None, max_length=64)
    is_superuser: bool = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    
# Properties to receive via API on update 
# ----------------------------------------

# Admin permissions
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(min_length=8, max_length=40)
# Account Owner permissions
class UserSelfUpdate(SQLModel):
    username: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=64)
    last_name: str | None = Field(default=None, max_length=64)
    
# Account Owner pasword change
class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    projects: list['Project'] = Relationship(back_populates='owner')

# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    
class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

from .project import Project