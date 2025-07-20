import random, string

from httpx import AsyncClient, Response
from pydantic import EmailStr

from app.models.user import User

def random_string(length: int = 16) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))

def random_email() -> EmailStr:
    name : str = random_string(16)
    domain : str = random.choice(["example.com", "gmail.com", "hotmail.com"])
    return f'{name}{random.randint(10, 9999)}@{domain}'

async def create_user(async_client: AsyncClient, email: str, password: str) -> Response:
    return await async_client.post("/users/", json={
        "email": email,
        "password": password
    })