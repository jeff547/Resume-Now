from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from config import settings

engine = create_engine(settings.sqlalchemy_database_url)

# creates all database tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# grabs database session
def get_session():
    with Session(engine) as session:
        yield session
        
SessionDep = Annotated[Session, Depends(get_session)]