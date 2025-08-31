from uuid import UUID
from fastapi import APIRouter, HTTPException, status

from app import crud
from app.core.database import SessionDep
from app.core.exceptions import AuthorizationError, DatabaseError, NotFoundError
from app.deps import CurrentUser
from app.models.project import  ProjectCreate, ProjectPublic, ProjectUpdate, ProjectsPublic
from app.crud import create_new_project
from app.models.token import Message

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectPublic)
async def create_project(
    db: SessionDep, current_user: CurrentUser, project_in: ProjectCreate):
    """
    Create a new project
    """
    try:
        project = await create_new_project(db, current_user, project_in)
        return project
    except RuntimeError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/", response_model=ProjectsPublic)
async def read_projects(
    db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100):
    """
    Retrieve current users items.
    """
    projects, count = await crud.get_projects(db, current_user, skip, limit)
    project_public_list = [ProjectPublic.model_validate(project) for project in projects]
    return ProjectsPublic(data=project_public_list, count=count)

@router.get("/{project_id}", response_model=ProjectPublic)
async def read_project(db: SessionDep, current_user: CurrentUser, project_id: UUID):
    """
    Retrieves a project by ID
    """
    try:
        return await crud.get_project(db, current_user, project_id)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except AuthorizationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.patch("/{project_id}", response_model=ProjectPublic)
async def update_project(
    db: SessionDep, current_user: CurrentUser, project_id: UUID, project_in: ProjectUpdate):
    """
    Updates a project and returns it
    """
    try:
        db_project = await crud.get_project(db, current_user, project_id)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except AuthorizationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        ) 
        
    try:
        updated_project = await crud.update_project(db, db_project, project_in)
        return updated_project
    except DatabaseError as e:
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=str(e)
    )
        
@router.delete("/{project_id}", response_model=Message)
async def delete_project(db:SessionDep, current_user: CurrentUser, project_id: UUID):
    """
    Deletes project from database
    """
    try:
        project = await crud.get_project(db, current_user, project_id)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except AuthorizationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        ) 
    
    try:
        res = await crud.delete_project(db, project)
        return res
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
    