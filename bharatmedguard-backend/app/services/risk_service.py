from typing import Tuple, List
from app.models.anomaly import AnomalySeverity

class RiskScoringService:
    @staticmethod
    def calculate_composite_risk(
        ml_anomaly_prob: float,
        rule_penalty_score: int,
        duplicate_hit: bool = False,
        mismatch_count: int = 0
    ) -> Tuple[int, AnomalySeverity]:
        # ml_anomaly_prob [0.0 - 1.0] accounts for 40 points
        ml_component = int(ml_anomaly_prob * 40.0)
        
        # rule_penalty_score contributes up to 40 points
        rule_component = min(rule_penalty_score, 40)
        
        # specific hard triggers
        extra_penalty = 0
        if duplicate_hit:
            extra_penalty += 20
        if mismatch_count > 0:
            extra_penalty += min(mismatch_count * 10, 20)

        total_score = min(ml_component + rule_component + extra_penalty, 100)
        total_score = max(total_score, 5)

        if total_score >= 81:
            severity = AnomalySeverity.CRITICAL
        elif total_score >= 61:
            severity = AnomalySeverity.HIGH
        elif total_score >= 31:
            severity = AnomalySeverity.MEDIUM
        else:
            severity = AnomalySeverity.LOW

        return total_score, severity

risk_service = RiskScoringService()
