from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.core.security import decode_access_token
from app.core.database import get_users_col
from app.models.user import UserInDB, UserRole
from app.core.logging_config import security_logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[UserInDB]:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        if payload is None:
            return None
        user_id: Optional[str] = payload.get("user_id")
        if not user_id:
            return None
        users_col = get_users_col()
        user_dict = await users_col.find_one({"_id": user_id}) or await users_col.find_one({"email": payload.get("sub")})
        if not user_dict:
            return None
        return UserInDB(**user_dict)
    except Exception:
        return None

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
        
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: Optional[str] = payload.get("user_id")
    if user_id is None:
        raise credentials_exception

    users_col = get_users_col()
    user_dict = await users_col.find_one({"_id": user_id})
    if not user_dict:
        user_dict = await users_col.find_one({"email": payload.get("sub")})
        
    if not user_dict:
        raise credentials_exception

    user = UserInDB(**user_dict)
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return user

def require_roles(allowed_roles: List[UserRole]):
    def role_checker(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
        if current_user.role not in allowed_roles and current_user.role != UserRole.ADMIN:
            security_logger.warning(
                f"RBAC Violation: User '{current_user.email}' with role '{current_user.role}' "
                f"attempted to access restricted endpoint requiring {allowed_roles}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Your role '{current_user.role}' lacks sufficient RBAC privileges."
            )
        return current_user
    return role_checker
