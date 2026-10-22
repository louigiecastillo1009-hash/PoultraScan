"""
Ensures the database schema is up to date by running Alembic migrations
automatically on app startup.

This prevents "Table ... doesn't exist" errors when a model is added but
its migration was never applied to the live database (Render/Aiven).
"""
import os

from sqlalchemy import inspect, text


def _build_alembic_config():
    from alembic.config import Config

    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cfg = Config(os.path.join(backend_dir, "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(backend_dir, "migrations"))
    cfg.set_main_option("prepend_sys_path", backend_dir)
    return cfg


def ensure_migrated() -> None:
    """
    Idempotent bootstrap:
    1. If no alembic version is tracked but tables already exist (schema was
       created before Alembic was wired up), stamp the initial revision.
    2. Run `alembic upgrade head` so every pending migration is applied.
    """
    import logging

    from alembic import command
    from sqlalchemy.exc import SQLAlchemyError

    from database.database import engine

    logger = logging.getLogger("uvicorn.error")

    cfg = _build_alembic_config()

    try:
        inspector = inspect(engine)
        tracked = []
        if inspector.has_table("alembic_version"):
            with engine.connect() as conn:
                tracked = conn.execute(
                    text("SELECT version_num FROM alembic_version")
                ).fetchall()

        if not tracked and inspector.has_table("users"):
            # Schema predates Alembic tracking -> mark the initial migration
            # as applied instead of re-creating existing tables.
            logger.info("Alembic not tracked, stamping initial revision e587b1b94078")
            command.stamp(cfg, "e587b1b94078")

        logger.info("Running database migrations (alembic upgrade head)...")
        command.upgrade(cfg, "head")
        logger.info("Database migrations up to date.")
    except SQLAlchemyError as exc:
        # Never let a migration failure crash the whole app; it is already
        # logged loudly so the issue shows up in the Render logs.
        logger.error(f"Database migration failed: {exc}")
