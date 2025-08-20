"""
Application configuration - LEGACY VERSION with security issues.

❌ PROBLEMA: Settings hardcodeados sin validación
❌ PROBLEMA: Secretos en código fuente
❌ PROBLEMA: No environment-specific configs
❌ PROBLEMA: No validation de configuración
"""

import os
from typing import Optional

class Settings:
    """
    Application settings - BASIC LEGACY VERSION
    
    ❌ PROBLEMA: No usar Pydantic BaseSettings
    ❌ PROBLEMA: Valores hardcodeados
    ❌ PROBLEMA: Secretos inseguros
    """
    
    # ❌ PROBLEMA: Database settings hardcodeados
    DATABASE_URL: str = "ecommerce.db"
    
    # ❌ PROBLEMA: JWT settings inseguros
    JWT_SECRET_KEY: str = "super-secret-key-that-should-not-be-hardcoded"  # ❌ INSEGURO!
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ❌ PROBLEMA: CORS settings muy permisivos
    CORS_ORIGINS: list = ["*"]  # ❌ Muy permisivo
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    # ❌ PROBLEMA: API settings básicos
    API_TITLE: str = "E-commerce Legacy API"
    API_DESCRIPTION: str = "Legacy API that needs refactoring"
    API_VERSION: str = "0.1.0"
    
    # ❌ PROBLEMA: Debug mode hardcodeado
    DEBUG: bool = True  # ❌ No debería estar hardcodeado
    
    # ❌ PROBLEMA: Server settings inseguros
    HOST: str = "0.0.0.0"  # ❌ Inseguro para producción
    PORT: int = 8000
    RELOAD: bool = True  # ❌ No para producción
    
    # ❌ PROBLEMA: No logging configuration
    LOG_LEVEL: str = "INFO"
    
    # ❌ PROBLEMA: No file upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB - sin validación
    UPLOAD_DIRECTORY: str = "uploads/"
    
    # ❌ PROBLEMA: No email settings para futuras features
    # EMAIL_HOST: str = "smtp.gmail.com"
    # EMAIL_PORT: int = 587
    # EMAIL_USERNAME: str = ""  # Should come from env
    # EMAIL_PASSWORD: str = ""  # Should come from env
    
    # ❌ PROBLEMA: No external API settings
    # PAYMENT_GATEWAY_URL: str = ""
    # PAYMENT_GATEWAY_KEY: str = ""  # Should be secret

def get_settings() -> Settings:
    """
    Get application settings.
    
    ❌ PROBLEMA: No caching de settings
    ❌ PROBLEMA: No validation
    ❌ PROBLEMA: No environment override
    """
    return Settings()

def get_database_url() -> str:
    """Get database URL - legacy function"""
    return get_settings().DATABASE_URL

def get_jwt_secret() -> str:
    """
    Get JWT secret key.
    
    ❌ PROBLEMA: Expone secreto hardcodeado
    ❌ PROBLEMA: No rotation de secretos
    """
    # ❌ PROBLEMA: Should read from environment
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        print("⚠️  WARNING: Using hardcoded JWT secret key!")
        secret = Settings.JWT_SECRET_KEY
    
    return secret

def is_development() -> bool:
    """Check if running in development mode"""
    # ❌ PROBLEMA: No environment detection apropiada
    return get_settings().DEBUG

def is_production() -> bool:
    """Check if running in production mode"""
    # ❌ PROBLEMA: Simple negación de debug
    return not is_development()

# ❌ PROBLEMA: Global settings instance
settings = get_settings()

# ❌ PROBLEMA: No configuration validation
# ❌ PROBLEMA: No secrets management
# ❌ PROBLEMA: No environment-specific overrides
# ❌ PROBLEMA: No configuration documentation
# ❌ PROBLEMA: No type hints para todos los settings

"""
TODO: Para Clean Architecture (Día 1):
- Usar Pydantic BaseSettings
- Environment variables validation
- Secrets management
- Environment-specific configurations
- Settings caching y validation
- Configuration documentation
- Type safety para todos los settings
"""


