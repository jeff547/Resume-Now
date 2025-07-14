from typing import Annotated, AsyncGenerator
from fastapi import Depends
from app.core.database import engine
from sqlmodel.ext.asyncio.session import AsyncSession

# Grabs database session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session

SessionDep = Annotated[AsyncSession, Depends(get_db)]
