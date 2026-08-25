from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    name: str
    role: UserRole
    badge_id: Optional[str] = None
    department: Optional[str] = None
    permissions: List[dict] = []

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.INVESTIGATOR
    badge_id: Optional[str] = None
    department: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: UserRole
    badge_id: Optional[str] = None
    department: Optional[str] = None
    is_active: bool
    created_at: str
