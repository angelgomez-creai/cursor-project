"""
Tests for JWT Service
Run with: pytest tests/test_jwt_service.py -v
"""
import pytest
from datetime import datetime, timedelta
from infrastructure.auth.jwt_service import JWTService
from infrastructure.auth.password_service import PasswordService
from infrastructure.auth.auth_service import AuthService
import jwt


@pytest.fixture
def jwt_service():
    """Create JWT service instance for testing"""
    # Use test secret key
    from infrastructure.config.settings import Settings
    import os
    os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-testing-only"
    return JWTService()


@pytest.fixture
def password_service():
    """Create password service instance for testing"""
    return PasswordService()


@pytest.fixture
def auth_service():
    """Create auth service instance for testing"""
    return AuthService()


class TestJWTService:
    """Test JWT service functionality"""
    
    def test_create_token(self, jwt_service):
        """Test token creation"""
        payload = {"user_id": 1, "email": "test@example.com"}
        token = jwt_service.create_token(payload)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_verify_token(self, jwt_service):
        """Test token verification"""
        payload = {"user_id": 1, "email": "test@example.com"}
        token = jwt_service.create_token(payload)
        
        decoded = jwt_service.verify_token(token)
        assert decoded is not None
        assert decoded["user_id"] == 1
        assert decoded["email"] == "test@example.com"
    
    def test_token_expiration(self, jwt_service):
        """Test token expiration"""
        payload = {"user_id": 1}
        token = jwt_service.create_token(payload, expires_in_minutes=-1)  # Already expired
        
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt_service.verify_token(token)
    
    def test_invalid_token(self, jwt_service):
        """Test invalid token"""
        with pytest.raises(Exception):
            jwt_service.verify_token("invalid.token.here")
    
    def test_empty_payload(self, jwt_service):
        """Test empty payload raises error"""
        with pytest.raises(ValueError):
            jwt_service.create_token({})


class TestPasswordService:
    """Test password service functionality"""
    
    def test_hash_password(self, password_service):
        """Test password hashing"""
        password = "testPassword123"
        hashed = password_service.hash_password(password)
        
        assert hashed is not None
        assert isinstance(hashed, str)
        assert hashed != password
        assert hashed.startswith("$2")
    
    def test_verify_password_correct(self, password_service):
        """Test password verification with correct password"""
        password = "testPassword123"
        hashed = password_service.hash_password(password)
        
        assert password_service.verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self, password_service):
        """Test password verification with incorrect password"""
        password = "testPassword123"
        hashed = password_service.hash_password(password)
        
        assert password_service.verify_password("wrongPassword", hashed) is False
    
    def test_empty_password(self, password_service):
        """Test empty password raises error"""
        with pytest.raises(ValueError):
            password_service.hash_password("")
    
    def test_is_password_hashed(self, password_service):
        """Test password hash detection"""
        password = "testPassword123"
        hashed = password_service.hash_password(password)
        
        assert password_service.is_password_hashed(hashed) is True
        assert password_service.is_password_hashed(password) is False
        assert password_service.is_password_hashed("") is False


class TestAuthService:
    """Test combined auth service"""
    
    def test_create_token(self, auth_service):
        """Test token creation through auth service"""
        payload = {"user_id": 1, "email": "test@example.com"}
        token = auth_service.create_token(payload)
        
        assert token is not None
        assert isinstance(token, str)
    
    def test_verify_token(self, auth_service):
        """Test token verification through auth service"""
        payload = {"user_id": 1, "email": "test@example.com"}
        token = auth_service.create_token(payload)
        
        decoded = auth_service.verify_token(token)
        assert decoded is not None
        assert decoded["user_id"] == 1
    
    def test_hash_and_verify_password(self, auth_service):
        """Test password hashing and verification through auth service"""
        password = "testPassword123"
        hashed = auth_service.hash_password(password)
        
        assert auth_service.verify_password(password, hashed) is True
        assert auth_service.verify_password("wrongPassword", hashed) is False

