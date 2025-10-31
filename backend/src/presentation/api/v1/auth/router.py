"""
Authentication API router
Provides endpoints for login, token verification, etc.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from infrastructure.auth.auth_service import get_auth_service
from presentation.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Request/Response models
class LoginRequest(BaseModel):
    """Login request model"""
    email: EmailStr
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # Minutes


class VerifyTokenRequest(BaseModel):
    """Verify token request model"""
    token: str


class VerifyTokenResponse(BaseModel):
    """Verify token response model"""
    valid: bool
    payload: Optional[dict] = None
    error: Optional[str] = None


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint - generates JWT token.
    
    Note: This is a simplified example. In production, you should:
    1. Verify credentials against database
    2. Check if user is active
    3. Implement rate limiting
    4. Log login attempts
    """
    # TODO: Verify credentials against database
    # For now, this is a placeholder - implement user verification
    
    # Example: Validate user exists and password is correct
    # user = await user_repository.get_by_email(credentials.email)
    # if not user:
    #     raise HTTPException(status_code=401, detail="Invalid credentials")
    # 
    # auth_service = get_auth_service()
    # if not auth_service.verify_password(credentials.password, user.hashed_password):
    #     raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # For demonstration, we'll create a token with the email
    # In production, use user ID and other necessary data
    auth_service = get_auth_service()
    
    # Create token payload
    payload = {
        "email": credentials.email,
        # "user_id": user.id,  # Add when user system is implemented
    }
    
    try:
        token = auth_service.create_token(payload)
        
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=30  # From settings
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create token: {str(e)}"
        )


@router.post("/verify", response_model=VerifyTokenResponse)
async def verify_token(request: VerifyTokenRequest):
    """
    Verify a JWT token.
    
    Useful for frontend token validation.
    """
    auth_service = get_auth_service()
    
    try:
        payload = auth_service.verify_token(request.token)
        return VerifyTokenResponse(
            valid=True,
            payload=payload
        )
    except Exception as e:
        return VerifyTokenResponse(
            valid=False,
            error=str(e)
        )


@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current user information from token.
    
    Protected route - requires valid JWT token.
    """
    return {
        "user": current_user,
        "authenticated": True
    }


@router.post("/hash-password")
async def hash_password(password: str = Field(..., min_length=6)):
    """
    Utility endpoint to hash a password (for testing/development).
    
    ⚠️ WARNING: Remove or protect this endpoint in production!
    """
    auth_service = get_auth_service()
    
    try:
        hashed = auth_service.hash_password(password)
        return {
            "hashed_password": hashed,
            "note": "Use this hashed password to store in database"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

