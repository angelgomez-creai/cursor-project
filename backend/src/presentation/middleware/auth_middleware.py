"""
Authentication middleware for FastAPI
"""
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from infrastructure.auth.auth_service import get_auth_service


# HTTPBearer security scheme
security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = security
) -> Optional[dict]:
    """
    Extract and verify JWT token from request.
    
    Used as FastAPI dependency to protect routes.
    
    Args:
        request: FastAPI request object
        credentials: HTTPBearer credentials from Authorization header
    
    Returns:
        Decoded token payload (user data) if token is valid
    
    Raises:
        HTTPException: If token is missing, invalid, or expired
    """
    auth_service = get_auth_service()
    
    # Try to get token from Authorization header
    token = None
    if credentials:
        token = credentials.credentials
    else:
        # Try to get from header directly
        authorization = request.headers.get("Authorization")
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split("Bearer ")[1]
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Verify token
        payload = auth_service.verify_token(token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = security
) -> Optional[dict]:
    """
    Extract and verify JWT token from request (optional).
    
    Similar to get_current_user but doesn't raise exception if token is missing.
    Useful for routes that work with or without authentication.
    
    Args:
        request: FastAPI request object
        credentials: HTTPBearer credentials from Authorization header
    
    Returns:
        Decoded token payload if valid token present, None otherwise
    """
    auth_service = get_auth_service()
    
    token = None
    if credentials:
        token = credentials.credentials
    else:
        authorization = request.headers.get("Authorization")
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split("Bearer ")[1]
    
    if not token:
        return None
    
    try:
        return auth_service.verify_token(token)
    except Exception:
        return None

