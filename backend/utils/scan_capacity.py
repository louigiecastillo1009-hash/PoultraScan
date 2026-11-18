"""Small process-local admission gate for synchronous scans on Render free.

This is not a persistent worker queue. A durable queue is a separate phase.
"""
from contextlib import contextmanager
from threading import BoundedSemaphore

from fastapi import HTTPException

_capacity = BoundedSemaphore(1)


@contextmanager
def scan_capacity():
    if not _capacity.acquire(blocking=False):
        raise HTTPException(429, "Scanner is busy. Please try again shortly.", headers={"Retry-After": "15"})
    try:
        yield
    finally:
        _capacity.release()
