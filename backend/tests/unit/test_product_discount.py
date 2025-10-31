"""
Unit tests for Product discount operations
"""
import pytest
from decimal import Decimal
from domain.entities.product import Product
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.exceptions.product_exceptions import InvalidPriceError


class TestProductDiscount:
    """Test cases for Product discount operations"""
    
    @pytest.fixture
    def product_with_price(self):
        """Create product with price for discount tests"""
        return Product(
            id=1,
            name="Test Product",
            price=Price(100.00),
            stock=Stock(50),
            category="electronics",
            is_active=True,
        )
    
    def test_apply_discount_valid(self, product_with_price):
        """Test applying valid discount"""
        discounted_price = product_with_price.apply_discount(Decimal("20"))
        
        assert discounted_price.value == Decimal("80.00")
    
    def test_apply_discount_50_percent(self, product_with_price):
        """Test applying 50% discount"""
        discounted_price = product_with_price.apply_discount(Decimal("50"))
        
        assert discounted_price.value == Decimal("50.00")
    
    def test_apply_discount_100_percent_raises_error(self, product_with_price):
        """Test that 100% discount raises error (price would be 0)"""
        with pytest.raises(InvalidPriceError, match="cannot be negative"):
            product_with_price.apply_discount(Decimal("100"))
    
    def test_apply_discount_negative_raises_error(self, product_with_price):
        """Test that negative discount raises error"""
        with pytest.raises(InvalidPriceError, match="must be between 0 and 100"):
            product_with_price.apply_discount(Decimal("-10"))
    
    def test_apply_discount_over_100_raises_error(self, product_with_price):
        """Test that discount over 100% raises error"""
        with pytest.raises(InvalidPriceError, match="must be between 0 and 100"):
            product_with_price.apply_discount(Decimal("150"))

