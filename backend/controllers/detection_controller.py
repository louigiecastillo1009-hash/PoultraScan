"""
Thin controller — validates the incoming request shape, delegates all
business logic to DetectionService, and translates exceptions into
proper HTTP responses. No Gemini logic and no direct DB writes here.
"""

import os
import uuid
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from PIL import UnidentifiedImageError

from services.detection_service import DetectionService
from utils.gemini_image_counter import GeminiCountingError, ImageQualityError
from utils.image_converter import convert_to_jpeg

MAX_FILE_SIZE_MB = 10

# Temporary debug folder — lets us visually inspect exactly what bytes
# are being sent to Gemini, to rule out corruption during conversion.
DEBUG_DIR = os.path.join("static", "debug_uploads")
os.makedirs(DEBUG_DIR, exist_ok=True)


class DetectionController:

    @staticmethod
    def _validate_and_convert_image(file: UploadFile, contents: bytes) -> bytes:
        """
        Validates the upload and converts it to JPEG bytes using the
        existing image_converter util. This means any Pillow-supported
        format (jpg, jpeg, png, webp, bmp, etc.) is accepted — instead
        of hard-rejecting based on file extension alone.
        """
        if not file or not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No image file was provided."
            )

        if not contents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty."
            )

        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large ({size_mb:.2f} MB). Max allowed is {MAX_FILE_SIZE_MB} MB"
            )

        # Try to convert — this is the real validation. If Pillow can't
        # open it, it's not a real/supported image, regardless of extension.
        try:
            jpeg_bytes = convert_to_jpeg(contents)
        except UnidentifiedImageError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported or corrupted image file. Could not read image data."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to process image: {str(e)}"
            )

        # DEBUG: save the exact converted bytes we're about to send to
        # Gemini, so we can open the file and visually confirm it's
        # still a valid, recognizable photo (not corrupted/blank/rotated).
        debug_filename = f"debug_{uuid.uuid4().hex}.jpg"
        debug_path = os.path.join(DEBUG_DIR, debug_filename)
        with open(debug_path, "wb") as f:
            f.write(jpeg_bytes)
        print(f"[IMAGE DEBUG] Saved converted image sent to Gemini at: {debug_path}")

        return jpeg_bytes

    @staticmethod
    def count_chickens(db: Session, scan_session_id: int, file: UploadFile, angle: str = "FRONT"):
        contents = file.file.read()

        # Validate + convert to JPEG before sending to Gemini.
        jpeg_bytes = DetectionController._validate_and_convert_image(file, contents)

        try:
            result = DetectionService.detect_and_count(
                db=db,
                scan_session_id=scan_session_id,
                image_bytes=jpeg_bytes,
                angle=angle,
            )
            return result

        except ImageQualityError as e:
            # User-fixable issue (blurry photo / no chicken in frame) —
            # 400 so the frontend shows it as an actionable message rather
            # than a generic "something went wrong on our end" error.
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

        except GeminiCountingError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Gemini counting failed: {str(e)}"
            )

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error during chicken detection: {str(e)}"
            )