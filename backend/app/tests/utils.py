import random
import string
from datetime import datetime, timezone

from pydantic import EmailStr
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.models.resume import Resume, ResumeCreate, ResumeStatus
from app.models.user import User, UserCreate

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

"""
Generate random objects for testing purposes
"""


def random_string(length: int = 16) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))


def random_email() -> EmailStr:
    name: str = random_string(16)
    domain: str = random.choice(["example.com", "gmail.com", "hotmail.com"])
    return f"{name}{random.randint(10, 9999)}@{domain}"


async def random_user(async_db: AsyncSession) -> tuple[User, str]:
    email = random_email()
    password = random_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_new_user(db=async_db, user_in=user_in)
    return user, password


async def random_resume(async_db: AsyncSession, db_user: User) -> Resume:
    resume_in = ResumeCreate(
        title=random_string(5),
        input_data=dummy_payload,
    )

    resume = await crud.create_new_resume(async_db, db_user, resume_in)

    resume.latex_source = r"\documentclass{article}..."

    resume.pdf_filename = "mock_resume.pdf"

    resume.thumbnail_url = "https://mock.azure.com/public-thumb.png"

    resume.error_message = None
    resume.status = ResumeStatus.ready

    async_db.add(resume)
    await async_db.commit()
    await async_db.refresh(resume)

    if isinstance(resume.status, str):
        resume.status = ResumeStatus(resume.status)

    return resume
