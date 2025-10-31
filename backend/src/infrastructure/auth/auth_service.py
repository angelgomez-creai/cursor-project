"""
Combined Authentication Service
Provides a unified interface for JWT and password operations
"""
from infrastructure.auth.jwt_service import JWTService, get_jwt_service
from infrastructure.auth.password_service import PasswordService, get_password_service
from domain.interfaces.auth_service import AuthServiceInterface
from typing import Dict, Optional


class AuthService(AuthServiceInterface):
    """
    Combined authentication service that wraps JWT and Password services.
    
    This provides a single interface for all authentication operations:
    - JWT token creation and verification
    - Password hashing and verification
    """
    
    def __init__(
        self,
        jwt_service: Optional[JWTService] = None,
        password_service: Optional[PasswordService] = None
    ):
        """
        Initialize authentication service.
        
        Args:
            jwt_service: JWT service instance (defaults to singleton)
            password_service: Password service instance (defaults to singleton)
        """
        self._jwt_service = jwt_service or get_jwt_service()
        self._password_service = password_service or get_password_service()
    
    def create_token(
        self,
        payload: Dict,
        expires_in_minutes: Optional[int] = None
    ) -> str:
        """
        Create a JWT token from payload.
        
        Args:
            payload: Dictionary with data to encode (e.g., {"user_id": 1, "email": "user@example.com"})
            expires_in_minutes: Token expiration time in minutes
        
        Returns:
            Encoded JWT token string
        
        Example:
            >>> auth_service = AuthService()
            >>> token = auth_service.create_token({"user_id": 1, "email": "user@example.com"})
        """
        return self._jwt_service.create_token(payload, expires_in_minutes)
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token string to verify
        
        Returns:
            Decoded payload dictionary if valid, None otherwise
        
        Example:
            >>> payload = auth_service.verify_token(token)
            >>> if payload:
            ...     user_id = payload.get("user_id")
        """
        try:
            return self._jwt_service.verify_token(token)
        except Exception:
            return None
    
    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Args:
            password: Plain text password
        
        Returns:
            Hashed password string
        
        Example:
            >>> hashed = auth_service.hash_password("mySecurePassword123")
        """
        return self._password_service.hash_password(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against
        
        Returns:
            True if password matches, False otherwise
        
        Example:
            >>> is_valid = auth_service.verify_password("myPassword", hashed_password)
        """
        return self._password_service.verify_password(plain_password, hashed_password)


# Singleton instance
_auth_service_instance: Optional[AuthService] = None


def get_auth_service() -> AuthService:
    """
    Get singleton instance of authentication service.
    
    Returns:
        AuthService instance
    """
    global _auth_service_instance
    if _auth_service_instance is None:
        _auth_service_instance = AuthService()
    return _auth_service_instance

