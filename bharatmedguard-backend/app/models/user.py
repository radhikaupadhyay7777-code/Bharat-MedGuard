from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime, timezone

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    INVESTIGATOR = "INVESTIGATOR"
    DOCTOR = "DOCTOR"
    HOSPITAL = "HOSPITAL"
    INSURER = "INSURER"

class UserInDB(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    name: str
    password_hash: str
    role: UserRole
    badge_id: Optional[str] = None
    department: Optional[str] = None
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")
    last_login: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)
