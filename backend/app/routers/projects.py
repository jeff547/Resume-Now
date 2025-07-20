from fastapi import APIRouter, HTTPException

from app.core.database import SessionDep
from app.models.project import Project, ProjectCreate
from app.models.user import User
from app.crud import create_new_project

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=Project)
async def create_project(current_user: User, project_in: ProjectCreate, db: SessionDep
    ):
    project = await create_new_project(current_user, project_in, db)
    if not project:
        raise HTTPException(
            status_code=500,
            detail="Failed to create project due to a database error."
        )