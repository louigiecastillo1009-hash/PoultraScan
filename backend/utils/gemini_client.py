"""
Wraps Gemini API calls to generate poultry care tips and estimates
based on the AI model's disease prediction AND the actual scanned image.

Sends the photo itself to Gemini (vision-capable models) so weight/oil
estimates are based on what the chicken actually looks like in frame,
not just a blind guess from the disease label alone.
"""

import os
import json
import math
from google import genai
from google.genai import types
from dotenv import load_dotenv
from utils.scan_result_validation import ordered_image_results

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

FREE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
]

MIN_REALISTIC_WEIGHT_KG = 0.1
MAX_REALISTIC_WEIGHT_KG = 8.0

# Oil yield is COMPUTED from real weight using a fixed rendering model, never
# guessed by the AI. Formula (all constants named so the math is auditable):
#   edible fat (g)   = weight_kg * 1000 * OIL_FAT_RATIO * OIL_RENDERING_EFFICIENCY
#   oil (ml)         = edible fat (g) / OIL_DENSITY_G_PER_ML
#   => ml per kg     = 1000 * 0.10 * 0.80 / 0.90 = 88.89 ml/kg
OIL_FAT_RATIO = 0.10
OIL_RENDERING_EFFICIENCY = 0.80
OIL_DENSITY_G_PER_ML = 0.90
MAX_REALISTIC_OIL_ML = 900.0
OIL_YIELD_ML_PER_KG = (1000 * OIL_FAT_RATIO * OIL_RENDERING_EFFICIENCY) / OIL_DENSITY_G_PER_ML


def _compute_oil_ml(weight_kg: float) -> float:
    """
    Computes oil yield from an already-sanitized weight (kg) using the fixed
    rendering formula above (~88.89 ml per kg). Returns 0.0 when the weight
    is unusable so a failed weight never produces a fabricated oil number.
    Rounded to the nearest whole millilitre.
    """
    if not weight_kg or weight_kg <= 0:
        return 0.0
    return round(min(weight_kg * OIL_YIELD_ML_PER_KG, MAX_REALISTIC_OIL_ML))


class GeminiInsightsError(Exception):
    """Raised when every model in FREE_MODELS fails to return a usable
    batch insights response (e.g. quota/rate-limit exhaustion across
    all free-tier Gemini models). Callers can catch this to fall back
    to an alternate vision provider."""
    pass


def _build_prompt(disease: str, confidence: float) -> str:
    return f"""
You are a poultry health assistant for a chicken farm monitoring app.

You are given a photo of a live chicken. A separate AI model already classified it as:
- Disease: {disease}
- Confidence: {confidence}%

Look carefully at the chicken in the image (its size, body condition, posture) and estimate
realistic values based on what you actually see. A typical broiler chicken weighs between
1.0 and 3.5 kg — use the visual size of the bird in the photo to judge where it falls in
that range (or slightly outside it if the bird looks unusually small/large).

Respond ONLY with valid JSON, no markdown, no code fences, in this exact format:
{{
  "tips": "2-4 sentences of practical care/treatment advice for this condition",
  "estimated_weight": <number in kg, based on the chicken's visible size in the photo, realistic broiler range>,
  "weight_confidence": <integer 0-100, how confident you are in the weight estimate given the bird's visibility and framing in the photo>,
  "market_ready": <true or false, whether this chicken would be safe/ready for market>
}}

Note: oil yield is NOT requested here — the app computes it from the
estimated_weight using its own formula, so do not invent an oil number.

If disease is HEALTHY, market_ready should lean true and tips should be general maintenance advice.
If disease is COCCIDIOSIS, FOWL_POX, or NEWCASTLE, market_ready should be false and tips should focus on treatment/isolation.
"""


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "image/jpeg"


def _sanitize_weight_confidence(raw_confidence) -> float:
    """
    Clamps the AI's self-reported weight-estimate confidence to 0-100,
    defaulting to 0 when missing/garbage so a missing value never reads
    as "fully confident".
    """
    try:
        conf = float(raw_confidence)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(conf, 100.0)) if math.isfinite(conf) else 0.0


def _sanitize_weight(raw_weight) -> float:
    try:
        weight = float(raw_weight)
    except (TypeError, ValueError):
        print(f"[WEIGHT DEBUG] Gemini returned non-numeric weight: {raw_weight!r}")
        return 0.0

    if not math.isfinite(weight) or weight < MIN_REALISTIC_WEIGHT_KG or weight > MAX_REALISTIC_WEIGHT_KG:
        print(
            f"[WEIGHT DEBUG] UNREALISTIC weight from Gemini: {weight} kg "
            f"(expected between {MIN_REALISTIC_WEIGHT_KG}-{MAX_REALISTIC_WEIGHT_KG} kg). "
            f"Returning 0.0 instead of a fake number."
        )
        return 0.0

    return round(weight, 3)


def get_disease_insights(disease: str, confidence: float, image_bytes: bytes) -> dict:
    """
    Single-chicken version. Kept for backward compatibility / fallback use.
    """
    prompt = _build_prompt(disease, confidence)
    mime_type = _detect_mime_type(image_bytes)

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt
                ]
            )

            raw_text = response.text.strip()
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_text)

            print(f"Gemini insight generated successfully using model: {model_name}")

            weight = _sanitize_weight(data.get("estimated_weight", 0.0))

            return {
                "tips": data.get("tips", "No specific advice available."),
                "estimated_weight": weight,
                "weight_confidence": _sanitize_weight_confidence(data.get("weight_confidence")),
                "estimated_oil_ml": _compute_oil_ml(weight),
                "market_ready": bool(data.get("market_ready", False))
            }

        except Exception as e:
            print(f"Model '{model_name}' failed: {e}. Trying next model...")
            continue

    print("All Gemini models failed. Returning fallback defaults.")
    return {
        "tips": "Unable to generate care tips at this time. Please consult a veterinarian.",
        "estimated_weight": 0.0,
        "weight_confidence": 0.0,
        "estimated_oil_ml": 0.0,
        "market_ready": False
    }


def get_disease_insights_batch(items: list[dict]) -> list[dict]:
    """
    Batched version — one Gemini call for ALL chickens in a scan.

    items: list of {"disease": str, "confidence": float, "image_bytes": bytes},
    one per chicken, in order.

    Returns a list of insight dicts (tips, estimated_weight, estimated_oil_ml,
    market_ready) in the same order as `items`.

    Raises:
        GeminiInsightsError: if every model in FREE_MODELS fails to
            return a usable response. Callers can catch this to fall
            back to an alternate vision provider (e.g. OpenRouter)
            instead of silently getting zeroed-out defaults.
    """
    parts = []
    for index, item in enumerate(items, start=1):
        parts.append(types.Part.from_text(text=f"image_{index}"))
        mime_type = _detect_mime_type(item["image_bytes"])
        parts.append(types.Part.from_bytes(data=item["image_bytes"], mime_type=mime_type))

    disease_list_str = "\n".join(
        f"- image_{i+1}: disease={item['disease']}, confidence={item['confidence']}%"
        for i, item in enumerate(items)
    )

    batch_prompt = f"""
You are a poultry health assistant for a chicken farm monitoring app.

You are given {len(items)} separate chicken images, in order, labeled
image_1 through image_{len(items)}. Each has already been classified by
a separate AI model as follows:

{disease_list_str}

For EACH image, assess visible body condition and posture independently.
Do not substitute a typical broiler weight for an unsupported estimate.

IMPORTANT: Pixel size and crop occupancy do NOT establish real weight.
These are automatic crops with unknown distance, age and scale. Do not
infer weight from apparent size. If there is no reliable scale or supporting
information, return estimated_weight: null and weight_confidence: null.
Any confidence is self-reported uncertainty, NOT a measured accuracy rate.

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(items)} objects in the same order as the images, each in
this exact format:
{{
  "image_id": "image_1",
  "tips": "2-4 sentences of practical care/treatment advice for this condition",
  "estimated_weight": <number in kg ONLY if supported, otherwise null>,
  "weight_confidence": <integer 0-100, how confident you are in that weight estimate given the bird's visibility and framing in that image>,
  "market_ready": <true or false>
}}
Use the actual image ID (image_1, image_2, etc.) for each result.

Note: oil yield is NOT requested here — the app computes it from each
estimated_weight using its own formula, so do not invent an oil number.

If a chicken's disease is HEALTHY, market_ready should lean true and tips
should be general maintenance advice. If COCCIDIOSIS, FOWL_POX, or
NEWCASTLE, market_ready should be false and tips should focus on
treatment/isolation.
"""

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=parts + [batch_prompt]
            )

            raw_text = response.text.strip()
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_text)

            if not isinstance(data, list) or len(data) != len(items):
                print(f"[BATCH INSIGHTS] '{model_name}' returned malformed/mismatched array length. Trying next model...")
                continue

            data = ordered_image_results(data, len(items))
            results = []
            for entry in data:
                weight = _sanitize_weight(entry.get("estimated_weight", 0.0))
                results.append({
                    "tips": entry.get("tips", "No specific advice available."),
                    "estimated_weight": weight,
                    "weight_confidence": _sanitize_weight_confidence(entry.get("weight_confidence")),
                    "estimated_oil_ml": _compute_oil_ml(weight),
                    "market_ready": bool(entry.get("market_ready", False)),
                })

            print(f"[BATCH INSIGHTS] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[BATCH INSIGHTS] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise GeminiInsightsError("All Gemini models failed to return a usable batch insights response.")
