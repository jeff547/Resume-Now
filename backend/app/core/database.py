import time
from typing import Annotated, AsyncGenerator

from azure.identity import DefaultAzureCredential
from fastapi import Depends, Request
from sqlalchemy import event
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings

# Module-Level credential to avoid unnecessary recalls
azure_credential: DefaultAzureCredential | None = None
if settings.POSTGRES_HOST.endswith(".database.azure.com"):
    azure_credential = DefaultAzureCredential()

# Keep Azure access token cached to avoid unnecessary refreshes
token_cache = {"token": settings.POSTGRES_PWD, "expires": 0}


async def create_postgres_engine() -> AsyncEngine:
    """
    Creates PostgresSQL databse
    for both Azure deployment
    and local development
    """
    # Sets ssl_mode depending if local or cloud deployment
    ssl_mode = "require" if azure_credential is not None else "disable"

    # Build postgres connection string
    PG_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}?ssl={ssl_mode}"

    # Create engine
    if azure_credential is not None:  # Cloud Deployment: No Echo
        engine = create_async_engine(
            PG_URL,
            echo=False,
            pool_size=10,
            max_overflow=20,
            pool_recycle=1800,
            pool_pre_ping=True,
        )
    else:  # Local Development: Echo debug logs
        engine = create_async_engine(
            PG_URL,
            echo=True,
            pool_size=10,
            max_overflow=20,
            pool_recycle=1800,
            pool_pre_ping=True,
        )

    # Automatically refresh token for Azure
    @event.listens_for(engine.sync_engine, "do_connect")
    def update_access_token(dialect, conn_rec, cargs, cparams):
        if azure_credential is not None and token_cache["expires"] < time.time():
            print("♻️ Refreshing Azure AD token for PostgreSQL connection...")
            token_payload = azure_credential.get_token(
                "https://ossrdbms-aad.database.windows.net/.default"
            )
            token_cache["token"] = token_payload.token
            token_cache["expires"] = token_payload.expires_on - 60

        cparams["password"] = token_cache["token"]

    return engine


async def get_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    session_factory = request.app.state.session_factory
    async with session_factory() as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_db)]
