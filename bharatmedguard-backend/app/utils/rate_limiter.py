import time
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from app.core.logging_config import security_logger

class InMemoryRateLimiter:
    def __init__(self, requests_limit: int = 60, time_window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.time_window = time_window_seconds
        self._clients: Dict[str, list] = {}

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        now = time.time()
        timestamps = self._clients.get(client_ip, [])
        # Filter timestamps within window
        valid_timestamps = [t for t in timestamps if now - t < self.time_window]
        
        if len(valid_timestamps) >= self.requests_limit:
            self._clients[client_ip] = valid_timestamps
            return False, self.requests_limit - len(valid_timestamps)

        valid_timestamps.append(now)
        self._clients[client_ip] = valid_timestamps
        return True, self.requests_limit - len(valid_timestamps)

# Global instances
global_rate_limiter = InMemoryRateLimiter(requests_limit=120, time_window_seconds=60)
auth_rate_limiter = InMemoryRateLimiter(requests_limit=15, time_window_seconds=60)

async def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    allowed, remaining = global_rate_limiter.is_allowed(client_ip)
    if not allowed:
        security_logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait before retrying."
        )

async def check_auth_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    allowed, remaining = auth_rate_limiter.is_allowed(client_ip)
    if not allowed:
        security_logger.warning(f"Authentication rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many authentication attempts. Please wait 1 minute before retrying."
        )
