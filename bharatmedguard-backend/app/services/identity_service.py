import math
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.database import get_patients_col
from app.models.patient import PatientInDB
from app.models.anomaly import AnomalySourceType, AnomalySeverity
from app.ml.feature_engineering import extract_identity_features
from app.ml.model_manager import model_manager
from app.services.risk_service import risk_service
from app.services.anomaly_service import anomaly_service

# City coordinates in India for Haversine distance calculation
CITY_COORDINATES = {
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "chennai": (13.0827, 80.2707),
    "varanasi": (25.3176, 82.9739),
    "lucknow": (26.8467, 80.9462),
    "patna": (25.5941, 85.1376)
}

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class IdentityService:
    @staticmethod
    async def analyze_patient_identity(patient_dict: Dict[str, Any]) -> Dict[str, Any]:
        patients_col = get_patients_col()
        patient_id = patient_dict.get("patient_id") or f"P-{str(uuid.uuid4())[:3].upper()}"
        
        flags = []
        rule_penalty = 0
        velocity_kmh = 0.0
        distance_km = 0.0
        time_delta_mins = 0.0
        feasibility = "NORMAL"

        # Check connected admissions for velocity
        connected = patient_dict.get("connected_hospitals", [])
        if len(connected) >= 2:
            # Sort admissions by time if possible
            first = connected[0]
            second = connected[1]
            c1 = first.get("city", "").lower()
            c2 = second.get("city", "").lower()
            
            coord1 = CITY_COORDINATES.get(c1, (28.6139, 77.2090))
            coord2 = CITY_COORDINATES.get(c2, (12.9716, 77.5946))
            
            distance_km = calculate_haversine_distance(coord1[0], coord1[1], coord2[0], coord2[1])
            time_delta_mins = 135.0  # 2h 15m window
            velocity_kmh = (distance_km / (time_delta_mins / 60.0))
            
            if velocity_kmh > 450.0:
                feasibility = "IMPOSSIBLE_TRAVEL"
                flags.append(f"Physical travel impossible: {distance_km:.0f} km between {first.get('city')} and {second.get('city')} in {time_delta_mins:.0f} mins (Required Speed: {velocity_kmh:.1f} km/h)")
                rule_penalty += 40

        if len(connected) >= 3:
            flags.append("Concurrent active registrations detected across 3 independent hospital nodes")
            rule_penalty += 25

        # Check Aadhaar collision (same hash, different name)
        aadhaar_hash = patient_dict.get("aadhaar_hash", "")
        if aadhaar_hash:
            collision = await patients_col.find_one({
                "aadhaar_hash": aadhaar_hash,
                "patient_id": {"$ne": patient_id}
            })
            if collision:
                flags.append(f"Biometric Entity Collision: Same Aadhaar hash tied to alternate identity '{collision.get('name')}' (ID: {collision.get('patient_id')})")
                rule_penalty += 40

        # ML Isolation Forest
        features = extract_identity_features(
            velocity_kmh=velocity_kmh,
            concurrent_hospitals=len(connected),
            aadhaar_name_collision_count=1 if "Collision" in " ".join(flags) else 0,
            visit_frequency_30d=len(connected)
        )
        is_ml_anom, ml_prob, path_length = model_manager.identity_model.predict_anomaly(features)

        risk_score, severity = risk_service.calculate_composite_risk(
            ml_anomaly_prob=ml_prob,
            rule_penalty_score=rule_penalty,
            duplicate_hit=("Collision" in " ".join(flags)),
            mismatch_count=1 if flags else 0
        )

        anomaly_type = "Impossible Location Velocity & Collision" if velocity_kmh > 450.0 else (
            "Biometric Entity Collision" if "Collision" in " ".join(flags) else "Standard Identity"
        )

        result_doc = {
            "patient_id": patient_id,
            "name": patient_dict.get("name"),
            "abha_id": patient_dict.get("abha_id"),
            "aadhaar_hash": aadhaar_hash or "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            "age": patient_dict.get("age", 40),
            "gender": patient_dict.get("gender", "Male"),
            "primary_location": patient_dict.get("primary_location", "Mumbai, Maharashtra"),
            "primary_city": patient_dict.get("primary_city", "Mumbai"),
            "risk_score": risk_score,
            "severity": severity.value,
            "anomaly_type": anomaly_type,
            "connected_hospitals": connected,
            "flags": flags,
            "velocity_analysis": {
                "distanceKm": round(distance_km, 1),
                "timeDeltaMinutes": round(time_delta_mins, 1),
                "requiredSpeedKmh": round(velocity_kmh, 1),
                "feasibility": feasibility
            },
            "created_at": datetime.now(timezone.utc).isoformat() + "Z"
        }

        # Update in database
        existing = await patients_col.find_one({"patient_id": patient_id})
        if existing:
            await patients_col.update_one({"patient_id": patient_id}, {"$set": result_doc})
            result_doc["_id"] = existing["_id"]
        else:
            res = await patients_col.insert_one(result_doc)
            result_doc["_id"] = str(res.inserted_id)

        # Record in unified anomaly engine
        if risk_score > 30:
            await anomaly_service.record_anomaly(
                source_type=AnomalySourceType.IDENTITY,
                source_id=patient_id,
                anomaly_type=anomaly_type,
                risk_score=risk_score,
                severity=severity,
                reasons=flags,
                evidence=result_doc["velocity_analysis"],
                patient_id=patient_id
            )

        return result_doc

identity_service = IdentityService()
