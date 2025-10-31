"""
Application settings using Pydantic BaseSettings
"""
try:
    from pydantic_settings import BaseSettings
except ImportError:
    # Fallback for older pydantic versions
    from pydantic import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings with validation.
    
    Uses Pydantic BaseSettings for:
    - Environment variable loading
    - Type validation
    - Default values
    """
    
    # Database
    DATABASE_URL: str = "sqlite:///./ecommerce.db"
    
    # API
    API_TITLE: str = "E-commerce API"
    API_DESCRIPTION: str = "Clean Architecture E-commerce API"
    API_VERSION: str = "1.0.0"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = False  # Should be False in production
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]  # Frontend URL
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Security
    JWT_SECRET_KEY: str = ""  # Must be set via environment (use strong secret in production)
    JWT_ALGORITHM: str = "HS256"  # HS256, HS384, HS512, RS256, etc.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Access token expiration
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # Refresh token expiration (for future use)
    
    # Environment
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = False
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to avoid reloading settings on every call.
    """
    return Settings()

