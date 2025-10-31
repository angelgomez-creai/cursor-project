"""
Password Service implementation using bcrypt
"""
import bcrypt
from typing import Optional


class PasswordService:
    """
    Password service for hashing and verifying passwords using bcrypt.
    
    Features:
    - Secure password hashing with bcrypt
    - Automatic salt generation
    - Password verification with constant-time comparison
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Args:
            password: Plain text password to hash
        
        Returns:
            Hashed password string (includes salt and hash)
        
        Raises:
            ValueError: If password is empty
            TypeError: If password is not a string
        """
        if not password:
            raise ValueError("Password cannot be empty")
        
        if not isinstance(password, str):
            raise TypeError("Password must be a string")
        
        # Convert password to bytes
        password_bytes = password.encode("utf-8")
        
        # Generate salt and hash password
        # bcrypt automatically generates a random salt
        # rounds=12 is a good balance between security and performance
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Return as string (bcrypt hash includes salt)
        return hashed.decode("utf-8")
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a bcrypt hash.
        
        Uses constant-time comparison to prevent timing attacks.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password (with salt) to compare against
        
        Returns:
            True if password matches, False otherwise
        
        Raises:
            ValueError: If inputs are invalid
            TypeError: If inputs are not strings
        """
        if not plain_password:
            raise ValueError("Plain password cannot be empty")
        
        if not hashed_password:
            raise ValueError("Hashed password cannot be empty")
        
        if not isinstance(plain_password, str):
            raise TypeError("Plain password must be a string")
        
        if not isinstance(hashed_password, str):
            raise TypeError("Hashed password must be a string")
        
        try:
            # Convert to bytes
            password_bytes = plain_password.encode("utf-8")
            hashed_bytes = hashed_password.encode("utf-8")
            
            # Verify password (constant-time comparison)
            return bcrypt.checkpw(password_bytes, hashed_bytes)
            
        except Exception as e:
            # Log error in production, but don't expose details
            return False
    
    @staticmethod
    def is_password_hashed(password_hash: str) -> bool:
        """
        Check if a string appears to be a bcrypt hash.
        
        Args:
            password_hash: String to check
        
        Returns:
            True if string looks like a bcrypt hash, False otherwise
        """
        if not password_hash or not isinstance(password_hash, str):
            return False
        
        # Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
        return (
            password_hash.startswith("$2a$") or
            password_hash.startswith("$2b$") or
            password_hash.startswith("$2y$")
        ) and len(password_hash) == 60


# Singleton instance
_password_service_instance: Optional[PasswordService] = None


def get_password_service() -> PasswordService:
    """
    Get singleton instance of password service.
    
    Returns:
        PasswordService instance
    """
    global _password_service_instance
    if _password_service_instance is None:
        _password_service_instance = PasswordService()
    return _password_service_instance

