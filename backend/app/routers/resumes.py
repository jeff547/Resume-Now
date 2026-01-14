import asyncio
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import RedirectResponse

from app import crud
from app.core.database import SessionDep
from app.core.exceptions import AuthorizationError, DatabaseError, NotFoundError
from app.core.storage import ResumeStorage, get_storage
from app.crud import create_new_resume
from app.deps import CurrentUser
from app.models.resume import (
    ResumeCreate,
    ResumePublic,
    ResumesPublic,
    ResumeStatus,
    ResumeUpdate,
)
from app.models.token import Message
from app.services.resume_generation import generate_resume_for_id, inject_download_url

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/", response_model=ResumePublic)
async def create_resume(
    db: SessionDep,
    current_user: CurrentUser,
    resume_in: ResumeCreate,
    background_tasks: BackgroundTasks,
):
    """
    Create a new resume
    """
    try:
        resume = await create_new_resume(db, current_user, resume_in)
        background_tasks.add_task(
            generate_resume_for_id,
            db=db,
            resume_id=resume.id,
        )
        return inject_download_url(resume)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=ResumesPublic)
async def read_resumes(
    db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
):
    """
    Retrieve current users items.
    """
    resumes, count = await crud.get_resumes(db, current_user, skip, limit)

    resume_public_list = [inject_download_url(resume) for resume in resumes]

    return ResumesPublic(data=resume_public_list, count=count)


@router.get("/{resume_id}", response_model=ResumePublic)
async def read_resume(db: SessionDep, current_user: CurrentUser, resume_id: UUID):
    """
    Retrieves a resume by ID
    """
    try:
        resume = await crud.get_resume(db, current_user, resume_id)
        return inject_download_url(resume)

    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except AuthorizationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/{resume_id}/download")
async def download_resume(db: SessionDep, current_user: CurrentUser, resume_id: UUID):
    """
    Generates a secure, temporary SAS link and redirects the user to it.
    """
    resume = await crud.get_resume(db, current_user, resume_id)

    if not resume or not resume.pdf_filename:
        raise HTTPException(status_code=404, detail="Resume PDF not found")

    storage = ResumeStorage()

    sas_url = storage.get_sas_url(file_name=resume.pdf_filename)

    if not sas_url:
        raise HTTPException(status_code=500, detail="Could not generate download link")

    return RedirectResponse(url=sas_url)


@router.patch("/{resume_id}", response_model=ResumePublic)
async def update_resume(
    db: SessionDep,
    current_user: CurrentUser,
    resume_id: UUID,
    resume_in: ResumeUpdate,
):
    """
    Updates a resume and returns it
    """
    try:
        db_resume = await crud.get_resume(db, current_user, resume_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except AuthorizationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    try:
        updated_resume = await crud.update_resume(db, db_resume, resume_in)
        return inject_download_url(updated_resume)
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.patch("/{resume_id}/regenerate", response_model=ResumePublic)
async def regenerate_resume(
    db: SessionDep,
    current_user: CurrentUser,
    resume_id: UUID,
    background_tasks: BackgroundTasks,
):
    """
    Regenerates the resume from scratch
    """
    resume = await crud.get_resume(db, current_user, resume_id)
    # Clear old data
    resume.status = ResumeStatus.generating
    resume.error_message = None
    resume.latex_source = None
    resume.pdf_filename = None
    resume.thumbnail_url = None

    await db.commit()
    await db.refresh(resume)

    background_tasks.add_task(
        generate_resume_for_id,
        db=db,
        resume_id=resume.id,
    )

    return inject_download_url(resume)


@router.delete("/{resume_id}", response_model=Message)
async def delete_resume(
    db: SessionDep,
    current_user: CurrentUser,
    resume_id: UUID,
    storage: ResumeStorage = Depends(get_storage),
):
    """
    Deletes resume from database
    """
    try:
        resume = await crud.get_resume(db, current_user, resume_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except AuthorizationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    try:
        if not storage:
            storage = get_storage()

        if resume.pdf_filename:
            await asyncio.to_thread(
                storage.delete_file, resume.pdf_filename, storage.resume_container
            )

            thumbnail_filename = f"thumbnail_{resume.id}.png"

            await asyncio.to_thread(
                storage.delete_file,
                thumbnail_filename,
                storage.thumbnail_container,
            )

        res = await crud.delete_resume(db, resume)
        return res
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
