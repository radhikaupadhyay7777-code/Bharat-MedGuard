from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.database import get_users_col
from app.models.user import UserInDB, UserRole
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.core.dependencies import get_current_user
from app.utils.rate_limiter import check_auth_rate_limit
from app.utils.audit_helper import log_audit_action
from app.core.logging_config import security_logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_role_permissions(role: UserRole):
    is_admin = role == UserRole.ADMIN
    is_inv = role in (UserRole.ADMIN, UserRole.INVESTIGATOR)
    is_doc = role in (UserRole.ADMIN, UserRole.DOCTOR, UserRole.INVESTIGATOR)
    
    return [
        {"name": "View Claims & Billing", "granted": True},
        {"name": "Investigate Anomaly Alerts", "granted": is_inv},
        {"name": "Execute OCR Forensic Verification", "granted": is_inv or is_doc},
        {"name": "Inspect Patient Identity Graph", "granted": is_inv},
        {"name": "View Immutable Audit Logs", "granted": is_inv},
        {"name": "Modify System Kernel / Core Settings", "granted": is_admin}
    ]

@router.post("/login", response_model=TokenResponse)
async def login(login_req: LoginRequest, request: Request, _=Depends(check_auth_rate_limit)):
    users_col = get_users_col()
    user_dict = await users_col.find_one({"email": login_req.email.lower()})

    client_ip = request.client.host if request.client else "127.0.0.1"

    if not user_dict or not verify_password(login_req.password, user_dict["password_hash"]):
        security_logger.warning(f"Failed login attempt for email: {login_req.email} from IP: {client_ip}")
        await log_audit_action(
            user_id=login_req.email,
            role="ANONYMOUS",
            action="LOGIN_FAILED",
            resource_type="AUTH",
            resource_id="SESSION",
            status="DENIED",
            ip_address=client_ip
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect official email or password"
        )

    user = UserInDB(**user_dict)
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    access_token = create_access_token(
        subject=user.email,
        user_id=user.id,
        role=user.role.value
    )

    await log_audit_action(
        user_id=user.email,
        role=user.role.value,
        action="LOGIN_SUCCESS",
        resource_type="AUTH",
        resource_id=user.id,
        status="SUCCESS",
        ip_address=client_ip
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        badge_id=user.badge_id,
        department=user.department,
        permissions=get_role_permissions(user.role)
    )

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, request: Request):
    users_col = get_users_col()
    existing = await users_col.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already registered")

    user_dict = {
        "email": user_in.email.lower(),
        "name": user_in.name,
        "password_hash": get_password_hash(user_in.password),
        "role": user_in.role.value,
        "badge_id": user_in.badge_id or f"BMG-SEC-{user_in.name[:3].upper()}",
        "department": user_in.department or "Healthcare Intelligence",
        "is_active": True,
        "created_at": "2026-08-25T10:00:00Z"
    }

    res = await users_col.insert_one(user_dict)
    user_dict["_id"] = str(res.inserted_id)

    client_ip = request.client.host if request.client else "127.0.0.1"
    await log_audit_action(
        user_id=user_in.email,
        role=user_in.role.value,
        action="REGISTER_USER",
        resource_type="USER",
        resource_id=user_dict["_id"],
        status="SUCCESS",
        ip_address=client_ip
    )

    return UserResponse(
        id=user_dict["_id"],
        email=user_dict["email"],
        name=user_dict["name"],
        role=user_in.role,
        badge_id=user_dict["badge_id"],
        department=user_dict["department"],
        is_active=user_dict["is_active"],
        created_at=user_dict["created_at"]
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        badge_id=current_user.badge_id,
        department=current_user.department,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )
