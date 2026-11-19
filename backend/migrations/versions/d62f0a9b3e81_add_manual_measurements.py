"""Store user-entered measurements separately from AI estimates."""
from alembic import op
import sqlalchemy as sa

revision = "d62f0a9b3e81"
down_revision = "c51e9f8a2d70"
branch_labels = None
depends_on = None


def upgrade():
    columns = {c["name"] for c in sa.inspect(op.get_bind()).get_columns("detected_chickens")}
    for name, precision in (("measured_weight_kg", 3), ("measured_height_cm", 2)):
        if name not in columns:
            op.add_column("detected_chickens", sa.Column(name, sa.DECIMAL(8, precision), nullable=True))


def downgrade():
    op.drop_column("detected_chickens", "measured_height_cm")
    op.drop_column("detected_chickens", "measured_weight_kg")
