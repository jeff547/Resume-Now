from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import create_db_and_tables
from app.core.config import settings
from app.routers import users, projects

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables...")
    await create_db_and_tables()
    print("Tables created.")
    print(settings.sqlalchemy_database_url)
    yield
    print("Lifespan ending... (shutdown logic if needed)")

# Intialize App
app = FastAPI(lifespan=lifespan)
# Add Users and Projects Routers to App
app.include_router(users.router)
app.include_router(projects.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.allowed_origins, # allows all origins from list above
    allow_credentials=True,
    allow_methods=["*"], # allows all method
    allow_headers=["*"], # allows all headers
)