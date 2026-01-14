from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    allowed_origins: list[str]

    # Hashing tools
    algorithm: str = "HS256"
    secret_key: str

    # Postgresql credentials
    POSTGRES_HOST: str
    POSTGRES_USER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str
    POSTGRES_PWD: str = ""

    # Azure Blob Storage
    AZURE_STORAGE_CONNECTION_STRING: str

    # Superuser Credentials
    superuser_email: str
    superuser_password: str

    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str


settings = Settings()  # type: ignore
