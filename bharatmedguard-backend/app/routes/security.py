from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.security_service import security_service
from app.schemas.security import SecurityEventResponse, SecurityAlertResponse
from app.core.dependencies import get_optional_current_user
from app.models.user import UserInDB

router = APIRouter(prefix="/security", tags=["Cyber Defence & Security"])

@router.get("/events")
async def get_security_events():
    packets = security_service.get_live_packets(limit=20)
    alerts = security_service.get_security_alerts()
    return {
        "packets": packets,
        "alerts": alerts,
        "active_sessions": 142,
        "threats_blocked": 149
    }

@router.get("/alerts", response_model=List[SecurityAlertResponse])
async def get_security_alerts():
    alerts = security_service.get_security_alerts()
    return [
        SecurityAlertResponse(
            id=a["id"],
            alert_id=a["alert_id"],
            title=a["title"],
            severity=a["severity"],
            source=a["source"],
            timestamp=a["timestamp"],
            status=a["status"],
            details=a["details"]
        )
        for a in alerts
    ]

@router.post("/alerts/{alert_id}/triage")
async def triage_alert_endpoint(
    alert_id: str,
    action: str = Query("CONTAIN", enum=["CONTAIN", "RESOLVE"]),
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    user_id = current_user.email if current_user else "investigator_102"
    role = current_user.role.value if current_user else "INVESTIGATOR"
    res = await security_service.triage_alert(alert_id, action, user_id, role)
    return res
