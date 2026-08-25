import numpy as np
import pandas as pd
from typing import Dict, Any, List

def extract_claim_features(
    claim_dict: Dict[str, Any],
    hospital_avg_claim: float = 100000.0,
    patient_prior_claims_count: int = 1,
    duplicate_count: int = 0,
    doc_mismatch_score: float = 0.0
) -> np.ndarray:
    amount = float(claim_dict.get("claimed_amount", 100000.0))
    benchmark = float(claim_dict.get("benchmark_amount", 100000.0)) or 100000.0
    
    amount_ratio = amount / max(benchmark, 1.0)
    hospital_ratio = amount / max(hospital_avg_claim, 1.0)
    
    features = [
        amount / 100000.0,            # Normalized claim amount
        amount_ratio,                 # Ratio vs benchmark
        hospital_ratio,               # Ratio vs hospital avg
        float(patient_prior_claims_count),  # Claim frequency
        float(duplicate_count),       # Duplicate hash hits
        float(doc_mismatch_score)     # OCR document mismatch
    ]
    return np.array(features, dtype=np.float32).reshape(1, -1)

def extract_identity_features(
    velocity_kmh: float = 0.0,
    concurrent_hospitals: int = 1,
    aadhaar_name_collision_count: int = 0,
    visit_frequency_30d: int = 1
) -> np.ndarray:
    features = [
        min(velocity_kmh / 500.0, 5.0), # Normalized velocity
        float(concurrent_hospitals),    # Simultaneous facilities
        float(aadhaar_name_collision_count), # Biometric collisions
        float(visit_frequency_30d) / 10.0   # Visit rate
    ]
    return np.array(features, dtype=np.float32).reshape(1, -1)

def extract_document_features(
    mismatches_count: int = 0,
    amount_delta_ratio: float = 1.0,
    ocr_confidence: float = 0.98
) -> np.ndarray:
    features = [
        float(mismatches_count),
        amount_delta_ratio,
        1.0 - ocr_confidence
    ]
    return np.array(features, dtype=np.float32).reshape(1, -1)
