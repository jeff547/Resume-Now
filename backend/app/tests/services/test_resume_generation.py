from unittest.mock import AsyncMock, patch

import pytest

from app.models.resume import Resume, ResumeStatus
from app.services import resume_generation
from app.tests.utils import random_resume

TEMPLATE_NAME = "jakes_template.tex"
dummy_payload = {
    "fullName": "Jeff Lu",
    "email": "jeff@example.com",
    "phone": "201-555-0199",
    "linkedIn": "https://www.linkedin.com/in/jefflu",
    "github": "https://github.com/jefflu",
    "website": "https://jefflu.dev",
    "location": "Wayne, NJ",
    "jobObjective": "Software engineering intern role focused on backend + AI products.",
    "degree": "B.S. Computer Science",
    "school": "Rutgers University",
    "graduationYear": "2027",
    "skills": ["Python", "FastAPI", "React", "PostgreSQL"],
    "softSkills": "Communication, ownership, and fast iteration.",
    "workExperiences": [
        {
            "jobTitle": "Web Assistant",
            "company": "Rutgers SAS IT",
            "dates": "Sep 2025 - Present",
            "responsibilities": "Built internal tools, improved deployment workflows, and supported stakeholders.",
        }
    ],
    "projects": [
        {
            "name": "Resume-Now",
            "technologies": "FastAPI, React, Postgres, Azure",
            "description": "AI-assisted resume generator producing LaTeX/PDF outputs.",
            "role": "Full-stack developer",
        }
    ],
    "extras": "Member of Mu Theta Alpha; fitness + hiking.",
}


def test_get_template_path_success():
    path = resume_generation.get_template_path(TEMPLATE_NAME)
    assert path.exists()
    assert path.name == TEMPLATE_NAME


def test_get_template_path_missing():
    with pytest.raises(FileNotFoundError):
        resume_generation.get_template_path("missing_template.tex")


@pytest.mark.asyncio
async def test_build_instructions_includes_template_and_json() -> None:
    template_path = resume_generation.get_template_path(TEMPLATE_NAME)
    instructions, user_input = resume_generation.build_instructions(
        template_path=template_path,
        user_data=dummy_payload,
    )

    assert instructions == resume_generation.INSTRUCTIONS
    assert "Template source (do not edit commands):" in user_input
    assert "User-provided resume data (JSON):" in user_input
    assert dummy_payload["fullName"] in user_input


@pytest.mark.asyncio
async def test_generate_resume_flow_success(async_db, test_user, mock_storage) -> None:

    user = test_user[0]
    resume = await random_resume(async_db, user)

    # Patch Internal Helpers (AI & LaTeX)
    with patch(
        "app.services.resume_generation.generate_tex_resume", new_callable=AsyncMock
    ) as mock_ai, patch(
        "app.services.resume_generation.compile_latex_to_bytes", new_callable=AsyncMock
    ) as mock_pdf, patch(
        "app.services.resume_generation.convert_pdf_to_png"
    ) as mock_img:

        # Configure local mocks
        mock_ai.return_value = r"\documentclass{resume}..."
        mock_pdf.return_value = b"%PDF-MOCKED-BYTES"
        mock_img.return_value = b"\x89PNG-MOCKED-BYTES"

        await resume_generation.generate_resume_for_id(async_db, resume.id)

    await async_db.refresh(resume)

    assert resume.status == ResumeStatus.ready
    assert resume.latex_source == r"\documentclass{resume}..."
    assert resume.pdf_filename == f"resume_{resume.id}.pdf"

    assert mock_storage.upload_bytes.call_count == 2

    mock_storage.upload_bytes.assert_any_call(
        b"%PDF-MOCKED-BYTES", f"resume_{resume.id}.pdf", mock_storage.resume_container
    )


@pytest.mark.asyncio
async def test_generate_resume_handles_ai_error(
    async_db, test_user, monkeypatch
) -> None:
    user = test_user[0]
    resume = await random_resume(async_db, user)

    with patch(
        "app.services.resume_generation.generate_tex_resume", new_callable=AsyncMock
    ) as mock_ai:

        mock_ai.side_effect = ValueError("bad input")

        await resume_generation.generate_resume_for_id(async_db, resume.id)

    updated = await async_db.get(Resume, resume.id)

    assert updated.status == ResumeStatus.error
    assert updated.error_message is not None
    assert "ValueError: bad input" in updated.error_message
