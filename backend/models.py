from sqlmodel import Field, SQLModel, Relationship
from pydantic import EmailStr
from datetime import datetime
import uuid

# ============================
# User Model
# ============================

# Base properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    username: str | None = Field(default=None, max_length=255)

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    
# Properties to receive via API on update 
# ----------------------------------------
# Admin permissions
class UserUpdate(SQLModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    username: str | None = Field(default=None, max_length=255)
# Account Owner permissions
class UserSelfUpdate(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
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
    
# ============================
# Project Model
# ============================

# Base properties
class ProjectBase(SQLModel):
    title: str = Field(index=True, max_length=255)
    content: str
    last_opened: datetime
 
# Properties to receive via API on creation    
class ProjectCreate(ProjectBase):
    pass

# Properties to receive via API on update 
class ProjectUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    content: str | None 
    last_opened: datetime

# Database model, database table inferred from class name
class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime 
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: User = Relationship(back_populates='projects')
    
    
    