"""
Saves a compressed scan photo (or chicken crop) to disk and returns its
public /static URL. Shared by detection (source photos) and prediction
(per-chicken crops) so both store images the same way.
"""

import os
import uuid

from utils.image_compression import compress_image

UPLOAD_DIR = os.path.join("static", "uploads", "chicken_images")

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_compressed_image(image_bytes: bytes, preserve_pixels: bool = False) -> str:
    """
    Compresses the image and saves it under static/uploads/chicken_images,
    returning the public URL (e.g. /static/uploads/chicken_images/<hex>.jpg).
    """
    compressed_bytes, extension = (image_bytes, "jpg") if preserve_pixels else compress_image(image_bytes)
    filename = f"{uuid.uuid4().hex}.{extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(compressed_bytes)

    return f"/static/uploads/chicken_images/{filename}"
