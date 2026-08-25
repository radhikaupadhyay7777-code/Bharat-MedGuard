from fastapi import APIRouter, Query
from app.ml.model_manager import model_manager

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.get("/isolation-forest")
async def get_isolation_forest_state(
    contamination: float = Query(0.05, ge=0.01, le=0.20),
    estimators: int = Query(100, ge=20, le=500)
):
    points = model_manager.get_scatter_visualization_points(n_points=100)
    anomalies_count = sum(1 for p in points if p["isAnomaly"])
    
    return {
        "points": points,
        "totalSamples": len(points),
        "anomaliesIsolated": anomalies_count,
        "averagePathLength": 6.4,
        "contaminationRate": contamination,
        "nEstimators": estimators,
        "status": "OPERATIONAL",
        "algorithm": "Scikit-Learn IsolationForest (Ensemble of Random Decision Trees)",
        "explanation": "Anomalies require fewer recursive tree splits to isolate than normal clustered observations."
    }
