import asyncio
import io
import json
import tempfile
import uuid
from pathlib import Path
from typing import Any, Dict

from openai import AsyncOpenAI
from pdf2image.pdf2image import convert_from_bytes

from app.core.config import settings
from app.core.database import SessionDep
from app.core.storage import ResumeStorage, get_storage
from app.models.resume import Resume, ResumePublic, ResumeStatus

if not settings.OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable required")

async_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

INSTRUCTIONS = (
    "You are an elite Resume Strategist and Technical Recruiter. Your goal is to REWRITE "
    "the user's raw data into a high-impact, ATS-optimized LaTeX resume using the provided template.\n\n"
    "### 1. OPTIMIZATION STRATEGY (CRITICAL)\n"
    "- **Aggressive Rewriting:** Do not just format the input. You must REWRITE every bullet point to be result-oriented.\n"
    "- **The XYZ Formula:** Every bullet must follow the structure: 'Accomplished [X] as measured by [Y], by doing [Z].'\n"
    "- **Quantify Everything:** Use numbers (%, $, scale, users) in every single bullet. If exact numbers are missing, estimate reasonable scale based on context.\n"
    "- **ATS Keywords:** Seamlessly integrate keywords from the Target Job Description into the experience bullets.\n"
    "- **Strong Verbs:** Start every bullet with a high-impact power verb (e.g., 'Engineered', 'Orchestrated', 'Slashed'). Never use 'Responsible for' or 'Assisted with'.\n\n"
    "### 2. TEMPLATE SYNTAX RULES\n"
    "You must use the following specific LaTeX commands from the provided template:\n"
    "- **Experience:** \\resumeSubheading{Title}{Dates}{Company}{Location}\n"
    "- **Projects:** \\resumeProjectHeading{\\textbf{Project Name} $|$ \\emph{Tech Stack}}{Dates}\n"
    "- **Bullet Points:** Wrap lists in \\resumeItemListStart ... \\resumeItemListEnd. Use \\resumeItem{Content...} for each line.\n"
    "- **Skills:** Use the exact \\begin{itemize} format shown in the template source.\n\n"
    "### 3. TECHNICAL CONSTRAINTS\n"
    "- **XeLaTeX Safe:** Do NOT use \\input{glyphtounicode} or \\pdfgentounicode. Use standard UTF-8 text.\n"
    "- **One Page Limit:** Prioritize the most recent and relevant experience to fit everything on a single page.\n"
    "- **Output:** Provide the full, compilable LaTeX code. Do not wrap it in markdown code blocks (```latex)."
)


def get_template_path(template_name: str) -> Path:
    """
    Builds template path from parameter and workspace paths
    """
    base = Path(__file__).resolve().parent.parent
    rel = Path(template_name)

    # Auto-add .tex if no extension is present
    if rel.suffix == "":
        rel = rel.with_suffix(".tex")

    template_path = base / "templates" / rel

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


async def generate_tex_resume(template_name: str, user_data: Dict[str, Any]) -> str:
    """
    Generate resume with the user's input data and template using openAI API
    """
    template_path = get_template_path(template_name)
    instructions, user_input = build_instructions(template_path, user_data)

    model = settings.OPENAI_MODEL

    resp = await async_client.responses.create(
        model=model,
        instructions=instructions,
        input=user_input,
    )

    return resp.output_text.strip()


async def compile_latex_to_bytes(tex_source: str) -> bytes:
    """
    Compiles LaTeX and returns the PDF binary data directly.
     Uses xelatex in a temp directory.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        # Creates and writes tex into a temporary file.
        tmpdir_path = Path(tmpdir)
        tex_file = tmpdir_path / "resume.tex"
        tex_file.write_text(data=tex_source, encoding="utf_8")

        cmd = ["xelatex", "-interaction=nonstopmode", tex_file.name]

        # Run twice for stable refs
        for _ in range(2):
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                cwd=str(tmpdir_path),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await proc.communicate()

        pdf_file = tmpdir_path / "resume.pdf"

        # Check for errors
        if not pdf_file.exists():
            raise RuntimeError(
                "LaTeX compilation failed with code "
                f"{proc.returncode}\n\n"
                f"STDOUT:\n{stdout.decode(errors='ignore')}\n\n"
                f"STDERR:\n{stderr.decode(errors='ignore')}"
            )

        # Compile pdf file return bytes
        return pdf_file.read_bytes()


def convert_pdf_to_png(pdf_bytes: bytes) -> bytes | None:
    """
    Converts the resume PDF to a PNG thumbnail.
    """
    try:
        image = convert_from_bytes(
            pdf_bytes, first_page=1, last_page=1, size=500, fmt="png"
        )
        if not image:
            return None

        # Save image to bytes
        img_bytes = io.BytesIO()
        image[0].save(
            img_bytes,
            format="PNG",
            optimize=True,
        )
        img_bytes.seek(0)
        return img_bytes.getvalue()
    except Exception as e:
        print(f"Thumbnail generation failed: {e}")
        return None


async def generate_resume_for_id(
    db: SessionDep, resume_id: uuid.UUID, storage: ResumeStorage | None = None
) -> None:
    """
    Generates the resume from user input
    """

    resume = await db.get(Resume, resume_id)
    if not resume:
        return

    if storage is None:
        storage = get_storage()

    try:
        resume.status = ResumeStatus.generating
        await db.commit()

        # --- Step 1: AI → LaTeX ---
        tex_source = await generate_tex_resume(
            template_name="jakes_template", user_data=resume.input_data
        )
        resume.latex_source = tex_source
        await db.commit()

        # --- Step 2: LaTeX → PDF bytes ---
        pdf_bytes = await compile_latex_to_bytes(tex_source=tex_source)

        # --- Step 3: PDF bytes → PNG bytes ---
        png_bytes = await asyncio.to_thread(convert_pdf_to_png, pdf_bytes)

        # --- Step 4: Upload to Azure Storage ---
        pdf_filename = f"resume_{resume.id}.pdf"
        thumbnail_filename = f"thumbnail_{resume.id}.png"

        await asyncio.to_thread(
            storage.upload_bytes,
            pdf_bytes,
            pdf_filename,
            storage.resume_container,
        )

        if png_bytes:
            await asyncio.to_thread(
                storage.upload_bytes,
                png_bytes,
                thumbnail_filename,
                storage.thumbnail_container,
            )

        # --- Step 5: Upload Resume in Database ---
        resume.pdf_filename = pdf_filename
        resume.thumbnail_url = storage.get_public_url(thumbnail_filename)
        resume.status = ResumeStatus.ready

        await db.commit()
    except Exception as e:
        resume.status = ResumeStatus.error
        resume.error_message = f"{type(e).__name__}: {e}"
        await db.commit()


def inject_download_url(
    resume: Resume, storage: ResumeStorage | None = None
) -> ResumePublic:
    """
    Converts DB model to API model and injects the dynamic SAS token
    """
    resume_public = ResumePublic.model_validate(resume)
    if storage is None:
        storage = get_storage()
    if resume.pdf_filename:
        resume_public.download_url = storage.get_sas_url(resume.pdf_filename)

    return resume_public
