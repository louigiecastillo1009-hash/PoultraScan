import os
import tempfile
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DB_HOST = os.environ["DB_HOST"]
DB_PORT = os.environ["DB_PORT"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]
DB_SSL_CA = os.environ["DB_SSL_CA"]  # this holds the PEM content pasted into Render's env vars

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# URL WITHOUT the database name - used only for bootstrap (CREATE DATABASE)
_SERVER_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/"


def _ensure_database_exists() -> None:
    """
    The target database may not exist on a fresh Aiven service (error 1049).
    Connect WITHOUT selecting a database and create it if needed.
    Safe to run on every startup (IF NOT EXISTS).
    """
    bootstrap_engine = create_engine(
        _SERVER_URL,
        connect_args={
            "ssl": {"ca": ssl_ca_path}
        },
    )
    try:
        with bootstrap_engine.connect() as conn:
            conn.execute(text(
                f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            ))
            conn.commit()
    finally:
        bootstrap_engine.dispose()


def _resolve_ssl_ca_path(ca_value: str) -> str:
    """
    DB_SSL_CA may be either:
      - an actual file path (e.g. locally, if you point to a downloaded ca.pem), or
      - the raw PEM certificate content (e.g. pasted into Render's env var dashboard)

    PyMySQL's ssl.ca option requires a real file path, so if we were given raw
    PEM content, write it to a temp file and return that path instead.
    """
    if os.path.isfile(ca_value):
        return ca_value

    fd, path = tempfile.mkstemp(prefix="aiven-ca-", suffix=".pem")
    with os.fdopen(fd, "w") as f:
        f.write(ca_value)
    return path


ssl_ca_path = _resolve_ssl_ca_path(DB_SSL_CA)

_ensure_database_exists()

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl": {
            "ca": ssl_ca_path
        }
    },
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()