from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# Check if unhashed plain password input is equal to the hashed password in database 
def verify_password(unhashed: str, hashed: str) -> bool:
    return pwd_context.verify(unhashed, hashed)

# hashes plain password using hashing method from config.py
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
    