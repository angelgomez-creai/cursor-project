"""
Unit tests for Value Objects
"""
import pytest
from decimal import Decimal
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.exceptions.product_exceptions import InvalidPriceError, InvalidStockError


class TestPrice:
    """Test cases for Price value object"""
    
    def test_create_price_valid_float(self):
        """Test creating Price with valid float"""
        price = Price(99.99)
        assert price.value == Decimal("99.99")
        assert isinstance(price.value, Decimal)
    
    def test_create_price_valid_string(self):
        """Test creating Price with valid string"""
        price = Price("99.99")
        assert price.value == Decimal("99.99")
    
    def test_create_price_valid_decimal(self):
        """Test creating Price with Decimal"""
        price = Price(Decimal("99.99"))
        assert price.value == Decimal("99.99")
    
    def test_create_price_negative_raises_error(self):
        """Test that negative price raises InvalidPriceError"""
        with pytest.raises(InvalidPriceError):
            Price(-10.0)
    
    def test_create_price_zero_allowed(self):
        """Test that zero price is allowed"""
        price = Price(0.0)
        assert price.value == Decimal("0")
    
    def test_create_price_max_value(self):
        """Test creating Price with maximum allowed value"""
        # Maximum is 999999.99 according to Price validation
        price = Price(999999.99)
        assert price.value == Decimal("999999.99")
    
    def test_create_price_exceeds_max_raises_error(self):
        """Test that price exceeding maximum raises error"""
        with pytest.raises(ValueError, match="exceeds maximum"):
            Price(1000000.00)
    
    def test_price_equality(self):
        """Test Price equality comparison"""
        price1 = Price(99.99)
        price2 = Price(99.99)
        price3 = Price(100.00)
        
        assert price1 == price2
        assert price1 != price3
    
    def test_price_repr(self):
        """Test Price string representation"""
        price = Price(99.99)
        assert "99.99" in repr(price)
    
    def test_price_to_float(self):
        """Test converting Price to float"""
        price = Price(99.99)
        assert float(price.value) == 99.99
    
    def test_price_invalid_type_raises_error(self):
        """Test that invalid type raises error"""
        with pytest.raises((ValueError, TypeError)):
            Price(None)


class TestStock:
    """Test cases for Stock value object"""
    
    def test_create_stock_valid_int(self):
        """Test creating Stock with valid integer"""
        stock = Stock(50)
        assert stock.value == 50
        assert isinstance(stock.value, int)
    
    def test_create_stock_zero_allowed(self):
        """Test that zero stock is allowed"""
        stock = Stock(0)
        assert stock.value == 0
    
    def test_create_stock_negative_raises_error(self):
        """Test that negative stock raises InvalidStockError"""
        with pytest.raises(InvalidStockError):
            Stock(-1)
    
    def test_create_stock_large_value(self):
        """Test creating Stock with large value"""
        stock = Stock(1000000)
        assert stock.value == 1000000
    
    def test_stock_equality(self):
        """Test Stock equality comparison"""
        stock1 = Stock(50)
        stock2 = Stock(50)
        stock3 = Stock(100)
        
        assert stock1 == stock2
        assert stock1 != stock3
    
    def test_stock_repr(self):
        """Test Stock string representation"""
        stock = Stock(50)
        assert "50" in repr(stock)
    
    def test_stock_is_available(self):
        """Test checking if stock is available"""
        stock = Stock(10)
        assert stock.is_available() is True
        
        stock_zero = Stock(0)
        assert stock_zero.is_available() is False
    
    def test_stock_invalid_type_raises_error(self):
        """Test that invalid type raises error"""
        with pytest.raises((ValueError, InvalidStockError)):
            Stock("invalid")
        
        with pytest.raises((ValueError, InvalidStockError)):
            Stock(None)

