from datetime import timedelta
import logging

from sqlalchemy.orm import Session
from fastapi import status, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.background import BackgroundTask
from database.database import SessionLocal
from utils.jwt_handler import ACCESS_TOKEN_EXPIRE_MINUTES
from services.user_service import UserService
from services.notification_service import NotificationService
from services.email_service import EmailService
from utils.google_auth import get_google_user_info
from utils.jwt_handler import create_access_token
from schemas.user_schema import (
    RegisterUserSchema,
    LoginUserSchema,
    UserResponseSchema,
    ForgotPasswordSchema,
    VerifyResetCodeSchema,
    ResetPasswordSchema,
)
from schemas.notification_schema import CreateNotificationSchema

logger = logging.getLogger(__name__)

REMEMBER_ME_EXPIRE_DAYS = 30
DEFAULT_SESSION_MAX_AGE = ACCESS_TOKEN_EXPIRE_MINUTES * 60  # matches the JWT's exp
REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * REMEMBER_ME_EXPIRE_DAYS


def _send_welcome_email_task(user_id: int, email: str, name: str) -> None:
    """Runs after the login response is sent, so email never slows/breaks login."""
    try:
        EmailService.send_welcome_email(email, name)
    except Exception as exc:
        logger.warning("Failed to send welcome email to %s: %s", email, exc)
        db = SessionLocal()
        try:
            UserService.release_welcome_email(db, user_id)
        except Exception as release_exc:
            logger.warning("Could not reset welcome flag for user %s: %s", user_id, release_exc)
        finally:
            db.close()


def _welcome_email_task_for(db: Session, user) -> BackgroundTask | None:
    """Return a background task for the user's first login, or None."""
    if getattr(user, "welcome_email_sent_at", None) is not None:
        return None
    if not EmailService.is_configured():
        # Don't mark users as welcomed when email can't actually be sent.
        return None
    try:
        if not UserService.claim_welcome_email(db, user.id):
            return None
    except Exception as exc:
        db.rollback()
        logger.warning("Could not claim welcome email for user %s: %s", user.id, exc)
        return None
    return BackgroundTask(
        _send_welcome_email_task, user.id, user.email, user.fullname or user.username
    )


class AuthController:

    @staticmethod
    def register(user: RegisterUserSchema, db: Session):
        new_user = UserService.register(db, user)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "User registered successfully",
                "user": UserResponseSchema.model_validate(new_user).model_dump(mode="json")
            }
        )

    @staticmethod
    def login(credentials: LoginUserSchema, db: Session):
        user = UserService.verify_login(db, credentials.email, credentials.password)

        if credentials.remember_me:
            token = UserService.generate_token_for_user(
                user, expires_delta=timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
            )
            cookie_max_age = REMEMBER_ME_MAX_AGE
        else:
            token = UserService.generate_token_for_user(user)
            cookie_max_age = DEFAULT_SESSION_MAX_AGE

        NotificationService.create(db, CreateNotificationSchema(
            user_id=user.id,
            title="Logged in",
            message=f"You logged in as {user.username}."
        ))

        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Login successful"},
            background=_welcome_email_task_for(db, user),
        )
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="none",
            secure=True,
            max_age=cookie_max_age
        )
        return response

    @staticmethod
    def logout(response: Response, user_id: int, db: Session):
        NotificationService.create(db, CreateNotificationSchema(
            user_id=user_id,
            title="Logged out",
            message="You logged out."
        ))
        response.delete_cookie(
            "access_token",
            httponly=True,
            samesite="none",
            secure=True,
        )
        return {"message": "Logout successful"}

    @staticmethod
    def get_current(user_id: int, db: Session):
        user = UserService.find_by_id(db, user_id)
        return UserResponseSchema.model_validate(user)

    @staticmethod
    def forgot_password(payload: ForgotPasswordSchema, db: Session):
        if not UserService.find_by_email(db, payload.email):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        token = UserService.create_reset_token(db, payload.email)

        if token:
            # Email the code directly from the backend. If the send actually fails
            # (provider/config problem), surface a clean 502 instead of silently
            # telling the user the email was sent.
            try:
                EmailService.send_reset_password_code(payload.email, token)
            except HTTPException:
                raise
            except Exception as exc:
                logger.warning("Failed to send password reset code to %s: %s", payload.email, exc)
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="We couldn't send the password reset email right now. Please try again in a few minutes or contact support.",
                )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "If that email exists, a reset link has been generated.",
            }
        )

    @staticmethod
    def verify_reset_code(payload: VerifyResetCodeSchema, db: Session):
        if not UserService.is_reset_token_valid(db, payload.token):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset code",
            )
        return {"message": "Reset code verified successfully"}

    @staticmethod
    def reset_password(payload: ResetPasswordSchema, db: Session):
        UserService.reset_password_with_token(db, payload.token, payload.new_password)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Password reset successfully"}
        )

    @staticmethod
    async def google_login(credential: str, db: Session):
        # `credential` here is the Google access_token from useGoogleLogin (not an ID token)
        userinfo = await get_google_user_info(credential)
        user = UserService.find_or_create_google_user(
            db,
            email=userinfo["email"],
            fullname=userinfo.get("name", ""),
            avatar_url=userinfo.get("picture"),
        )
        token = UserService.generate_token_for_user(user)

        NotificationService.create(db, CreateNotificationSchema(
            user_id=user.id,
            title="Logged in",
            message=f"You logged in as {user.username}."
        ))

        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Login successful"},
            background=_welcome_email_task_for(db, user),
        )
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="none",
            secure=True,
            max_age=DEFAULT_SESSION_MAX_AGE
        )
        return response