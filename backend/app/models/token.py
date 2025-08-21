from uuid import UUID
from pydantic import EmailStr
from sqlmodel import Field, SQLModel

# Generic message
class Message(SQLModel):
    message: str

# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

# User data inside JWT
class UserPayload(SQLModel):
    email: EmailStr
    user_uid: UUID
    
# Contents of JWT token
class TokenPayload(SQLModel):
    user: UserPayload | None # instantiated above
    exp: int # JWT expiration time
    jti: UUID 

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)