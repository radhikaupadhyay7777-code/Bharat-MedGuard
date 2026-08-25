import numpy as np
from typing import Tuple, Dict, Any, List
from sklearn.ensemble import IsolationForest
from app.core.logging_config import ml_logger

class BMGIsolationForest:
    def __init__(self, contamination: float = 0.05, n_estimators: int = 100, random_state: int = 42):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=n_estimators,
            random_state=random_state,
            n_jobs=-1
        )
        self.is_fitted = False

    def fit(self, X: np.ndarray):
        self.model.fit(X)
        self.is_fitted = True
        ml_logger.info(f"BMG IsolationForest fitted on {len(X)} training vectors.")

    def predict_anomaly(self, X: np.ndarray) -> Tuple[bool, float, float]:
        if not self.is_fitted:
            # Fallback heuristic calculation if not yet fitted
            norm_val = float(np.mean(X))
            is_anom = norm_val > 2.0
            return is_anom, min(norm_val / 5.0, 1.0), 3.0 if is_anom else 12.0

        # Predict: -1 for anomaly, 1 for inlier
        pred = self.model.predict(X)[0]
        # score_samples: opposite of the anomaly score defined in the original paper.
        # The lower, the more abnormal. Typical range [-0.5, 0.5]
        raw_score = self.model.score_samples(X)[0]
        
        # Convert raw_score to normalized anomaly probability [0.0, 1.0]
        # raw_score <= -0.15 is highly anomalous
        anomaly_prob = float(np.clip((0.2 - raw_score) / 0.4, 0.0, 1.0))
        is_anomaly = bool(pred == -1 or anomaly_prob > 0.65)
        
        # Estimate average isolation tree depth h(x)
        path_length = float(np.clip(14.0 * (1.0 - anomaly_prob), 2.0, 16.0))
        
        return is_anomaly, anomaly_prob, path_length
