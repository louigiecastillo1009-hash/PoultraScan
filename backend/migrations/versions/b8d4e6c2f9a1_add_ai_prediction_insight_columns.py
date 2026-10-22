"""add breed, recommendation, prevention_tips, severity to ai_predictions

Revision ID: b8d4e6c2f9a1
Revises: 91231e382eb7
Create Date: 2026-10-22 15:30:00.000000

The AI prediction service writes breed/recommendation/prevention_tips/
severity to the database after Groq generates them, but no migration ever
created those columns — every POST /api/ai/predict failed with
"Unknown column 'breed' in 'field list'". This migration adds them
(idempotent, safe to re-run).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = 'b8d4e6c2f9a1'
down_revision: Union[str, Sequence[str], None] = '91231e382eb7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


ADDED_COLUMNS = [
    ('breed', sa.Column('breed', sa.String(length=100), nullable=True)),
    ('recommendation', sa.Column('recommendation', sa.Text(), nullable=True)),
    ('prevention_tips', sa.Column('prevention_tips', sa.Text(), nullable=True)),
    ('severity', sa.Column('severity', sa.String(length=20), nullable=True)),
]


def upgrade() -> None:
    """Add the missing ai_predictions columns if they don't already exist."""
    inspector = inspect(op.get_bind())
    existing = {c['name'] for c in inspector.get_columns('ai_predictions')}

    for name, column in ADDED_COLUMNS:
        if name not in existing:
            op.add_column('ai_predictions', column)


def downgrade() -> None:
    """Remove the columns again."""
    for name, _ in reversed(ADDED_COLUMNS):
        op.drop_column('ai_predictions', name)
