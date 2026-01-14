import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import (
    JSON,
    TIMESTAMP,
    Column,
    Field,
    LargeBinary,
    Relationship,
    SQLModel,
    String,
)

if TYPE_CHECKING:
    from .user import User

# ============================
# Resume Model
# ============================


class ResumeStatus(str, Enum):
    generating = "generating"
    ready = "ready"
    error = "error"


# Base properties
class ResumeBase(SQLModel):
    title: str = Field(index=True, max_length=255)
    input_data: dict = Field(sa_column=Column(JSON))


# Properties to receive via API on creation
class ResumeCreate(ResumeBase):
    pass


# Properties to receive via API on update
class ResumeUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    input_data: dict | None = Field(
        default=None,
        sa_column=Column(JSON),
    )


# Database Model
class Resume(ResumeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )
    last_opened: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False),
    )

    status: ResumeStatus = Field(
        default=ResumeStatus.generating,
        sa_column=Column("status", String(32), nullable=False),
    )

    latex_source: str | None = None  # AI-generated LaTeX
    pdf_filename: str | None = Field(default=None)  # Resume - pdf filename for lookup
    thumbnail_url: str | None = Field(default=None)  # Resume - low res image

    error_message: str | None = None  # Generation Errors

    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: "User" = Relationship(back_populates="resumes")


# Properties to return via API
class ResumePublic(ResumeBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    status: ResumeStatus

    pdf_filename: str | None = None
    thumbnail_url: str | None = None
    download_url: str | None = None
    error_message: str | None = None

    created_at: datetime
    last_opened: datetime


class ResumesPublic(SQLModel):
    data: list[ResumePublic]
    count: int


from .user import User
