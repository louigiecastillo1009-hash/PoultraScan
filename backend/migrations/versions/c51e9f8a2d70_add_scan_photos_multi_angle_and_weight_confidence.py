"""add scan_photos table, detected_chickens.scan_photo_id, ai_predictions.weight_confidence

Revision ID: c51e9f8a2d70
Revises: b8d4e6c2f9a1
Create Date: 2026-11-18 10:00:00.000000

Multi-angle scans + honest weight confidence:
- scan_photos: one row per source photo uploaded for a scan session
  (FRONT / BACK / LEFT / RIGHT). Sessions can now hold several photos,
  each analyzed independently.
- detected_chickens.scan_photo_id: links every detection to the photo it
  was detected in, so crops/predictions come from the right image.
- ai_predictions.weight_confidence: the vision model's own confidence in
  its weight ESTIMATE (weight is estimated from a photo, never measured).

All steps are idempotent (safe to re-run), matching the existing
migration style.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = 'c51e9f8a2d70'
down_revision: Union[str, Sequence[str], None] = 'b8d4e6c2f9a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    inspector = inspect(op.get_bind())
    op.alter_column('chicken_images', 'image_type',
                    existing_type=sa.Enum('WEBCAM', 'FRONT', 'LEFT', 'RIGHT'),
                    type_=sa.Enum('WEBCAM', 'FRONT', 'BACK', 'LEFT', 'RIGHT'),
                    existing_nullable=False)

    if not inspector.has_table('scan_photos'):
        op.create_table(
            'scan_photos',
            sa.Column('id', sa.Integer(), primary_key=True, index=True),
            sa.Column(
                'scan_session_id',
                sa.Integer(),
                sa.ForeignKey('scan_sessions.id', ondelete='CASCADE'),
                nullable=False,
            ),
            sa.Column('angle', sa.String(length=10), nullable=False,
                      server_default='FRONT'),
            sa.Column('image_url', sa.String(length=255), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True),
                      server_default=sa.func.now()),
        )

    detected_columns = {c['name'] for c in inspector.get_columns('detected_chickens')}
    if 'scan_photo_id' not in detected_columns:
        op.add_column(
            'detected_chickens',
            sa.Column('scan_photo_id', sa.Integer(), nullable=True),
        )
    detected_fks = {fk['name'] for fk in inspector.get_foreign_keys('detected_chickens')}
    if 'fk_detected_chickens_scan_photo_id' not in detected_fks:
        op.create_foreign_key(
            'fk_detected_chickens_scan_photo_id',
            'detected_chickens',
            'scan_photos',
            ['scan_photo_id'],
            ['id'],
            ondelete='SET NULL',
        )

    prediction_columns = {c['name'] for c in inspector.get_columns('ai_predictions')}
    if 'weight_confidence' not in prediction_columns:
        op.add_column(
            'ai_predictions',
            sa.Column('weight_confidence', sa.DECIMAL(5, 2), nullable=True),
        )


def downgrade() -> None:
    inspector = inspect(op.get_bind())

    prediction_columns = {c['name'] for c in inspector.get_columns('ai_predictions')}
    if 'weight_confidence' in prediction_columns:
        op.drop_column('ai_predictions', 'weight_confidence')

    detected_fks = {fk['name'] for fk in inspector.get_foreign_keys('detected_chickens')}
    if 'fk_detected_chickens_scan_photo_id' in detected_fks:
        op.drop_constraint(
            'fk_detected_chickens_scan_photo_id', 'detected_chickens',
            type_='foreignkey',
        )
    detected_columns = {c['name'] for c in inspector.get_columns('detected_chickens')}
    if 'scan_photo_id' in detected_columns:
        op.drop_column('detected_chickens', 'scan_photo_id')

    if inspector.has_table('scan_photos'):
        op.drop_table('scan_photos')
