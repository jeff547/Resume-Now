from sqlmodel import SQLModel

class Token(SQLModel):
    access_token: str
    token_type: str
    
class Token_data(SQLModel):
    email: str | None = None