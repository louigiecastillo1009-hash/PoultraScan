"""Add scan chicken type and user-entered oil correction.

- scan_sessions.chicken_type: BROILER or NATIVE, selects the market-weight
  target. Existing rows default to BROILER.
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

    session_columns = {c["name"] for c in inspector.get_columns("scan_sessions")}
    if "chicken_type" not in session_columns:
        op.add_column(
            "scan_sessions",
            sa.Column(
                "chicken_type",
                sa.String(length=20),
                nullable=False,
                server_default="BROILER",
            ),
        )

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

    session_columns = {c["name"] for c in inspector.get_columns("scan_sessions")}
    if "chicken_type" in session_columns:
        op.drop_column("scan_sessions", "chicken_type")
