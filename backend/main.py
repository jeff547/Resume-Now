from fastapi import FastAPI
from database import create_db_and_tables
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables...")
    create_db_and_tables()
    print("Tables created.")
    yield
    print("Lifespan ending... (shutdown logic if needed)")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.allowed_origins, # allows all origins from list above
    allow_credentials=True,
    allow_methods=["*"], # allows all method
    allow_headers=["*"], # allows all headers
)