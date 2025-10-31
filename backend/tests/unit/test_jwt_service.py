"""
Unit tests for JWT Service
"""
import pytest
import jwt
from datetime import datetime, timedelta
from unittest.mock import patch, Mock
from infrastructure.auth.jwt_service import JWTService
from infrastructure.config.settings import Settings


class TestJWTService:
    """Test cases for JWT Service"""
    
    @pytest.fixture
    def jwt_service(self, jwt_secret_key):
        """Create JWT service instance for testing"""
        with patch('infrastructure.auth.jwt_service.get_settings') as mock_settings:
            mock_settings.return_value = Mock(
                JWT_SECRET_KEY=jwt_secret_key,
                JWT_ALGORITHM="HS256",
                ACCESS_TOKEN_EXPIRE_MINUTES=30,
                ENVIRONMENT="test"
            )
            service = JWTService()
            return service
    
    def test_create_token_valid_payload(self, jwt_service, sample_user_payload):
        """Test creating token with valid payload"""
        token = jwt_service.create_token(sample_user_payload)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Verify token can be decoded
        decoded = jwt_service.verify_token(token)
        assert decoded["user_id"] == sample_user_payload["user_id"]
        assert decoded["email"] == sample_user_payload["email"]
    
    def test_create_token_empty_payload_raises_error(self, jwt_service):
        """Test that empty payload raises ValueError"""
        with pytest.raises(ValueError, match="cannot be empty"):
            jwt_service.create_token({})
    
    def test_create_token_custom_expiration(self, jwt_service, sample_user_payload):
        """Test creating token with custom expiration"""
        custom_exp_minutes = 60
        token = jwt_service.create_token(
            sample_user_payload,
            expires_in_minutes=custom_exp_minutes
        )
        
        # Verify expiration is set correctly
        decoded = jwt.decode(
            token,
            jwt_service._secret_key,
            algorithms=[jwt_service._algorithm]
        )
        
        exp_time = datetime.fromtimestamp(decoded["exp"])
        now = datetime.utcnow()
        expected_exp = now + timedelta(minutes=custom_exp_minutes)
        
        # Allow 1 minute tolerance
        assert abs((exp_time - expected_exp).total_seconds()) < 60
    
    def test_verify_token_valid(self, jwt_service, sample_user_payload):
        """Test verifying a valid token"""
        token = jwt_service.create_token(sample_user_payload)
        decoded = jwt_service.verify_token(token)
        
        assert decoded is not None
        assert decoded["user_id"] == sample_user_payload["user_id"]
        assert "exp" not in decoded  # Standard claims should be removed
        assert "iat" not in decoded
    
    def test_verify_token_expired(self, jwt_service, sample_user_payload):
        """Test verifying an expired token raises ExpiredSignatureError"""
        # Create token with very short expiration
        token = jwt_service.create_token(sample_user_payload, expires_in_minutes=-1)
        
        with pytest.raises(jwt.ExpiredSignatureError):
            jwt_service.verify_token(token)
    
    def test_verify_token_invalid_raises_error(self, jwt_service):
        """Test that invalid token raises InvalidTokenError"""
        invalid_token = "invalid.token.string"
        
        with pytest.raises(jwt.InvalidTokenError):
            jwt_service.verify_token(invalid_token)
    
    def test_verify_token_empty_returns_none(self, jwt_service):
        """Test that empty token returns None"""
        result = jwt_service.verify_token("")
        assert result is None
        
        result = jwt_service.verify_token(None)
        assert result is None
    
    def test_verify_token_tampered_raises_error(self, jwt_service, sample_user_payload):
        """Test that tampered token raises InvalidTokenError"""
        token = jwt_service.create_token(sample_user_payload)
        
        # Tamper with token
        tampered_token = token[:-5] + "xxxxx"
        
        with pytest.raises(jwt.InvalidTokenError):
            jwt_service.verify_token(tampered_token)
    
    def test_verify_token_wrong_secret_raises_error(self, jwt_service, sample_user_payload):
        """Test that token with wrong secret raises error"""
        # Create token
        token = jwt_service.create_token(sample_user_payload)
        
        # Try to decode with wrong secret
        with pytest.raises(jwt.InvalidTokenError):
            jwt.decode(
                token,
                "wrong-secret-key",
                algorithms=[jwt_service._algorithm]
            )
    
    def test_token_contains_standard_claims(self, jwt_service, sample_user_payload):
        """Test that token contains standard JWT claims"""
        token = jwt_service.create_token(sample_user_payload)
        
        decoded = jwt.decode(
            token,
            jwt_service._secret_key,
            algorithms=[jwt_service._algorithm]
        )
        
        assert "exp" in decoded
        assert "iat" in decoded
        assert "nbf" in decoded
    
    def test_token_payload_not_modified(self, jwt_service, sample_user_payload):
        """Test that original payload is not modified"""
        original_payload = sample_user_payload.copy()
        token = jwt_service.create_token(sample_user_payload)
        
        # Original payload should be unchanged
        assert sample_user_payload == original_payload

