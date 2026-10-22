"""add journal_entries table

Revision ID: 212238a22199
Revises: 04091d468fca
Create Date: 2026-07-06 15:47:07.701349

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '212238a22199'
down_revision: Union[str, Sequence[str], None] = '04091d468fca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy import inspect

    if inspect(op.get_bind()).has_table('journal_entries'):
        return

    op.create_table(
        'journal_entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('farm_id', sa.Integer(), nullable=True),
        sa.Column('scan_session_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id']),
        sa.ForeignKeyConstraint(['scan_session_id'], ['scan_sessions.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_journal_entries_id'), 'journal_entries', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_journal_entries_id'), table_name='journal_entries')
    op.drop_table('journal_entries')