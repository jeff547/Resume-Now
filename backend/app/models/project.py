from typing import TYPE_CHECKING
from datetime import datetime, timezone
import uuid

from sqlmodel import TIMESTAMP, Column, Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user import User
    
# ============================
# Project Model
# ============================

# Base properties
class ProjectBase(SQLModel):
    title: str = Field(index=True, max_length=255)
    content: str
    last_opened: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
        )
 
# Properties to receive via API on creation    
class ProjectCreate(ProjectBase):
    pass

# Properties to receive via API on update 
class ProjectUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    content: str | None = None

# Database model, database table inferred from class name
class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False)
        )
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: 'User' = Relationship(back_populates='projects')

# Properties to return via API, id is always required
class ProjectPublic(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID

class ProjectsPublic(SQLModel):
    data: list[ProjectPublic]
    count: int
    

from .user import User