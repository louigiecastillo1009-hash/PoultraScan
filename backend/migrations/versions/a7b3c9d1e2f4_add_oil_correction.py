"""Add user-entered oil correction.

- detected_chickens.measured_oil_ml: optional user-entered oil yield that
  overrides the AI display value without deleting the original estimate.

Idempotent, matching the existing migration style.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "a7b3c9d1e2f4"
down_revision = "d62f0a9b3e81"
branch_labels = None
depends_on = None


def upgrade():
    inspector = inspect(op.get_bind())

    chicken_columns = {c["name"] for c in inspector.get_columns("detected_chickens")}
    if "measured_oil_ml" not in chicken_columns:
        op.add_column(
            "detected_chickens",
            sa.Column("measured_oil_ml", sa.DECIMAL(8, 2), nullable=True),
        )


def downgrade():
    inspector = inspect(op.get_bind())

    chicken_columns = {c["name"] for c in inspector.get_columns("detected_chickens")}
    if "measured_oil_ml" in chicken_columns:
        op.drop_column("detected_chickens", "measured_oil_ml")
