import os
from typing import Annotated, AsyncGenerator

from azure.identity import DefaultAzureCredential
from fastapi import Depends
from sqlalchemy import event
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings

async def create_postgres_engine() -> AsyncEngine:
    """
    Creates PostgresSQL databse
    for both Azure deployment
    and local development
    """
    # Gets Azure credentials, access token, and sets ssl if building on azure
    if settings.POSTGRES_HOST.endswith(".database.azure.com"):
        azure_creds = DefaultAzureCredential()
        password = azure_creds.get_token("https://ossrdbms-aad.database.windows.net/.default").token
        ssl_mode = "require"
    else:
        azure_creds = None
        password = settings.POSTGRES_PWD
        ssl_mode = "disable"
        
    # Build postgres connection string
    PG_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{password}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}?ssl={ssl_mode}"
    os.environ["POSTGRES_URL"] = PG_URL
    print("url", os.getenv("POSTGRES_URL"))
        
    # Create engine
    engine = create_async_engine(PG_URL, echo=True)

    # Automatically refresh token for Azure
    if azure_creds and settings.POSTGRES_HOST.endswith(".database.azure.com"):
        @event.listens_for(engine.sync_engine, "do_connect")
        def update_access_token(dialect, conn_rec, cargs, cparams):
            print("♻️ Refreshing Azure AD token for PostgreSQL connection...")
            cparams["password"] = azure_creds.get_token("https://ossrdbms-aad.database.windows.net/.default").token

    return engine

# --- SESSION DEPENDENCY --- #
async def get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    """Return a sessionmaker bound to the correct async engine."""
    engine = await create_postgres_engine()
    return async_sessionmaker(
        bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session_factory = await get_sessionmaker()
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

# async def get_db() -> AsyncGenerator[AsyncSession, None]:
#     async with async_session() as session:
#         yield session

SessionDep = Annotated[AsyncSession, Depends(get_db)]

    