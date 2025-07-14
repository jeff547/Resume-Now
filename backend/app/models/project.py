from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import datetime
import uuid

from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user import User
    
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
    