import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "BharatMedGuard AI Healthcare Cyber Defence"
    VERSION: str = "2.4.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database Settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "bharatmedguard_db"
    DB_CONNECT_TIMEOUT_MS: int = 1500

    # JWT Authentication
    JWT_SECRET_KEY: str = "bharatmedguard_secure_jwt_key_national_cyber_defence_2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    # Uploads & Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg", "tiff"]

    # ML Anomaly Detection Defaults
    DEFAULT_CONTAMINATION: float = 0.05
    DEFAULT_ESTIMATORS: int = 100
    MODEL_STORAGE_PATH: str = "./app/ml/saved_models"

    # OCR Settings
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "tesseract")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODEL_STORAGE_PATH, exist_ok=True)
