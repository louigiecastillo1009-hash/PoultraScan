"""add reset token fields to users

Revision ID: 94ca54eb822e
Revises: 2efc461ad267
Create Date: 2026-07-07 16:11:56.337120

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '94ca54eb822e'
down_revision: Union[str, Sequence[str], None] = '2efc461ad267'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy import inspect

    inspector = inspect(op.get_bind())
    if not inspector.has_column('users', 'reset_token'):
        op.add_column('users', sa.Column('reset_token', sa.String(length=255), nullable=True))
    if not inspector.has_column('users', 'reset_token_expiry'):
        op.add_column('users', sa.Column('reset_token_expiry', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'reset_token_expiry')
    op.drop_column('users', 'reset_token')