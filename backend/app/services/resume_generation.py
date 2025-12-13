from dis import Instruction
import json
from pathlib import Path
from typing import Any, Dict

from openai import AsyncOpenAI
from app.core.config import settings

if not settings.OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable required")

async_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

INSTRUCTIONS = (
    "You are an expert resume writer, recruiter, and hiring manager. Your goal is to craft "
    "a high-quality, ATS-friendly LaTeX resume that aligns with the user's target role and industry, "
    "highlights measurable impact, and uses clear, concise, professional language.\n\n"
    "GENERAL RULES:\n"
    "- Prioritize clarity, concision, and impact.\n"
    "- Focus on measurable accomplishments instead of generic responsibilities.\n"
    "- Use strong action verbs (Led, Built, Improved, Implemented, Optimized, Designed, etc.).\n"
    "- Include numbers/metrics whenever possible (%, revenue, users, time saved, scale).\n"
    "- Never fabricate jobs, degrees, or skills not present in the user data.\n"
    "- When tailoring to a job description, mirror relevant keywords naturally and honestly.\n\n"
    "FORMAT + ATS GUIDELINES:\n"
    "- Produce a single-page, single-column LaTeX resume that uses only the template's macros.\n"
    "- Use standard headings (Work Experience, Education, Skills, Projects, Certifications, etc.).\n"
    "- Follow reverse-chronological order for experience and education.\n"
    "- Ensure contact info appears at the top in plain text.\n"
    "- Keep content ATS-safe: no tables, graphics, icons, or extra packages beyond the template.\n"
    "- Maintain consistent date formatting (Month YYYY – Month YYYY) and parallel grammar.\n\n"
    "CONTENT EXPECTATIONS:\n"
    "- Experience entries must include title, organization, location, dates, and 3–6 quantified bullets.\n"
    "- Bullets must highlight impact, metrics, scale, and tools/technologies when available.\n"
    "- Group skills logically (Languages, Frameworks, Tools, Cloud, Soft Skills, etc.) using only data supplied.\n"
    "- Incorporate relevant keywords from the user data or target role, but avoid keyword stuffing.\n"
    "- The final LaTeX must compile without modification."
)


def get_template_path(template_name: str) -> Path:
    """
    Builds template path from parameter and workspace paths
    """
    base = Path(__file__).resolve().parent.parent
    template_path = base / "templates" / template_name

    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")

    return template_path


def build_instructions(
    template_path: Path, user_data: Dict[str, Any]
) -> tuple[str, str]:
    """
    Creates the messages for openAI client prompt
    """

    template_text = template_path.read_text(encoding="utf-8")

    user_json = json.dumps(user_data, ensure_ascii=False, indent=2)

    user_input = (
        "Template source (do not edit commands):\n"
        f"""{template_text}\n\n"""
        "User-provided resume data (JSON):\n"
        f"""{user_json}\n\n"""
        "Write the finalized LaTeX resume that merges this data into the template while following all rules."
    )

    return (INSTRUCTIONS, user_input)


async def generate_resume(template_name: str, user_data: Dict[str, Any]) -> str:
    """
    Generate resume with the user's input data and template using openAI API
    """
    template_path = get_template_path(template_name)
    instructions, input = build_instructions(template_path, user_data)

    model = settings.OPENAI_MODEL

    response = await async_client.responses.create(
        model=model,
        instructions=instructions,
        input=input,
        max_output_tokens=1500,
    )

    # Debug
    print(response.output_text)

    return response.output_text.strip()


async def compile_latex_to_pdf(tex_file: str):
    """
    Compiles the tex from AI model into a human-readable pdf file
    """
