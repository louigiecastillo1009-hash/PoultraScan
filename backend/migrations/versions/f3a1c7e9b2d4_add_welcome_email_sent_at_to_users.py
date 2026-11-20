"""add welcome_email_sent_at to users

Revision ID: f3a1c7e9b2d4
Revises: a7b3c9d1e2f4
Create Date: 2026-11-20 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f3a1c7e9b2d4'
down_revision: Union[str, Sequence[str], None] = 'a7b3c9d1e2f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy import inspect

    columns = [c['name'] for c in inspect(op.get_bind()).get_columns('users')]
    if 'welcome_email_sent_at' not in columns:
        op.add_column('users', sa.Column('welcome_email_sent_at', sa.DateTime(timezone=True), nullable=True))
        # Accounts that existed before this feature have already logged in,
        # so mark them as welcomed; only brand-new users get the email.
        op.execute("UPDATE users SET welcome_email_sent_at = COALESCE(created_at, NOW())")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'welcome_email_sent_at')
