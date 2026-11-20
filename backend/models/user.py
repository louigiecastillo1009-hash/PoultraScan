from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from database.base import Base
import enum


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)

    avatar_url = Column(String(255), nullable=True)

    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(DateTime(timezone=True), nullable=True)

    # Set once the "Welcome to Poultry Scan" email has gone out (first login only)
    welcome_email_sent_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )