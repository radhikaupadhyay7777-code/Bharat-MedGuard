from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional, Union
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings
from app.core.logging_config import security_logger

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if isinstance(plain_password, str):
            plain_password_bytes = plain_password.encode('utf-8')
        else:
            plain_password_bytes = plain_password

        if isinstance(hashed_password, str):
            hashed_password_bytes = hashed_password.encode('utf-8')
        else:
            hashed_password_bytes = hashed_password

        return bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)
    except Exception as e:
        security_logger.error(f"Password verification error: {str(e)}")
        return False

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def create_access_token(
    subject: str,
    user_id: str,
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": subject,
        "user_id": user_id,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as e:
        security_logger.warning(f"JWT Token validation failed: {str(e)}")
        return None
