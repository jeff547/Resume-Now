"""added thumbnail column

Revision ID: 32c0b2f5b152
Revises: 539690acbfc9
Create Date: 2026-01-08 05:47:38.566658

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "32c0b2f5b152"
down_revision: Union[str, Sequence[str], None] = "539690acbfc9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ✅ CORRECTED: Just add the column. Do not recreate the table.
    # We use 'create_type=False' in case specific column types already exist,
    # but for a generic add_column it is usually fine.
    op.add_column("resume", sa.Column("thumbnail", sa.LargeBinary(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # ✅ CORRECTED: Just remove the column.
    op.drop_column("resume", "thumbnail")
