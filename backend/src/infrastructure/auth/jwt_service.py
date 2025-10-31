"""
JWT Service implementation using PyJWT
"""
import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional
from infrastructure.config.settings import get_settings
from domain.interfaces.auth_service import AuthServiceInterface


class JWTService(AuthServiceInterface):
    """
    JWT Service implementation using PyJWT.
    
    Handles:
    - Token creation with expiration
    - Token verification and decoding
    - Password hashing and verification (via PasswordService)
    """
    
    def __init__(self):
        """Initialize JWT service with settings"""
        self._settings = get_settings()
        self._secret_key = self._get_secret_key()
        self._algorithm = self._settings.JWT_ALGORITHM
        self._default_expires_minutes = self._settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    def _get_secret_key(self) -> str:
        """
        Get JWT secret key from settings or environment.
        
        Returns:
            Secret key string
        
        Raises:
            ValueError: If secret key is not configured
        """
        secret = self._settings.JWT_SECRET_KEY
        
        # In development, use a default if not set (INSECURE - only for dev)
        if not secret and self._settings.ENVIRONMENT == "development":
            secret = "dev-secret-key-change-in-production"  # Development only!
            print("⚠️  WARNING: Using default JWT secret key for development. "
                  "Set JWT_SECRET_KEY in environment for production!")
        elif not secret:
            raise ValueError(
                "JWT_SECRET_KEY must be set in environment variables for production"
            )
        
        return secret
    
    def create_token(
        self,
        payload: Dict,
        expires_in_minutes: Optional[int] = None
    ) -> str:
        """
        Create a JWT token from payload.
        
        Args:
            payload: Dictionary with data to encode in token
                - Must include user identification (e.g., user_id, email)
                - Should not include sensitive data
            expires_in_minutes: Token expiration time in minutes
                (defaults to ACCESS_TOKEN_EXPIRE_MINUTES from settings)
        
        Returns:
            Encoded JWT token string
        
        Raises:
            ValueError: If payload is invalid or empty
            Exception: If token creation fails
        """
        if not payload:
            raise ValueError("Payload cannot be empty")
        
        # Create a copy to avoid modifying the original
        token_data = payload.copy()
        
        # Set expiration
        expires_minutes = expires_in_minutes or self._default_expires_minutes
        expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        # Add standard JWT claims
        token_data.update({
            "exp": expire,  # Expiration time
            "iat": datetime.utcnow(),  # Issued at
            "nbf": datetime.utcnow(),  # Not before
        })
        
        try:
            # Encode token
            encoded_token = jwt.encode(
                token_data,
                self._secret_key,
                algorithm=self._algorithm
            )
            
            # PyJWT 2.0+ returns string directly
            if isinstance(encoded_token, bytes):
                return encoded_token.decode("utf-8")
            return encoded_token
            
        except Exception as e:
            raise Exception(f"Failed to create JWT token: {str(e)}")
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token string to verify
        
        Returns:
            Decoded payload dictionary if token is valid, None if invalid
        
        Raises:
            jwt.ExpiredSignatureError: If token has expired
            jwt.InvalidTokenError: If token is invalid, tampered, or malformed
            Exception: For other verification errors
        """
        if not token:
            return None
        
        try:
            # Decode and verify token
            payload = jwt.decode(
                token,
                self._secret_key,
                algorithms=[self._algorithm]
            )
            
            # Remove standard claims before returning
            # Create a copy to avoid modifying the original
            user_payload = {k: v for k, v in payload.items() 
                          if k not in ["exp", "iat", "nbf"]}
            
            return user_payload
            
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError("Token has expired")
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f"Invalid token: {str(e)}")
        except Exception as e:
            raise Exception(f"Token verification failed: {str(e)}")
    
    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Note: This method delegates to PasswordService for consistency.
        Consider using PasswordService directly for password operations.
        
        Args:
            password: Plain text password
        
        Returns:
            Hashed password string
        
        Raises:
            ValueError: If password is empty
        """
        from infrastructure.auth.password_service import PasswordService
        password_service = PasswordService()
        return password_service.hash_password(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        
        Note: This method delegates to PasswordService for consistency.
        Consider using PasswordService directly for password operations.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against
        
        Returns:
            True if password matches, False otherwise
        
        Raises:
            ValueError: If inputs are invalid
        """
        from infrastructure.auth.password_service import PasswordService
        password_service = PasswordService()
        return password_service.verify_password(plain_password, hashed_password)


# Singleton instance
_jwt_service_instance: Optional[JWTService] = None


def get_jwt_service() -> JWTService:
    """
    Get singleton instance of JWT service.
    
    Returns:
        JWTService instance
    """
    global _jwt_service_instance
    if _jwt_service_instance is None:
        _jwt_service_instance = JWTService()
    return _jwt_service_instance

