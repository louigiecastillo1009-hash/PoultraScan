"""Shared instructions and validation for uncalibrated visual estimates."""

VISUAL_ESTIMATION_INSTRUCTIONS = """
Assess only the target chicken nearest the center of each crop. Ignore other
birds in the background; never describe a group as one chicken.
For a clearly visible target, ALWAYS provide your best APPROXIMATE visual weight
estimate in kg using its apparent maturity, body proportions, breast fullness
and body condition. A reference scale is not required for an approximate
estimate. Do not infer weight from pixel area, crop occupancy or camera
distance, assume every bird is a broiler, or assign every bird a standard
weight. Only return null when the target is not identifiable or the image is
unusable. Never invent a fallback value.
Report honest self-reported weight confidence, not a claimed accuracy rate.
Do not diagnose disease and do not recommend medicine or treatment.
"""


def supported_market_ready(value, weight, disease):
    # No verified market criteria are supplied by the current scan flow.
    # Keep this false until those inputs are supported; a healthy label or
    # estimated weight alone cannot establish readiness.
    return False
