"""
Unit tests for Password Service
"""
import pytest
from infrastructure.auth.password_service import PasswordService


class TestPasswordService:
    """Test cases for Password Service"""
    
    def test_hash_password_valid(self):
        """Test hashing a valid password"""
        password = "test_password_123"
        hashed = PasswordService.hash_password(password)
        
        assert isinstance(hashed, str)
        assert len(hashed) == 60  # bcrypt hash length
        assert hashed.startswith("$2")  # bcrypt identifier
    
    def test_hash_password_empty_raises_error(self):
        """Test that empty password raises ValueError"""
        with pytest.raises(ValueError, match="cannot be empty"):
            PasswordService.hash_password("")
    
    def test_hash_password_not_string_raises_error(self):
        """Test that non-string password raises TypeError"""
        with pytest.raises(TypeError, match="must be a string"):
            PasswordService.hash_password(123)
        
        with pytest.raises(TypeError, match="must be a string"):
            PasswordService.hash_password(None)
    
    def test_hash_password_different_hashes(self):
        """Test that same password produces different hashes (salt)"""
        password = "test_password"
        hash1 = PasswordService.hash_password(password)
        hash2 = PasswordService.hash_password(password)
        
        # Hashes should be different due to random salt
        assert hash1 != hash2
    
    def test_verify_password_correct(self):
        """Test verifying correct password"""
        password = "test_password_123"
        hashed = PasswordService.hash_password(password)
        
        assert PasswordService.verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Test verifying incorrect password"""
        password = "test_password_123"
        wrong_password = "wrong_password"
        hashed = PasswordService.hash_password(password)
        
        assert PasswordService.verify_password(wrong_password, hashed) is False
    
    def test_verify_password_empty_plain_raises_error(self):
        """Test that empty plain password raises ValueError"""
        hashed = PasswordService.hash_password("test_password")
        
        with pytest.raises(ValueError, match="cannot be empty"):
            PasswordService.verify_password("", hashed)
    
    def test_verify_password_empty_hash_raises_error(self):
        """Test that empty hash raises ValueError"""
        with pytest.raises(ValueError, match="cannot be empty"):
            PasswordService.verify_password("test_password", "")
    
    def test_verify_password_not_string_raises_error(self):
        """Test that non-string inputs raise TypeError"""
        hashed = PasswordService.hash_password("test_password")
        
        with pytest.raises(TypeError):
            PasswordService.verify_password(123, hashed)
        
        with pytest.raises(TypeError):
            PasswordService.verify_password("test_password", 123)
    
    def test_is_password_hashed_valid(self):
        """Test checking if string is a bcrypt hash"""
        hashed = PasswordService.hash_password("test_password")
        
        assert PasswordService.is_password_hashed(hashed) is True
    
    def test_is_password_hashed_invalid(self):
        """Test checking if string is not a bcrypt hash"""
        assert PasswordService.is_password_hashed("not_a_hash") is False
        assert PasswordService.is_password_hashed("") is False
        assert PasswordService.is_password_hashed("$2a$short") is False
    
    def test_is_password_hashed_not_string(self):
        """Test that non-string returns False"""
        assert PasswordService.is_password_hashed(None) is False
        assert PasswordService.is_password_hashed(123) is False
    
    def test_hash_and_verify_round_trip(self):
        """Test complete hash and verify round trip"""
        password = "complex_password_123!@#"
        hashed = PasswordService.hash_password(password)
        
        # Should verify correctly
        assert PasswordService.verify_password(password, hashed) is True
        
        # Wrong password should fail
        assert PasswordService.verify_password("wrong_password", hashed) is False
    
    def test_hash_password_special_characters(self):
        """Test hashing password with special characters"""
        password = "p@ssw0rd!$%^&*()"
        hashed = PasswordService.hash_password(password)
        
        assert PasswordService.verify_password(password, hashed) is True
    
    def test_hash_password_unicode(self):
        """Test hashing password with unicode characters"""
        password = "пароль_密码_🔒"
        hashed = PasswordService.hash_password(password)
        
        assert PasswordService.verify_password(password, hashed) is True

