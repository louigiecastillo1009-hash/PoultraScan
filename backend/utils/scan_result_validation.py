"""Bind a batch response to explicit image IDs, never array position alone."""


def ordered_image_results(data, count):
    if not isinstance(data, list) or len(data) != count:
        raise ValueError("Incorrect result count")
    expected = [f"image_{i + 1}" for i in range(count)]
    if any(not isinstance(item, dict) for item in data):
        raise ValueError("Each image result must be an object")
    ids = [item.get("image_id") for item in data]
    if any(not isinstance(value, str) for value in ids) or set(ids) != set(expected):
        raise ValueError("Missing, duplicate or unknown image ID")
    by_id = {item["image_id"]: item for item in data}
    return [by_id[value] for value in expected]
