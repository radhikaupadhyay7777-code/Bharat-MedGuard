import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from app.core.database import get_audit_logs_col
from app.core.logging_config import audit_logger

async def log_audit_action(
    user_id: str,
    role: str,
    action: str,
    resource_type: str,
    resource_id: str,
    status: str = "SUCCESS",
    ip_address: str = "127.0.0.1",
    details: Optional[Dict[str, Any]] = None
):
    audit_col = get_audit_logs_col()
    log_id = f"AUD-{datetime.now(timezone.utc).year}-{str(uuid.uuid4())[:6].upper()}"
    
    audit_entry = {
        "id": log_id,
        "log_id": log_id,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
        "user": user_id,
        "role": role,
        "action": action,
        "resource": f"{resource_type} {resource_id}",
        "resource_type": resource_type,
        "resource_id": resource_id,
        "ip": ip_address,
        "status": status,
        "created_at": datetime.now(timezone.utc).isoformat() + "Z"
    }

    try:
        await audit_col.insert_one(audit_entry)
        audit_logger.info(f"AUDIT: [{status}] {role} ({user_id}) performed {action} on {resource_type}:{resource_id}")
    except Exception as e:
        audit_logger.error(f"Failed to record audit log: {str(e)}")

    return audit_entry
