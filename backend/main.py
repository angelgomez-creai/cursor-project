"""
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from infrastructure.config.settings import get_settings
from infrastructure.database.sqlalchemy.session import init_database
from presentation.api.v1.products.router import router as products_router
from presentation.api.v1.auth.router import router as auth_router

# Get settings
settings = get_settings()

# Create FastAPI app with settings
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Configure CORS with settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Include routers
app.include_router(products_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

@app.get("/", tags=["General"])
async def root():
    """Root endpoint"""
    return {
        "message": settings.API_TITLE,
        "status": "running",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "API is running",
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    # Initialize database on startup
    print("🔧 Initializing database...")
    init_database()
    print("✅ Database initialized")
    
    print(f"🚀 Starting {settings.API_TITLE}...")
    print(f"🌐 Environment: {settings.ENVIRONMENT}")
    print(f"📍 Server: http://{settings.HOST}:{settings.PORT}")
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD and settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower()
    )


