from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_postgres_engine
from app.routers import health, login, resumes, users
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession


# Intialize App
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("----- STARTUP: PRINTING REGISTERED ROUTES -----")
    for route in app.routes:
        print(f"Route: {route.path} methods={route.methods}")
    print("---------------------------------------------")

    engine = await create_postgres_engine()
    app.state.session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
    )

    # App Running
    try:
        yield
    finally:
        # Shutdown
        await engine.dispose()


app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # allows all origins from list above
    allow_credentials=True,
    allow_methods=["*"],  # allows all method
    allow_headers=["*"],  # allows all headers
)


# Add Users and Resumes Routers to App
app.include_router(users.router, prefix="/api")
app.include_router(resumes.router, prefix="/api")
app.include_router(login.router, prefix="/api")
app.include_router(health.router, prefix="/api")
