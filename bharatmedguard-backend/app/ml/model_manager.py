import os
import joblib
import numpy as np
from typing import Dict, Any, List
from app.ml.isolation_forest import BMGIsolationForest
from app.core.config import settings
from app.core.logging_config import ml_logger

class ModelManager:
    def __init__(self):
        self.claim_model = BMGIsolationForest(contamination=settings.DEFAULT_CONTAMINATION, n_estimators=settings.DEFAULT_ESTIMATORS)
        self.identity_model = BMGIsolationForest(contamination=settings.DEFAULT_CONTAMINATION, n_estimators=settings.DEFAULT_ESTIMATORS)
        self.model_file = os.path.join(settings.MODEL_STORAGE_PATH, "bmg_isolation_forest.joblib")
        self._init_models()

    def _init_models(self):
        try:
            if os.path.exists(self.model_file):
                saved = joblib.load(self.model_file)
                self.claim_model = saved.get("claim_model", self.claim_model)
                self.identity_model = saved.get("identity_model", self.identity_model)
                ml_logger.info("Loaded pre-trained Isolation Forest models from disk.")
            else:
                self._train_initial_synthetic_data()
        except Exception as e:
            ml_logger.warning(f"Error loading models: {str(e)}. Retraining on baseline distributions.")
            self._train_initial_synthetic_data()

    def _train_initial_synthetic_data(self):
        np.random.seed(42)
        # Synthetic baseline claim vectors (150 samples)
        normal_claims = np.column_stack([
            np.random.normal(1.0, 0.25, 150),   # amount ratio
            np.random.normal(1.0, 0.15, 150),   # benchmark ratio
            np.random.normal(1.0, 0.2, 150),    # hospital ratio
            np.random.poisson(1.2, 150),        # claim frequency
            np.zeros(150),                      # duplicate count
            np.random.uniform(0.0, 0.1, 150)    # doc mismatch
        ])
        self.claim_model.fit(normal_claims)

        # Synthetic baseline identity vectors (150 samples)
        normal_identities = np.column_stack([
            np.random.uniform(0.0, 0.15, 150),  # velocity km/h
            np.ones(150),                       # hospital count
            np.zeros(150),                      # biometric collisions
            np.random.uniform(0.1, 0.3, 150)    # visit frequency
        ])
        self.identity_model.fit(normal_identities)

        try:
            joblib.dump({
                "claim_model": self.claim_model,
                "identity_model": self.identity_model
            }, self.model_file)
            ml_logger.info(f"Saved initial baseline models to {self.model_file}")
        except Exception as e:
            ml_logger.warning(f"Could not persist model file: {str(e)}")

    def get_scatter_visualization_points(self, n_points: int = 100) -> List[Dict[str, Any]]:
        points = []
        np.random.seed(42)
        # Normal cluster points
        for i in range(n_points - 7):
            x = float(np.clip(0.25 + np.sin(i * 1.7) * 0.18 + np.cos(i * 3.1) * 0.08, 0.05, 0.65))
            y = float(np.clip(0.32 + np.cos(i * 2.3) * 0.16 + np.sin(i * 0.9) * 0.07, 0.05, 0.65))
            points.append({
                "id": f"norm-{i}",
                "x": round(x, 3),
                "y": round(y, 3),
                "isAnomaly": False,
                "label": f"Normal Claim record #{1000 + i}",
                "claimAmount": f"₹ {int(45000 + np.random.rand() * 60000):,}",
                "anomalyScore": round(float(0.12 + np.random.rand() * 0.2), 3),
                "isolationDepth": int(10 + np.random.randint(0, 6))
            })

        # Known isolated anomalies
        outliers = [
            ("anom-1", 0.92, 0.88, "Claim BM-1024 (Duplicate & 3.4x)", "₹ 3,40,000", 0.912, 3),
            ("anom-2", 0.88, 0.22, "Patient P-102 (Impossible Velocity)", "₹ 5,20,000", 0.884, 2),
            ("anom-3", 0.15, 0.91, "Doc DOC-903 (Tampered Pathology)", "₹ 7,80,000", 0.941, 2),
            ("anom-4", 0.95, 0.54, "Claim BM-1028 (Sabbatical Surgeon)", "₹ 7,80,000", 0.938, 3),
            ("anom-5", 0.78, 0.85, "Clinical CLN-402 (Fatal Interaction)", "₹ 1,95,000", 0.865, 4),
            ("anom-6", 0.82, 0.12, "Patient P-104 (Aadhaar Collision)", "₹ 14,80,000", 0.929, 2),
            ("anom-7", 0.08, 0.78, "Claim BM-1026 (Biologic Redundancy)", "₹ 5,20,000", 0.842, 3),
        ]
        for oid, ox, oy, olabel, oamount, oscore, odepth in outliers:
            points.append({
                "id": oid,
                "x": ox,
                "y": oy,
                "isAnomaly": True,
                "label": olabel,
                "claimAmount": oamount,
                "anomalyScore": oscore,
                "isolationDepth": odepth
            })

        return points

model_manager = ModelManager()
