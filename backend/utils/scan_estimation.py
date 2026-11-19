"""Shared instructions and validation for uncalibrated visual estimates."""

VISUAL_ESTIMATION_INSTRUCTIONS = """
Assess only the target chicken nearest the center of each crop. Ignore other
birds in the background; never describe a group as one chicken. If the target
cannot be distinguished, return null for its weight.
For a clearly visible target, provide your best APPROXIMATE visual weight
estimate in kg using its apparent maturity, body proportions, breast fullness
and body condition. This is an uncalibrated AI estimate, not a measurement.
A reference scale is not required for an approximate estimate. Do not infer
weight from pixel area, crop occupancy or camera distance, assume every bird
is a broiler, or assign every bird a standard weight. Return null if there is
insufficient visual evidence. Never invent a fallback value.
Report honest self-reported weight confidence, not a claimed accuracy rate.
Health alone does not establish market readiness. With no confirmed age,
target market weight or withdrawal-period information, return market_ready:
false. Do not claim a photo certifies food safety.
"""


def supported_market_ready(value, weight, disease):
    # No verified market criteria are supplied by the current scan flow.
    # Keep this false until those inputs are supported; a healthy label or
    # estimated weight alone cannot establish readiness.
    return False
