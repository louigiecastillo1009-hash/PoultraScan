import secrets
import string
import io
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.user import User
from schemas.user_schema import RegisterUserSchema, UpdateUserSchema
from services.abstract_email_service import AbstractEmailService
from utils.security import hash_password, verify_password
from utils.jwt_handler import create_access_token
from fastapi import UploadFile
from utils.image_compression import compress_image
from utils.cloudinary_upload import cloudinary  # reuse existing cloudinary.config() setup
import cloudinary.uploader

MAX_AVATAR_SIZE = 5 * 1024 * 1024      # 5MB — real limit, checked AFTER compression
RAW_UPLOAD_CAP = 25 * 1024 * 1024      # 25MB — just blocks absurd uploads before wasting CPU compressing them


class UserService:

    @staticmethod
    def save_avatar(db: Session, user_id: int, file: UploadFile) -> User:
        user = UserService.find_by_id(db, user_id)

        contents = file.file.read()

        # Sanity check on the raw upload only — NOT the real size limit
        if len(contents) > RAW_UPLOAD_CAP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image too large. Max upload size is 25MB."
            )

        try:
            compressed_bytes, ext = compress_image(contents)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported or corrupted image file."
            )

        # Real limit applies to the compressed output, not the original upload
        if len(compressed_bytes) > MAX_AVATAR_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image still too large after compression."
            )

        try:
            result = cloudinary.uploader.upload(
                io.BytesIO(compressed_bytes),
                folder="poultrascan/avatars",
                resource_type="image",
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to upload avatar to Cloudinary."
            )

        user.avatar_url = result["secure_url"]
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def find_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def find_by_username(db: Session, username: str) -> User | None:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def find_by_id(db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def register(db: Session, user: RegisterUserSchema) -> User:
        if UserService.find_by_email(db, user.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

        if UserService.find_by_username(db, user.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")

        check_result = AbstractEmailService.check(user.email)
        if not check_result["allowed"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=check_result.get("reason") or "This email address appears invalid or risky.",
            )

        hashed_password = hash_password(user.password)

        new_user = User(
            fullname=user.fullname,
            username=user.username,
            email=user.email,
            password=hashed_password
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def verify_login(db: Session, email: str, password: str) -> User:
        user = UserService.find_by_email(db, email)

        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        return user

    @staticmethod
    def generate_token_for_user(user: User, expires_delta: timedelta | None = None) -> str:
        payload = {
            "sub": str(user.id),
            "role": user.role.value if hasattr(user.role, "value") else user.role
        }
        return create_access_token(payload, expires_delta=expires_delta)

    @staticmethod
    def create_reset_token(db: Session, email: str) -> str | None:
        user = UserService.find_by_email(db, email)
        if not user:
            # Don't reveal whether the email exists in our system.
            return None

        # 6-character alphanumeric code, uppercase letters + digits, easy to type from an email
        alphabet = string.ascii_uppercase + string.digits
        code = ''.join(secrets.choice(alphabet) for _ in range(6))

        user.reset_token = code
        user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=30)
        db.commit()
        return code

    @staticmethod
    def is_reset_token_valid(db: Session, token: str) -> bool:
        """Check a reset code without consuming it (used by the verify step)."""
        user = db.query(User).filter(User.reset_token == token.upper()).first()

        if not user or not user.reset_token_expiry:
            return False

        expiry = user.reset_token_expiry
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        return expiry >= datetime.now(timezone.utc)

    @staticmethod
    def reset_password_with_token(db: Session, token: str, new_password: str) -> User:
        # Normalize case since users might type the code in lowercase
        user = db.query(User).filter(User.reset_token == token.upper()).first()

        if not user or not user.reset_token_expiry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset code")

        expiry = user.reset_token_expiry
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if expiry < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset code")

        user.password = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def claim_welcome_email(db: Session, user_id: int) -> bool:
        """Atomically mark the welcome email as sent.

        Returns True only for the single request that flips the flag, so two
        simultaneous first logins can never send the welcome email twice.
        """
        claimed = (
            db.query(User)
            .filter(User.id == user_id, User.welcome_email_sent_at.is_(None))
            .update({User.welcome_email_sent_at: datetime.now(timezone.utc)}, synchronize_session=False)
        )
        db.commit()
        return claimed == 1

    @staticmethod
    def release_welcome_email(db: Session, user_id: int) -> None:
        """Undo a claim when sending failed, so the next login retries."""
        db.query(User).filter(User.id == user_id).update(
            {User.welcome_email_sent_at: None}, synchronize_session=False
        )
        db.commit()

    @staticmethod
    def find_or_create_google_user(db: Session, email: str, fullname: str, avatar_url: str | None = None) -> User:
        user = UserService.find_by_email(db, email)
        if user:
            # Backfill avatar for existing accounts that don't have one yet
            # (won't overwrite an avatar the user uploaded manually)
            if avatar_url and not user.avatar_url:
                user.avatar_url = avatar_url
                db.commit()
                db.refresh(user)
            return user

        base_username = email.split("@")[0]
        username = base_username
        suffix = 1
        while UserService.find_by_username(db, username):
            username = f"{base_username}{suffix}"
            suffix += 1

        new_user = User(
            fullname=fullname or base_username,
            username=username,
            email=email,
            password=secrets.token_hex(32),
            avatar_url=avatar_url,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def update(db: Session, user_id: int, data: UpdateUserSchema) -> User:
        user = UserService.find_by_id(db, user_id)

        update_data = data.model_dump(exclude_unset=True)

        if "email" in update_data and update_data["email"] != user.email:
            existing = UserService.find_by_email(db, update_data["email"])
            if existing:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

            check_result = AbstractEmailService.check(update_data["email"])
            if not check_result["allowed"]:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=check_result.get("reason") or "This email address appears invalid or risky.",
                )

        for field, value in update_data.items():
            setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user_id: int) -> None:
        user = UserService.find_by_id(db, user_id)
        db.delete(user)
        db.commit()