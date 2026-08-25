import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import db_manager
from app.core.logging_config import app_logger
from app.network.scapy_monitor import scapy_monitor
from app.ml.model_manager import model_manager
from app.utils.rate_limiter import check_rate_limit
from scripts.seed_database import seed_initial_records

# Routes
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.claims import router as claims_router
from app.routes.patients import router as patients_router
from app.routes.documents import router as documents_router
from app.routes.clinical import router as clinical_router
from app.routes.anomalies import router as anomalies_router
from app.routes.investigations import router as investigations_router
from app.routes.security import router as security_router
from app.routes.audit import router as audit_router
from app.routes.ai import router as ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    app_logger.info("Initializing BharatMedGuard AI Cyber Defence Platform...")
    await db_manager.connect()
    scapy_monitor.start_monitor()
    
    # Auto-seed database if empty
    try:
        await seed_initial_records()
    except Exception as e:
        app_logger.warning(f"Initial seeding note: {str(e)}")

    app_logger.info("BharatMedGuard services ready and listening.")
    yield

    # Shutdown Sequence
    app_logger.info("Shutting down BharatMedGuard services...")
    scapy_monitor.stop_monitor()
    await db_manager.close()

app = FastAPI(
    title="BharatMedGuard API",
    description="AI-Powered Healthcare Cyber Defence & Multi-Pipeline Anomaly Detection Platform",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting & Access Logger Middleware
@app.middleware("http")
async def rate_limiting_and_logging_middleware(request: Request, call_next):
    start_time = time.time()
    # Exclude docs and health from strict limiter
    if not request.url.path.startswith(("/docs", "/openapi.json", "/redoc", "/health")):
        try:
            await check_rate_limit(request)
        except Exception as exc:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"success": False, "error": {"code": "RATE_LIMIT_EXCEEDED", "message": str(exc.detail)}}
            )

    response = await call_next(request)
    duration = time.time() - start_time
    response.headers["X-Process-Time"] = f"{duration:.4f}s"
    return response

# Standardized Error Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Malformed request payload",
                "details": exc.errors()
            }
        }
    )

# Include All Subsystem Routers under /api/v1
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(dashboard_router, prefix=api_v1)
app.include_router(claims_router, prefix=api_v1)
app.include_router(patients_router, prefix=api_v1)
app.include_router(documents_router, prefix=api_v1)
app.include_router(clinical_router, prefix=api_v1)
app.include_router(anomalies_router, prefix=api_v1)
app.include_router(investigations_router, prefix=api_v1)
app.include_router(security_router, prefix=api_v1)
app.include_router(audit_router, prefix=api_v1)
app.include_router(ai_router, prefix=api_v1)

# Health endpoint at root as well
@app.get("/health", tags=["System"])
async def root_health():
    return {
        "status": "healthy",
        "api": "operational",
        "database": "connected",
        "ml_engine": "ready",
        "ocr_engine": "available",
        "version": settings.VERSION
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
