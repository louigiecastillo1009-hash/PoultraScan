import os
import tempfile
import ssl
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DB_HOST = os.environ["DB_HOST"]
DB_PORT = os.environ["DB_PORT"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]
# DB_SSL_CA may be omitted on Render/local deployments whose DB uses a
# publicly trusted certificate (system trust store works).
DB_SSL_CA = os.environ.get("DB_SSL_CA", "")  # PEM path or raw certificate content

if not DB_PORT.strip().isdigit():
    raise RuntimeError(
        f"CONFIG ERROR: DB_PORT must be a number, got {DB_PORT!r}. "
        "Check your environment variables (Render dashboard / .env file)."
    )

if not DB_PASSWORD:
    # Local MySQL (e.g. Laragon root) legitimately uses an empty password.
    # A remote provider should never accept an empty password though.
    if DB_HOST not in ("localhost", "127.0.0.1"):
        print("WARNING: DB_PASSWORD is empty for a remote DB — check your environment variables.")

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
        connect_args=_ssl_connect_args,
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
    if not ca_value:
        return ""  # No CA configured; SSL detection will skip the "ca" mode.

    if os.path.isfile(ca_value):
        return ca_value

    fd, path = tempfile.mkstemp(prefix="aiven-ca-", suffix=".pem")
    with os.fdopen(fd, "w") as f:
        f.write(ca_value)
    return path


ssl_ca_path = _resolve_ssl_ca_path(DB_SSL_CA)


def _detect_ssl_mode() -> str | None:
    """
    Decide which SSL strategy the current DB_HOST actually accepts:
      - "ca"      : our custom DB_SSL_CA validates the server chain (Aiven)
      - "system"  : the server cert is publicly trusted (e.g. Let's Encrypt
                    via a custom domain) -> use the OS trust store
      - None      : local MySQL (localhost/127.0.0.1) -> no SSL at all

    Probed with a short-lived PyMySQL connection, so it keeps working when
    the provider changes, as long as the server itself is reachable.
    """
    if DB_HOST in ("localhost", "127.0.0.1"):
        return None

    import pymysql

    kwargs = dict(
        host=DB_HOST,
        port=int(DB_PORT),
        user=DB_USER,
        password=DB_PASSWORD,
        connect_timeout=10,
    )

    # Build the ladder of SSL strategies to try, in order of preference.
    candidates = []
    if DB_SSL_CA.strip():
        # Only consult the custom CA when a CA was actually provided —
        # an empty/missing CA must NOT be passed (invalid empty PEM file).
        candidates.append(("ca", {"ca": ssl_ca_path}))
    candidates.append(("system", ssl.create_default_context()))

    last_exc: Exception | None = None
    for mode, ssl_arg in candidates:
        try:
            pymysql.connect(ssl=ssl_arg, **kwargs).close()
            return mode
        except Exception as exc:  # OperationalError, ssl.SSLError, etc.
            last_exc = exc

    raise RuntimeError(
        f"Could not connect to MySQL at {DB_HOST} with any SSL strategy; "
        f"last error: {last_exc}"
    ) from last_exc


_ssl_mode = _detect_ssl_mode()

if _ssl_mode == "ca":
    # Configured CA validated the server (e.g. Aiven).
    _ssl_connect_args = {"ssl": {"ca": ssl_ca_path}}
elif _ssl_mode == "system":
    # Server cert is publicly trusted -> OS trust store.
    _ssl_connect_args = {"ssl": ssl.create_default_context()}
else:
    # Local MySQL -> no SSL.
    _ssl_connect_args = {}

_ensure_database_exists()

engine = create_engine(
    DATABASE_URL,
    connect_args=_ssl_connect_args,
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