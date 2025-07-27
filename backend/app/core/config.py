from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    algorithm: str = "HS256"
    sqlalchemy_database_url: str
    secret_key: str
    allowed_origins: list[str]
    superuser_email: str
    superuser_password: str
    
settings = Settings() # type: ignore
    