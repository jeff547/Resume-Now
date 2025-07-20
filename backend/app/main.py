from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import users, projects


from .tests.utils import *


# Intialize App
app = FastAPI()
print(random_email())
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