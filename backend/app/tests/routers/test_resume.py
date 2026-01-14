import uuid
from unittest.mock import patch

import pytest
from httpx import AsyncClient
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.resume import Resume, ResumeStatus
from app.models.user import User
from app.tests.utils import random_resume, random_string, random_user


@pytest.mark.asyncio
async def test_create_resume(
    async_client: AsyncClient,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_worker,
) -> None:
    """
    Creates a new resume
    """
    user = test_user[0]
    data = {"title": random_string(5), "input_data": {"content": random_string(16)}}

    r = await async_client.post("/resumes/", json=data, headers=token_header)
    print(r.json())  # debug
    assert r.status_code == 200  # Successful http request
    resume = r.json()

    # Checks
    assert resume["title"] == data["title"]  # Title is same as input
    assert resume["input_data"] == data["input_data"]  # Content is same as input
    assert "id" in resume  # ID is generated
    assert resume["owner_id"] == str(user.id)  # Owner ID matches

    mock_worker.assert_called_once()


@pytest.mark.asyncio
async def test_read_resume(
    async_client: AsyncClient,
    async_db: AsyncSession,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_storage,
) -> None:
    # Set up
    user = test_user[0]
    resume = await random_resume(async_db=async_db, db_user=user)

    resume.pdf_filename = "test.pdf"
    await async_db.commit()

    r = await async_client.get(f"/resumes/{resume.id}", headers=token_header)
    json = r.json()

    # Checks
    assert r.status_code == 200  # Successful http request
    assert json["id"] == str(resume.id)  # ID is same as db
    # Same params as input
    assert json["title"] == resume.title
    assert json["owner_id"] == str(user.id)

    # Verify the SAS URL was injected by the mock
    assert json["download_url"] == "https://mock.azure.com/sas-token"


@pytest.mark.asyncio
async def test_read_resume_not_found(
    async_client: AsyncClient, token_header: dict[str, str]
) -> None:
    """
    Read resume that doesn't exist
    """
    r = await async_client.get(f"/resumes/{uuid.uuid4()}", headers=token_header)
    json = r.json()

    # Checks
    assert r.status_code == 404  # HTTP 404 NOT FOUND
    assert json["detail"] == "Resume not found"


@pytest.mark.asyncio
async def test_read_resume_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Read other users resume without permission
    """
    other_user = (await random_user(async_db))[0]
    resume = await random_resume(async_db, other_user)

    r = await async_client.get(f"/resumes/{resume.id}", headers=token_header)
    json = r.json()

    # Checks
    assert r.status_code == 401  # HTTP 401 UNAUTHORIZED
    assert json["detail"] == "You do not have permission to access this resume"


@pytest.mark.asyncio
async def test_read_multiple_resumes(
    async_client: AsyncClient,
    async_db: AsyncSession,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_storage,
) -> None:
    """
    Creates and retrieves multiple resumes
    """
    user = test_user[0]
    await random_resume(async_db, user)
    await random_resume(async_db, user)

    r = await async_client.get("/resumes/", headers=token_header)
    json = r.json()

    resume_1 = json["data"][0]
    resume_2 = json["data"][1]

    # Checks
    assert r.status_code == 200  # Successful http request
    assert json["count"] == 2  # Two count resumes
    assert resume_1["id"] != resume_2["id"]  # Different IDs
    assert resume_1["owner_id"] == resume_2["owner_id"]  # Same Owner
    assert resume_1["title"] != resume_2["title"]  # Different Titles


@pytest.mark.asyncio
async def test_update_resume(
    async_client: AsyncClient,
    async_db: AsyncSession,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_storage,
) -> None:
    """
    Update an resume
    """
    # Setup
    user = test_user[0]
    resume = await random_resume(async_db, user)
    orig_resume = resume.model_dump()
    update = {"title": random_string(5), "input_data": {"content": random_string(16)}}

    # HTTP REQUEST
    r = await async_client.patch(
        url=f"/resumes/{resume.id}", json=update, headers=token_header
    )
    assert r.status_code == 200
    json = r.json()

    # Checks
    assert json["title"] != orig_resume["title"]  # Changed title
    assert json["input_data"] != orig_resume["input_data"]  # Changed Content
    assert json["id"] == str(resume.id)  # ID is kept
    assert json["owner_id"] == str(resume.owner_id)  # Owner isn't changed


@pytest.mark.asyncio
async def test_update_resume_not_found(
    async_client: AsyncClient, token_header: dict[str, str]
) -> None:
    """
    Update resume that doesn't exist
    """
    update = {"title": random_string(5), "input_data": {"content": random_string(16)}}
    r = await async_client.patch(
        url=f"/resumes/{uuid.uuid4()}", json=update, headers=token_header
    )
    json = r.json()

    # Checks
    assert r.status_code == 404  # HTTP 404 NOT FOUND
    assert json["detail"] == "Resume not found"


@pytest.mark.asyncio
async def test_update_resume_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Update other users resume without permission
    """
    user = (await random_user(async_db))[0]
    resume = await random_resume(async_db, user)
    update = {"title": random_string(5), "input_data": {"content": random_string(16)}}

    # HTTP REQUEST
    r = await async_client.patch(
        url=f"/resumes/{resume.id}", json=update, headers=token_header
    )
    json = r.json()

    # Checks
    assert r.status_code == 401  # HTTP 401 UNAUTHORIZED
    assert json["detail"] == "You do not have permission to access this resume"


@pytest.mark.asyncio
async def test_delete_resume(
    async_client: AsyncClient,
    async_db: AsyncSession,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_storage,
) -> None:
    """
    Deletes resume
    """
    # Setup
    user = test_user[0]
    resume = await random_resume(async_db, user)

    resume.pdf_filename = "test.pdf"
    await async_db.commit()

    # HTTP Request
    r = await async_client.delete(f"/resumes/{resume.id}", headers=token_header)
    assert r.status_code == 200  # Success
    assert r.json()["message"] == "Resume deleted successfully"

    # Verify Azure deletion was attempted
    assert mock_storage.delete_file.call_count >= 1

    assert not await async_db.get(Resume, resume.id)  # Check no longer in database


@pytest.mark.asyncio
async def test_delete_resume_not_found(
    async_client: AsyncClient, token_header: dict[str, str]
) -> None:
    """
    Update resume that doesn't exist
    """
    r = await async_client.delete(url=f"/resumes/{uuid.uuid4()}", headers=token_header)

    # Checks
    assert r.status_code == 404  # HTTP 404 NOT FOUND
    assert r.json()["detail"] == "Resume not found"


@pytest.mark.asyncio
async def test_delete_resume_no_permission(
    async_client: AsyncClient, async_db: AsyncSession, token_header: dict[str, str]
) -> None:
    """
    Update other users resume without permission
    """
    user = (await random_user(async_db))[0]
    resume = await random_resume(async_db, user)

    # HTTP REQUEST
    r = await async_client.delete(url=f"/resumes/{resume.id}", headers=token_header)
    json = r.json()

    # Checks
    assert r.status_code == 401  # HTTP 401 UNAUTHORIZED
    assert json["detail"] == "You do not have permission to access this resume"


@pytest.mark.asyncio
async def test_regenerate_resume_resets_fields(
    async_client: AsyncClient,
    async_db: AsyncSession,
    test_user: tuple[User, str],
    token_header: dict[str, str],
    mock_worker,
    mock_storage,
) -> None:
    """
    Regenerate resume resets generated fields and sets status to generating.
    """
    user = test_user[0]
    resume = await random_resume(async_db, user)

    resume.status = ResumeStatus.ready
    resume.pdf_filename = "old_resume.pdf"
    resume.thumbnail_url = "http://old-thumb.png"
    resume.latex_source = r"\old_latex"
    resume.error_message = "Old Error"
    await async_db.commit()

    r = await async_client.patch(
        f"/resumes/{resume.id}/regenerate", headers=token_header
    )
    assert r.status_code == 200
    json = r.json()

    assert json["id"] == str(resume.id)
    assert json["status"] == ResumeStatus.generating

    updated = await async_db.get(Resume, resume.id)
    assert updated is not None
    assert updated.latex_source is None
    assert updated.pdf_filename is None
    assert updated.thumbnail_url is None
    assert updated.error_message is None

    mock_worker.assert_called_once()

    call_kwargs = mock_worker.call_args.kwargs
    assert call_kwargs["resume_id"] == resume.id
