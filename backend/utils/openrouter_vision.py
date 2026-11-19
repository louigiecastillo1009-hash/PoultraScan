"""
OpenRouter fallback for chicken disease classification and weight/oil
insight estimation, used only when the Gemini free-tier batch calls
(classify_diseases_batch_with_gemini / get_disease_insights_batch) are
exhausted across all free Gemini models.

Mirrors the exact input/output shape of the Gemini batch functions so
they are drop-in swappable from ai_prediction_service.py.

NOTE: Free vision-capable model availability on OpenRouter changes over
time. Verify the models below are still free/available at
https://openrouter.ai/models (filter Price: Free, Capability: Vision)
periodically.
"""

import os
import json
import base64
from dotenv import load_dotenv
from openai import OpenAI
from utils.scan_result_validation import ordered_image_results
from utils.scan_estimation import VISUAL_ESTIMATION_INSTRUCTIONS, supported_market_ready

from utils.gemini_disease_classifier import (
    DISEASE_PROMPT,
    DEFAULT_IMAGE_QUALITY_MESSAGE,
    _apply_healthy_confidence_floor,
    _sanitize_confidence,
    _sanitize_disease_name,
    _parse_framing,
    _cannot_assess_result,
)
from utils.gemini_client import _sanitize_weight, _sanitize_weight_confidence, _compute_oil_ml

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Cap how long a response can get so a chatty model can't burn tokens
# (a full multi-chicken JSON batch is well under this).
MAX_OUTPUT_TOKENS = int(os.getenv("AI_MAX_OUTPUT_TOKENS", "4096") or "4096")

client = OpenAI(
    api_key=OPENROUTER_API_KEY or "not-configured",
    base_url="https://openrouter.ai/api/v1",
    timeout=30.0,
    max_retries=0,
)

# Free-tier vision-capable models on OpenRouter, tried in order.
#
# IMPORTANT — verified against OpenRouter's live model list on 2026-11-18
# (the previous chain contained two delisted models that failed on every
# fallback attempt). Free-model limits per OpenRouter docs: 20 requests/
# minute; 50/day without purchased credits, 1000/day once >=10 credits
# have been purchased (all-time). Override with
# OPENROUTER_VISION_MODELS="model-a:free,model-b:free" in the environment.
DEFAULT_OPENROUTER_VISION_MODELS = [
    "google/gemma-4-31b-it:free",
    "inclusionai/ling-3.2-flash:free",
]

_openrouter_models_env = os.getenv("OPENROUTER_VISION_MODELS", "").strip()
OPENROUTER_VISION_MODELS = (
    [m.strip() for m in _openrouter_models_env.split(",") if m.strip()]
    if _openrouter_models_env
    else DEFAULT_OPENROUTER_VISION_MODELS
)
if any(not model.endswith(":free") for model in OPENROUTER_VISION_MODELS):
    raise ValueError("OPENROUTER_VISION_MODELS must contain explicit :free model IDs only")


class OpenRouterVisionError(Exception):
    """Raised when every model in OPENROUTER_VISION_MODELS fails to
    return a usable response for a batch vision call."""
    pass


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "image/jpeg"


def _image_to_data_url(image_bytes: bytes) -> str:
    mime_type = _detect_mime_type(image_bytes)
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{b64}"


def _extract_json_array(raw_text: str):
    raw_text = (raw_text or "").strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()
    return json.loads(raw_text)


def classify_diseases_batch_openrouter(crop_images: list[bytes]) -> list[dict]:
    """
    OpenRouter fallback for classify_diseases_batch_with_gemini().
    Same input/output shape -- drop-in swappable.

    Returns a list of dicts: disease_name, confidence_score, reasoning,
    model_used -- one per image, same order as crop_images.

    Raises OpenRouterVisionError if every model in
    OPENROUTER_VISION_MODELS fails to return a usable batch response.
    """
    if not OPENROUTER_API_KEY:
        raise OpenRouterVisionError("OPENROUTER_API_KEY is not set.")

    batch_prompt = f"""
{DISEASE_PROMPT}

You are given {len(crop_images)} separate chicken images, in order, labeled
image_1 through image_{len(crop_images)}. Analyze EACH one independently
using the exact same rules above.

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(crop_images)} objects in the same order as the images, each
following the single-chicken JSON format described above.
Also include "image_id": "image_1" (or the corresponding image ID) in EACH object.
"""

    content = [{"type": "text", "text": batch_prompt}]
    for index, img_bytes in enumerate(crop_images, start=1):
        content.append({"type": "text", "text": f"image_{index}"})
        content.append({
            "type": "image_url",
            "image_url": {"url": _image_to_data_url(img_bytes)}
        })

    for model_name in OPENROUTER_VISION_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": content}],
                temperature=0.4,
                max_tokens=MAX_OUTPUT_TOKENS,
            )

            raw_text = response.choices[0].message.content
            data = _extract_json_array(raw_text)

            if response.usage:
                print(
                    f"[OPENROUTER BATCH DISEASE] '{model_name}' usage: "
                    f"prompt={response.usage.prompt_tokens} completion={response.usage.completion_tokens}"
                )

            if not isinstance(data, list) or len(data) != len(crop_images):
                print(f"[OPENROUTER BATCH DISEASE] '{model_name}' returned malformed/mismatched array length. Trying next model...")
                continue

            data = ordered_image_results(data, len(crop_images))
            results = []
            for item in data:
                framing, framing_note = _parse_framing(item)
                if framing != "OK":
                    print(f"[OPENROUTER BATCH DISEASE] Framing issue ({framing}) — marking CANNOT_ASSESS.")
                    results.append(_cannot_assess_result(framing, framing_note, f"openrouter:{model_name}"))
                    continue

                chicken_visible = item.get("chicken_visible", True)
                is_blurry = item.get("is_blurry", False)

                if not chicken_visible or is_blurry:
                    results.append({
                        "disease_name": "UNKNOWN",
                        "confidence_score": 0.0,
                        "reasoning": item.get("quality_note", "").strip() or DEFAULT_IMAGE_QUALITY_MESSAGE,
                        "framing": "OK",
                        "model_used": f"openrouter:{model_name}",
                    })
                    continue

                disease_name = _sanitize_disease_name(item.get("disease", ""))
                confidence_score = round(_sanitize_confidence(item.get("confidence", 0)), 2)

                results.append({
                    "disease_name": disease_name,
                    "confidence_score": _apply_healthy_confidence_floor(disease_name, confidence_score),
                    "reasoning": item.get("reasoning", ""),
                    "framing": "OK",
                    "model_used": f"openrouter:{model_name}",
                })

            print(f"[OPENROUTER BATCH DISEASE] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[OPENROUTER BATCH DISEASE] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise OpenRouterVisionError("All OpenRouter vision models failed to return a usable batch classification.")


def get_disease_insights_batch_openrouter(items: list[dict]) -> list[dict]:
    """
    OpenRouter fallback for get_disease_insights_batch().
    Same input/output shape -- drop-in swappable.

    items: list of {"disease": str, "confidence": float, "image_bytes": bytes},
    one per chicken, in order.

    Returns a list of dicts: tips, estimated_weight, estimated_oil_ml,
    market_ready -- one per item, same order as items.

    Raises OpenRouterVisionError if every model in
    OPENROUTER_VISION_MODELS fails to return a usable batch response.
    """
    if not OPENROUTER_API_KEY:
        raise OpenRouterVisionError("OPENROUTER_API_KEY is not set.")

    disease_list_str = "\n".join(
        f"- image_{i+1}: disease={item['disease']}, confidence={item['confidence']}%"
        for i, item in enumerate(items)
    )

    prompt_text = f"""
You are a poultry photo analyst for a chicken farm monitoring app.

You are given {len(items)} separate chicken images, in order, labeled
image_1 through image_{len(items)}. Each has already been classified by
a separate AI model as follows:

{disease_list_str}

{VISUAL_ESTIMATION_INSTRUCTIONS}

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(items)} objects in the same order as the images, each in
this exact format:
{{
  "image_id": "image_1",
  "tips": "1-2 sentences describing ONLY the visible body condition that supports the weight estimate. Do NOT name a disease, diagnose, or recommend medicine or treatment.",
  "estimated_weight": <number in kg, your best approximate visual estimate>,
  "weight_confidence": <integer 0-100, how confident you are in that weight estimate given the bird's visibility and framing in that image>
}}
Use the actual image ID (image_1, image_2, etc.) for each result.

Note: oil yield is NOT requested here — the app computes it from each
estimated_weight using its own formula, so do not invent an oil number.
Market readiness is computed by the app from the selected chicken type
and weight; do not return it.
"""

    content = [{"type": "text", "text": prompt_text}]
    for index, item in enumerate(items, start=1):
        content.append({"type": "text", "text": f"image_{index}"})
        content.append({
            "type": "image_url",
            "image_url": {"url": _image_to_data_url(item["image_bytes"])}
        })

    for model_name in OPENROUTER_VISION_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": content}],
                temperature=0.4,
                max_tokens=MAX_OUTPUT_TOKENS,
            )

            raw_text = response.choices[0].message.content
            data = _extract_json_array(raw_text)

            if response.usage:
                print(
                    f"[OPENROUTER BATCH INSIGHTS] '{model_name}' usage: "
                    f"prompt={response.usage.prompt_tokens} completion={response.usage.completion_tokens}"
                )

            if not isinstance(data, list) or len(data) != len(items):
                print(f"[OPENROUTER BATCH INSIGHTS] '{model_name}' returned malformed/mismatched array length. Trying next model...")
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
                    "market_ready": supported_market_ready(entry.get("market_ready"), weight, None),
                })

            print(f"[OPENROUTER BATCH INSIGHTS] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[OPENROUTER BATCH INSIGHTS] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise OpenRouterVisionError("All OpenRouter vision models failed to return a usable batch insights response.")
