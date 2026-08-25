import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.network.scapy_monitor import scapy_monitor
from app.core.database import get_security_events_col
from app.utils.audit_helper import log_audit_action

class SecurityService:
    @staticmethod
    def get_live_packets(limit: int = 20) -> List[Dict[str, Any]]:
        return scapy_monitor.get_recent_events(limit)

    @staticmethod
    def get_security_alerts() -> List[Dict[str, Any]]:
        return [
            {
                "id": "ALT-2026-091",
                "alert_id": "ALT-2026-091",
                "title": "Potential Bulk Health Record Exfiltration Attempt",
                "severity": "CRITICAL",
                "source": "192.168.4.19 (Varanasi Node)",
                "timestamp": "10 minutes ago",
                "status": "ACTIVE_INVESTIGATION",
                "details": "Unusually high number of ABHA query calls (450 requests/min) from an unverified hospital subnet."
            },
            {
                "id": "ALT-2026-092",
                "alert_id": "ALT-2026-092",
                "title": "Abnormal Authentication Velocity & Token Replay",
                "severity": "HIGH",
                "source": "Auth Gateway / OAuth 2.0",
                "timestamp": "24 minutes ago",
                "status": "MITIGATED",
                "details": "Investigator token 'investigator_102' refreshed from two geographic locations within 12 seconds."
            },
            {
                "id": "ALT-2026-093",
                "alert_id": "ALT-2026-093",
                "title": "DICOM PACS Port Scanning Detected",
                "severity": "MEDIUM",
                "source": "10.14.99.120 (Internal LAN)",
                "timestamp": "1 hour ago",
                "status": "ACKNOWLEDGED",
                "details": "Port probe on 11112 and 8080 targeting radiology storage server."
            },
            {
                "id": "ALT-2026-094",
                "alert_id": "ALT-2026-094",
                "title": "Scheduled Daily Key Rotation & Certificate Validation",
                "severity": "LOW",
                "source": "KMS Cryptographic Vault",
                "timestamp": "3 hours ago",
                "status": "RESOLVED",
                "details": "RSA-4096 and ECDSA signing keys successfully refreshed."
            }
        ]

    @staticmethod
    async def triage_alert(alert_id: str, action: str, user_id: str, user_role: str) -> Dict[str, Any]:
        await log_audit_action(
            user_id=user_id,
            role=user_role,
            action=f"TRIAGE_SECURITY_ALERT_{action.upper()}",
            resource_type="SECURITY_ALERT",
            resource_id=alert_id,
            status="SUCCESS"
        )
        return {
            "alert_id": alert_id,
            "action_applied": action,
            "status": "CONTAINED_BLOCKED" if action == "CONTAIN" else "RESOLVED",
            "triaged_by": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
        }

security_service = SecurityService()
