"""
Weight-based market-readiness rules.

A photo can only estimate live weight. It cannot verify age, withdrawal
periods, or food safety, so readiness here means "the estimated weight
reaches the typical market target for the selected chicken type and no
health issue was flagged". The UI must keep showing it as an estimate.

Typical live market weights (public poultry references):
- Broiler / meat chicken: ~1.8-2.3 kg at 6-8 weeks. A conservative
  lower target of 1.8 kg is used.
- Native / local chicken: commonly ~1.2-2.2 kg at 5-6 months, varying
  by breed and sex. A conservative lower target of 1.2 kg is used.
"""

CHICKEN_TYPE_BROILER = "BROILER"
CHICKEN_TYPE_NATIVE = "NATIVE"
DEFAULT_CHICKEN_TYPE = CHICKEN_TYPE_BROILER

MARKET_CRITERIA = {
    CHICKEN_TYPE_BROILER: {
        "label": "Broiler",
        "min_weight_kg": 1.8,
        "typical_range": "1.8-2.3 kg",
        "typical_age": "6-8 weeks",
    },
    CHICKEN_TYPE_NATIVE: {
        "label": "Native / local",
        "min_weight_kg": 1.2,
        "typical_range": "1.2-2.2 kg",
        "typical_age": "5-6 months",
    },
}


def normalize_chicken_type(value) -> str:
    """Returns a known chicken type, defaulting to broiler."""
    cleaned = str(value or "").strip().upper()
    return cleaned if cleaned in MARKET_CRITERIA else DEFAULT_CHICKEN_TYPE


def criteria_for(chicken_type) -> dict:
    return MARKET_CRITERIA[normalize_chicken_type(chicken_type)]


def assess_market_readiness(chicken_type, weight_kg, healthy) -> dict:
    """
    healthy: True (no issue), False (flagged), or None (not clearly assessed).
    Only a confirmed health flag blocks readiness; an inconclusive health
    result does not by itself make a bird unready, but the label stays
    estimate-based.
    """
    kind = normalize_chicken_type(chicken_type)
    criteria = MARKET_CRITERIA[kind]
    target = criteria["min_weight_kg"]

    if weight_kg is None:
        return {
            "chicken_type": kind,
            "market_target_kg": target,
            "market_ready": False,
            "market_ready_label": "Check weight",
            "market_ready_note": (
                f"Weight estimate unavailable. {criteria['label']} target is "
                f"at least {target:g} kg ({criteria['typical_range']})."
            ),
        }

    weight = float(weight_kg)

    if healthy is False:
        return {
            "chicken_type": kind,
            "market_target_kg": target,
            "market_ready": False,
            "market_ready_label": "Not ready",
            "market_ready_note": "A health issue was flagged in this scan.",
        }

    if weight >= target:
        return {
            "chicken_type": kind,
            "market_target_kg": target,
            "market_ready": True,
            "market_ready_label": "Market ready",
            "market_ready_note": (
                f"{weight:.2f} kg meets the {target:g} kg "
                f"{criteria['label'].lower()} target."
            ),
        }

    return {
        "chicken_type": kind,
        "market_target_kg": target,
        "market_ready": False,
        "market_ready_label": "Not ready",
        "market_ready_note": (
            f"{weight:.2f} kg is below the {target:g} kg "
            f"{criteria['label'].lower()} target."
        ),
    }
