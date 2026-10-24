import os
import re
import json
import threading
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print(f"[GROQ DEBUG] GROQ_API_KEY loaded: {'YES (' + GROQ_API_KEY[:6] + '...)' if GROQ_API_KEY else 'NO — key is None/empty!'}")

# Groq Client (OpenAI-compatible, free tier)
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

# Groq decommissioned the llama-3.3/llama-3.1 models (404 model_not_found).
# These are the current models available on this key (verified live).
RECOMMENDATION_MODELS = [
    "openai/gpt-oss-120b",   # primary
    "openai/gpt-oss-20b",    # fallback if primary is unavailable
]

# The AI keeps sneaking unrelated advice into the answers (e.g. "regular
# exercise"). Recommendations are strictly: clean the place, clean water,
# proper feeding. Any sentence containing one of these keywords is dropped.
FORBIDDEN_KEYWORDS = (
    "exercise", "exercis",      # exercise/exercises/exercising...
    "medicine", "medicat",      # medicine/medication
    "drug", "vaccine", "inocul",
    "dosage", "dosing", "dose",
    "antibiotic", "deworm",
    "supplement", "inject",
    "veterinar", "vet ",
    "treatment", "treat ",      # but not "clean" ("treat the area" is dropped too — fine)
    "sunlight", "isolation", "quarantine", "ozone",
)

DEFAULT_HYGIENE_RECOMMENDATION = (
    "Keep the coop and the surrounding area clean and dry, provide clean "
    "fresh drinking water, and feed the chicken properly."
)
DEFAULT_HYGIENE_PREVENTION_TIPS = (
    "Clean the coop regularly, replace drinking water with clean fresh "
    "water every day, and provide the right amount of good-quality feed."
)


def _hygiene_only(text: str) -> str:
    """
    Strips any sentence that goes beyond the allowed topics (cleaning,
    water, feeding). Used as a safety net in case the model ignores the
    prompt rules — e.g. the "chickens need regular exercise" slip.
    """
    if not text or not isinstance(text, str):
        return ""

    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    kept = [
        s for s in sentences
        if not any(keyword in s.lower() for keyword in FORBIDDEN_KEYWORDS)
    ]
    return " ".join(kept).strip()

# v2: bumped so cached answers generated before the hygiene-only filter
# (which contained off-topic text like "regular exercise") are never served.
CACHE_FILE = os.path.join("static", "cache", "hygiene_recommendations_v2.json")
os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

_cache_lock = threading.Lock()

FALLBACK_RECOMMENDATION = (
    "AI-generated recommendations are temporarily unavailable. "
    "Meanwhile, keep the coop and surroundings clean and dry, provide "
    "clean fresh drinking water, and make sure the chickens are fed "
    "properly."
)
FALLBACK_PREVENTION_TIPS = (
    "Clean the coop regularly, replace drinking water with clean fresh "
    "water every day, and provide the right amount of good-quality feed "
    "to keep the flock healthy."
)


class RecommendationError(Exception):
    pass


def _load_cache() -> dict:
    if not os.path.exists(CACHE_FILE):
        return {}

    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def _save_cache(cache: dict):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2)
    except OSError as e:
        print(f"[CACHE WARNING] Failed to write recommendation cache: {e}")


def get_disease_recommendation(disease_name: str, confidence_score: float) -> dict:
    """
    Uses Groq (free tier, Llama models) to generate poultry health
    recommendations.

    Returns:
    {
        "breed": "...",
        "recommendation": "...",
        "prevention_tips": "...",
        "severity": "LOW|MEDIUM|HIGH|NONE"
    }

    Results are cached per disease to avoid repeated API calls. If the
    Groq API call fails for any reason, returns a graceful fallback dict
    instead of raising — this fallback is NOT cached, so the next scan
    will retry the real API.
    """

    cache_key = disease_name.strip().upper()

    print(f"[GROQ DEBUG] get_disease_recommendation called for disease='{cache_key}', confidence={confidence_score}")

    with _cache_lock:
        cache = _load_cache()

        if cache_key in cache:
            print(f"[RECOMMENDATION CACHE] Hit for '{cache_key}' — skipping Groq API.")
            return cache[cache_key]

    if cache_key == "HEALTHY":
        prompt = f"""
A chicken was classified as HEALTHY.

Return ONLY valid JSON with these exact keys:

{{
    "breed": "",
    "recommendation": "",
    "prevention_tips": "",
    "severity": "NONE"
}}

Rules:
- recommendation: 2-3 sentences of simple hygiene guidance ONLY about
  these three things: (1) cleaning the coop/pen and surrounding area,
  (2) clean fresh drinking water, (3) proper, balanced feeding.
  Do NOT mention medicines, drugs, treatments, veterinarians,
  exercise, sunlight, or anything else outside those three things.
- prevention_tips: 2-3 sentences about a regular cleaning routine,
  replacing water with clean fresh water daily, and feeding the right
  amount of good-quality feed to keep the flock healthy.
- breed: Best guess or "Unknown".
- No markdown.
- No code fences.
- JSON only.
"""
    else:
        prompt = f"""
A chicken was flagged by the scanner as possibly showing signs of
{disease_name} with {confidence_score}% confidence.

IMPORTANT: Do NOT give any medical advice. Never mention medicines,
drugs, dosages, vaccines, injections, supplements-as-treatment, or
veterinary care. This app only gives general hygiene and care guidance.

Return ONLY valid JSON:

{{
    "breed": "",
    "recommendation": "",
    "prevention_tips": "",
    "severity": ""
}}

Rules:
- recommendation:
    2-3 sentences of hygiene and care steps ONLY about these three things:
    (1) clean the coop/pen and surrounding area thoroughly and keep it dry,
    (2) replace drinking water with clean fresh water,
    (3) remove leftover or wet feed and provide proper balanced feeding.
    Never write about medicines, exercise, sunlight, housing redesign,
    isolation, or any other topic.

- prevention_tips:
    2-3 sentences about a regular cleaning routine for the place,
    always providing clean drinking water, and feeding the correct
    amount and quality of feed.

- severity:
    Must be exactly one of:
    LOW
    MEDIUM
    HIGH

- breed:
    Best guess or "Unknown".

Return JSON ONLY.
"""

    try:
        print("[GROQ DEBUG] Sending request to Groq API...")

        response = None
        for model_name in RECOMMENDATION_MODELS:
            # gpt-oss sometimes refuses strict JSON mode — try it first,
            # then retry the same model WITHOUT json_object response_format
            # and parse leniently instead.
            for json_mode in (True, False):
                try:
                    kwargs = dict(
                        model=model_name,
                        messages=[
                            {
                                "role": "system",
                                "content": (
                                    "You are a poultry farm hygiene and husbandry "
                                    "assistant. You only give guidance about keeping the "
                                    "place clean, providing clean fresh drinking water, "
                                    "and proper feeding. Never suggest medicines, drugs, "
                                    "dosages, veterinary treatments, exercise, or any "
                                    "topic other than cleaning, water, and feeding. "
                                    "Always return valid JSON only."
                                ),
                            },
                            {
                                "role": "user",
                                "content": prompt,
                            },
                        ],
                        temperature=0.4,
                        max_tokens=1000,
                    )
                    if json_mode:
                        kwargs["response_format"] = {"type": "json_object"}
                    response = client.chat.completions.create(**kwargs)
                    break
                except Exception as e:
                    print(f"[GROQ DEBUG] Model '{model_name}' (json_mode={json_mode}) failed: {str(e)[:100]}. Retrying...")
                    continue
            if response is not None:
                break

        if response is None:
            raise RuntimeError("All Groq recommendation models failed.")

        print("[GROQ DEBUG] Raw API response object received.")

        raw_content = response.choices[0].message.content.strip()

        print(f"[GROQ DEBUG] Raw content from Groq: {raw_content}")

        try:
            parsed = json.loads(raw_content)
        except json.JSONDecodeError:
            # Lenient fallback: pull the first {...} block out of the text.
            match = re.search(r"\{.*\}", raw_content, re.DOTALL)
            if not match:
                raise
            parsed = json.loads(match.group(0))

        print(f"[GROQ DEBUG] Parsed JSON: {parsed}")

        result = {
            "breed": parsed.get("breed", "Unknown"),
            "recommendation": _hygiene_only(parsed.get("recommendation", "")) or DEFAULT_HYGIENE_RECOMMENDATION,
            "prevention_tips": _hygiene_only(parsed.get("prevention_tips", "")) or DEFAULT_HYGIENE_PREVENTION_TIPS,
            "severity": parsed.get("severity", "UNKNOWN"),
        }

        with _cache_lock:
            cache = _load_cache()
            cache[cache_key] = result
            _save_cache(cache)

        print(f"[RECOMMENDATION CACHE] Stored '{cache_key}'.")

        return result

    except json.JSONDecodeError as e:
        print(f"[GROQ DEBUG] JSONDecodeError: {e}")
        return {
            "breed": "Unknown",
            "recommendation": FALLBACK_RECOMMENDATION,
            "prevention_tips": FALLBACK_PREVENTION_TIPS,
            "severity": "UNKNOWN",
        }

    except Exception as e:
        print(f"[GROQ DEBUG] Exception type: {type(e).__name__}")
        print(f"[GROQ DEBUG] Exception details: {e}")
        return {
            "breed": "Unknown",
            "recommendation": FALLBACK_RECOMMENDATION,
            "prevention_tips": FALLBACK_PREVENTION_TIPS,
            "severity": "UNKNOWN",
        }