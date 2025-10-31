"""
Unit tests for Price value object operations
"""
import pytest
from decimal import Decimal
from domain.value_objects.price import Price


class TestPriceOperations:
    """Test cases for Price arithmetic operations"""
    
    def test_add_prices(self):
        """Test adding two prices"""
        price1 = Price(99.99)
        price2 = Price(50.00)
        result = price1 + price2
        
        assert result.value == Decimal("149.99")
    
    def test_subtract_prices(self):
        """Test subtracting two prices"""
        price1 = Price(100.00)
        price2 = Price(50.00)
        result = price1 - price2
        
        assert result.value == Decimal("50.00")
    
    def test_subtract_result_negative_raises_error(self):
        """Test that subtracting resulting in negative raises error"""
        price1 = Price(50.00)
        price2 = Price(100.00)
        
        with pytest.raises(ValueError, match="cannot be negative"):
            price1 - price2
    
    def test_multiply_price(self):
        """Test multiplying price by factor"""
        price = Price(100.00)
        result = price * 2
        
        assert result.value == Decimal("200.00")
    
    def test_multiply_price_by_decimal(self):
        """Test multiplying price by Decimal"""
        price = Price(100.00)
        result = price * Decimal("0.5")
        
        assert result.value == Decimal("50.00")
    
    def test_divide_price(self):
        """Test dividing price"""
        price = Price(100.00)
        result = price / 2
        
        assert result.value == Decimal("50.00")
    
    def test_divide_by_zero_raises_error(self):
        """Test that dividing by zero raises error"""
        price = Price(100.00)
        
        with pytest.raises(ValueError, match="Cannot divide by zero"):
            price / 0
    
    def test_price_comparison_less_than(self):
        """Test price less than comparison"""
        price1 = Price(50.00)
        price2 = Price(100.00)
        
        assert price1 < price2
        assert not (price2 < price1)
    
    def test_price_comparison_greater_than(self):
        """Test price greater than comparison"""
        price1 = Price(100.00)
        price2 = Price(50.00)
        
        assert price1 > price2
        assert not (price2 > price1)
    
    def test_price_equality(self):
        """Test price equality"""
        price1 = Price(99.99)
        price2 = Price(99.99)
        price3 = Price(100.00)
        
        assert price1 == price2
        assert price1 != price3

