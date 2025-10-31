"""
Authentication service interface - defines contract for authentication operations
"""
from abc import ABC, abstractmethod
from typing import Dict, Optional
from datetime import datetime


class AuthServiceInterface(ABC):
    """
    Abstract interface for authentication service.
    
    Defines the contract for JWT token operations and password hashing.
    Implementation will be in Infrastructure layer.
    """
    
    @abstractmethod
    def create_token(self, payload: Dict, expires_in_minutes: Optional[int] = None) -> str:
        """
        Create a JWT token from payload.
        
        Args:
            payload: Dictionary with data to encode in token (e.g., user_id, email)
            expires_in_minutes: Token expiration time in minutes (default from settings)
        
        Returns:
            Encoded JWT token string
        
        Raises:
            ValueError: If payload is invalid
            Exception: If token creation fails
        """
        pass
    
    @abstractmethod
    def verify_token(self, token: str) -> Optional[Dict]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token string to verify
        
        Returns:
            Decoded payload dictionary if token is valid, None otherwise
        
        Raises:
            Exception: If token is invalid, expired, or tampered
        """
        pass
    
    @abstractmethod
    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Args:
            password: Plain text password
        
        Returns:
            Hashed password string
        
        Raises:
            ValueError: If password is empty
        """
        pass
    
    @abstractmethod
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against
        
        Returns:
            True if password matches, False otherwise
        
        Raises:
            ValueError: If inputs are invalid
        """
        pass

