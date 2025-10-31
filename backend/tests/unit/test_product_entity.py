"""
Unit tests for Product domain entity
"""
import pytest
from datetime import datetime
from domain.entities.product import Product
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.exceptions.product_exceptions import (
    InvalidStockOperation,
    InsufficientStock,
)


class TestProductEntity:
    """Test cases for Product domain entity"""
    
    def test_create_product_valid(self, sample_product):
        """Test creating a valid product"""
        assert sample_product.id == 1
        assert sample_product.name == "Test Product"
        assert sample_product.price.value == Price(99.99).value
        assert sample_product.stock.value == 50
        assert sample_product.category == "electronics"
        assert sample_product.is_active is True
    
    def test_create_product_empty_name_raises_error(self):
        """Test that empty name raises ValueError"""
        with pytest.raises(ValueError, match="cannot be empty"):
            Product(
                id=None,
                name="",
                price=Price(99.99),
                stock=Stock(50),
                category="electronics",
                is_active=True,
            )
    
    def test_create_product_name_too_long_raises_error(self):
        """Test that name exceeding 255 characters raises error"""
        long_name = "a" * 256
        with pytest.raises(ValueError, match="cannot exceed 255 characters"):
            Product(
                id=None,
                name=long_name,
                price=Price(99.99),
                stock=Stock(50),
                category="electronics",
                is_active=True,
            )
    
    def test_create_product_empty_category_raises_error(self):
        """Test that empty category raises ValueError"""
        with pytest.raises(ValueError, match="category cannot be empty"):
            Product(
                id=None,
                name="Test Product",
                price=Price(99.99),
                stock=Stock(50),
                category="",
                is_active=True,
            )
    
    def test_create_product_description_too_long_raises_error(self):
        """Test that description exceeding 1000 characters raises error"""
        long_description = "a" * 1001
        with pytest.raises(ValueError, match="description cannot exceed 1000 characters"):
            Product(
                id=None,
                name="Test Product",
                price=Price(99.99),
                stock=Stock(50),
                category="electronics",
                description=long_description,
                is_active=True,
            )
    
    def test_create_product_strips_whitespace(self):
        """Test that product trims whitespace from name and category"""
        product = Product(
            id=None,
            name="  Test Product  ",
            price=Price(99.99),
            stock=Stock(50),
            category="  electronics  ",
            is_active=True,
        )
        assert product.name == "Test Product"
        assert product.category == "electronics"
    
    def test_reduce_stock_valid(self, sample_product):
        """Test reducing stock with valid quantity"""
        initial_stock = sample_product.stock.value
        quantity = 10
        
        sample_product.reduce_stock(quantity)
        
        assert sample_product.stock.value == initial_stock - quantity
    
    def test_reduce_stock_negative_quantity_raises_error(self, sample_product):
        """Test that negative quantity raises InvalidStockOperation"""
        with pytest.raises(InvalidStockOperation):
            sample_product.reduce_stock(-5)
    
    def test_reduce_stock_zero_quantity_raises_error(self, sample_product):
        """Test that zero quantity raises InvalidStockOperation"""
        with pytest.raises(InvalidStockOperation):
            sample_product.reduce_stock(0)
    
    def test_reduce_stock_insufficient_stock_raises_error(self, sample_product):
        """Test that reducing more than available raises InsufficientStock"""
        with pytest.raises(InsufficientStock):
            sample_product.reduce_stock(100)  # More than available (50)
    
    def test_increase_stock_valid(self, sample_product):
        """Test increasing stock with valid quantity"""
        initial_stock = sample_product.stock.value
        quantity = 10
        
        sample_product.increase_stock(quantity)
        
        assert sample_product.stock.value == initial_stock + quantity
    
    def test_increase_stock_negative_quantity_raises_error(self, sample_product):
        """Test that negative quantity raises InvalidStockOperation"""
        with pytest.raises(InvalidStockOperation):
            sample_product.increase_stock(-5)
    
    def test_increase_stock_zero_quantity_raises_error(self, sample_product):
        """Test that zero quantity raises InvalidStockOperation"""
        with pytest.raises(InvalidStockOperation):
            sample_product.increase_stock(0)
    
    def test_activate_product(self, sample_product):
        """Test activating a product"""
        sample_product.is_active = False
        sample_product.activate()
        assert sample_product.is_active is True
    
    def test_deactivate_product(self, sample_product):
        """Test deactivating a product"""
        sample_product.deactivate()
        assert sample_product.is_active is False
    
    def test_is_available_when_active_and_has_stock(self, sample_product):
        """Test product is available when active and has stock"""
        assert sample_product.is_available() is True
    
    def test_is_available_when_inactive(self, sample_product):
        """Test product is not available when inactive"""
        sample_product.deactivate()
        assert sample_product.is_available() is False
    
    def test_is_available_when_no_stock(self):
        """Test product is not available when out of stock"""
        product = Product(
            id=1,
            name="Out of Stock Product",
            price=Price(99.99),
            stock=Stock(0),
            category="electronics",
            is_active=True,
        )
        assert product.is_available() is False
    
    def test_update_price(self, sample_product):
        """Test updating product price"""
        new_price = Price(149.99)
        sample_product.price = new_price  # Direct assignment since Product is dataclass
        assert sample_product.price == new_price

