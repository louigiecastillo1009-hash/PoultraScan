"""
Weight-based market-readiness rules.

A photo can only estimate live weight. It cannot verify age, withdrawal
periods, or food safety, so readiness here means "the estimated weight
reaches the market target and no health issue was flagged". The UI must
keep showing it as an estimate.

One target is used for every chicken: about 1.5 kg, the minimum live weight
usually accepted for chickens raised to roughly 45 days. Actual market weight
varies by breed, sex, feed, and management.
"""

MARKET_TARGET_KG = 1.5
MARKET_TARGET_LABEL = "~45-day chicken"


def assess_market_readiness(weight_kg, healthy) -> dict:
    """
    healthy: True (no issue), False (flagged), or None (not clearly assessed).
    Only a confirmed health flag blocks readiness; an inconclusive health
    result does not by itself make a bird unready, but the label stays
    estimate-based.
    """
    target = MARKET_TARGET_KG

    if weight_kg is None:
        return {
            "market_target_kg": target,
            "market_ready": False,
            "market_ready_label": "Check weight",
            "market_ready_note": (
                f"Weight estimate unavailable. The market target is "
                f"at least {target:g} kg for {MARKET_TARGET_LABEL}s."
            ),
        }

    weight = float(weight_kg)

    if healthy is False:
        return {
            "market_target_kg": target,
            "market_ready": False,
            "market_ready_label": "Not ready",
            "market_ready_note": "A health issue was flagged in this scan.",
        }

    if weight >= target:
        return {
            "market_target_kg": target,
            "market_ready": True,
            "market_ready_label": "Market ready",
            "market_ready_note": (
                f"{weight:.2f} kg meets the {target:g} kg market target "
                f"for {MARKET_TARGET_LABEL}s."
            ),
        }

    return {
        "market_target_kg": target,
        "market_ready": False,
        "market_ready_label": "Not ready",
        "market_ready_note": (
            f"{weight:.2f} kg is below the {target:g} kg market target "
            f"for {MARKET_TARGET_LABEL}s."
        ),
    }
