from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.core.database import SessionDep

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/live", summary="Liveness probe")
async def live() -> dict[str, str]:
    """Simple endpoint proving the API process is running."""
    return {"status": "ok"}


@router.get("/ready", summary="Readiness probe")
async def ready(db: SessionDep) -> dict[str, str]:
    """
    Confirms downstream dependencies (e.g. database) are reachable.
    """
    try:
        await db.exec(select(1))
    except Exception as exc:  # pragma: no cover - defensive guard
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connectivity check failed",
        ) from exc
    return {"status": "ok"}
