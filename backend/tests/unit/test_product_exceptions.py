"""
Unit tests for Product domain exceptions
"""
import pytest
from domain.exceptions.product_exceptions import (
    ProductNotFoundError,
    InvalidStockOperation,
    InsufficientStock,
    InvalidPriceError,
)
from domain.exceptions.domain_exceptions import DomainException


class TestProductExceptions:
    """Test cases for Product exceptions"""
    
    def test_product_not_found_error(self):
        """Test ProductNotFoundError"""
        error = ProductNotFoundError("Product not found")
        
        assert isinstance(error, DomainException)
        assert str(error) == "Product not found"
    
    def test_invalid_stock_operation(self):
        """Test InvalidStockOperation"""
        error = InvalidStockOperation("Invalid stock operation")
        
        assert isinstance(error, DomainException)
        assert str(error) == "Invalid stock operation"
    
    def test_insufficient_stock(self):
        """Test InsufficientStock"""
        error = InsufficientStock("Insufficient stock")
        
        assert isinstance(error, DomainException)
        assert str(error) == "Insufficient stock"
    
    def test_invalid_price_error(self):
        """Test InvalidPriceError"""
        error = InvalidPriceError("Invalid price")
        
        assert isinstance(error, DomainException)
        assert str(error) == "Invalid price"

