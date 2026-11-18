"""
Crops a single chicken out of the full scan image using its stored
bounding box (center x/y + width/height, pixel space — same convention
produced by gemini_image_counter._convert_box_2d_to_pixel_box). Adds a
small padding margin so the crop isn't razor-tight around the bird.
"""

import io
import os

from PIL import Image

CROP_PADDING_RATIO = 0.10  # 10% padding on each side of the box

# Longest side allowed for AI-submitted crops. Crops used to be sent at
# their full pixel size (a close-up chicken could be thousands of pixels),
# which burns large amounts of image tokens for zero accuracy gain.
# 768px keeps enough detail for disease/size judgment while keeping token
# usage predictable. Override with CROP_MAX_PIXELS in the environment;
# set to 0 to disable capping entirely.
CROP_MAX_PIXELS = int(os.getenv("CROP_MAX_PIXELS", "768") or "0")


def crop_chicken_image(image_bytes: bytes, x: float, y: float, width: float, height: float) -> bytes:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_w, img_h = image.size

    pad_x = width * CROP_PADDING_RATIO
    pad_y = height * CROP_PADDING_RATIO

    left = x - (width / 2) - pad_x
    top = y - (height / 2) - pad_y
    right = x + (width / 2) + pad_x
    bottom = y + (height / 2) + pad_y

    left = max(0, int(left))
    top = max(0, int(top))
    right = min(img_w, int(right))
    bottom = min(img_h, int(bottom))

    # Never silently substitute a whole flock for one chicken.
    if right <= left or bottom <= top:
        raise ValueError("Invalid chicken bounding box; please run detection again.")
    else:
        cropped = image.crop((left, top, right, bottom))

    # This cap is configurable; fine-detail quality must be evaluated on
    # representative photos before choosing a production resolution.
    if CROP_MAX_PIXELS > 0 and max(cropped.size) > CROP_MAX_PIXELS:
        cropped.thumbnail((CROP_MAX_PIXELS, CROP_MAX_PIXELS), Image.LANCZOS)

    buffer = io.BytesIO()
    cropped.save(buffer, format="JPEG", quality=90)
    return buffer.getvalue()
