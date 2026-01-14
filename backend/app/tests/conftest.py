from typing import AsyncGenerator, Generator
from unittest.mock import MagicMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_db
from app.core.storage import get_storage
from app.main import app
from app.models.user import User
from app.tests.utils import random_user

# Local sqlite database for fast testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,  # Prints output to stdout
    poolclass=StaticPool,
    connect_args={"check_same_thread": False},
)


@pytest_asyncio.fixture(scope="function")
async def async_engine() -> AsyncGenerator[AsyncEngine, None]:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def async_db(async_engine) -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
    )

    async with async_session() as session:
        await session.begin()

        yield session

        await session.rollback()


@pytest_asyncio.fixture(scope="function", autouse=True)
async def async_client(async_db) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield async_db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(
        transport=ASGITransport(app),
        base_url="http://localhost:8000/api/",
    ) as client:
        yield client

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_user(async_db: AsyncSession) -> tuple[User, str]:
    return await random_user(async_db)


@pytest_asyncio.fixture
async def token_header(
    async_client: AsyncClient, test_user: tuple[User, str]
) -> dict[str, str]:
    """
    Generates authorization headers for test_user
    """
    user, password = test_user
    data = {"username": user.email, "password": password}
    r = await async_client.post("/login/token", data=data)
    access_token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    return headers


@pytest.fixture(scope="function")
def mock_worker() -> Generator:
    """
    Mock background task worker library
    """
    with patch("app.routers.resumes.generate_resume_for_id") as mock_task:
        yield mock_task


@pytest.fixture(scope="function")
def mock_storage(async_client):
    """
    Overrides the dependency globally for all API tests.
    """

    with patch("app.core.storage.ResumeStorage") as MockClass:
        mock_instance = MockClass.return_value

        mock_instance.resume_container = "resumes"
        mock_instance.thumbnail_container = "thumbnails"
        mock_instance.get_sas_url.return_value = "https://mock.azure.com/sas-token"
        mock_instance.get_public_url.return_value = (
            "https://mock.azure.com/public-thumb"
        )
        mock_instance.delete_file.return_value = None
        mock_instance.upload_bytes.return_value = None

        mock_blob = MagicMock()
        mock_instance.get_blob_client.return_value = mock_blob

        yield mock_instance
