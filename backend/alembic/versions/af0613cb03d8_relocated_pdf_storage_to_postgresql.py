"""relocated pdf storage to postgresql

Revision ID: af0613cb03d8
Revises: f757702d4fd3
Create Date: 2026-01-05 05:49:38.089483

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel



# revision identifiers, used by Alembic.
revision: str = 'af0613cb03d8'
down_revision: Union[str, Sequence[str], None] = 'f757702d4fd3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
