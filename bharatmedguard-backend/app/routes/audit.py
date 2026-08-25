from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from app.core.database import get_audit_logs_col
from app.core.dependencies import get_current_user, require_roles
from app.models.user import UserInDB, UserRole

router = APIRouter(prefix="/audit-logs", tags=["Audit & Governance"])

@router.get("")
async def list_audit_logs(
    action: Optional[str] = Query(None),
    user: Optional[str] = Query(None),
    limit: int = Query(50, le=100)
):
    audit_col = get_audit_logs_col()
    query = {}
    if action:
        query["action"] = {"$regex": action, "$options": "i"}
    if user:
        query["user"] = {"$regex": user, "$options": "i"}

    cursor = audit_col.find(query).sort("timestamp", -1).limit(limit)
    items = await cursor.to_list(limit)
    return items

@router.get("/{id}")
async def get_audit_log(id: str):
    audit_col = get_audit_logs_col()
    item = await audit_col.find_one({"$or": [{"id": id}, {"log_id": id}, {"_id": id}]})
    if not item:
        raise HTTPException(status_code=404, detail=f"Audit record '{id}' not found")
    return item
