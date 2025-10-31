"""
Unit tests for Stock value object operations
"""
import pytest
from domain.value_objects.stock import Stock


class TestStockOperations:
    """Test cases for Stock operations"""
    
    def test_stock_add(self):
        """Test adding to stock"""
        stock = Stock(50)
        result = stock + 10
        
        assert result.value == 60
    
    def test_stock_add_negative_raises_error(self):
        """Test that adding negative value raises error"""
        stock = Stock(50)
        
        with pytest.raises(ValueError, match="Cannot add negative"):
            stock + (-5)
    
    def test_stock_subtract(self):
        """Test subtracting from stock"""
        stock = Stock(50)
        result = stock - 10
        
        assert result.value == 40
    
    def test_stock_subtract_negative_raises_error(self):
        """Test that subtracting negative raises error"""
        stock = Stock(50)
        
        with pytest.raises(ValueError, match="Cannot subtract negative"):
            stock - (-5)
    
    def test_stock_subtract_below_zero_raises_error(self):
        """Test that subtracting below zero raises error"""
        stock = Stock(10)
        
        with pytest.raises(ValueError, match="cannot become negative"):
            stock - 20
    
    def test_stock_is_low_stock(self):
        """Test checking if stock is low"""
        low_stock = Stock(5)
        normal_stock = Stock(50)
        
        assert low_stock.is_low_stock(threshold=10) is True
        assert normal_stock.is_low_stock(threshold=10) is False
    
    def test_stock_is_out_of_stock(self):
        """Test checking if stock is out"""
        out_of_stock = Stock(0)
        in_stock = Stock(10)
        
        assert out_of_stock.is_out_of_stock() is True
        assert in_stock.is_out_of_stock() is False
    
    def test_stock_comparison(self):
        """Test stock comparisons"""
        stock1 = Stock(50)
        stock2 = Stock(100)
        
        assert stock1 < stock2
        assert stock2 > stock1
        assert stock1 <= stock2
        assert stock2 >= stock1

