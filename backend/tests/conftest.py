"""
Pytest configuration and shared fixtures
"""
import pytest
from unittest.mock import Mock, AsyncMock
from typing import Generator
from decimal import Decimal

# Import domain entities and value objects
from domain.entities.product import Product
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.repositories.product_repository import ProductRepository


@pytest.fixture
def sample_product_data():
    """Sample product data for testing"""
    return {
        "id": 1,
        "name": "Test Product",
        "price": 99.99,
        "stock": 50,
        "category": "electronics",
        "description": "A test product",
        "is_active": True,
    }


@pytest.fixture
def sample_product(sample_product_data):
    """Create a sample Product entity"""
    return Product(
        id=sample_product_data["id"],
        name=sample_product_data["name"],
        price=Price(sample_product_data["price"]),
        stock=Stock(sample_product_data["stock"]),
        category=sample_product_data["category"],
        description=sample_product_data["description"],
        is_active=sample_product_data["is_active"],
        created_at=None,
        updated_at=None,
    )


@pytest.fixture
def mock_product_repository():
    """Mock ProductRepository for testing use cases"""
    repository = Mock(spec=ProductRepository)
    repository.create = AsyncMock()
    repository.get_by_id = AsyncMock()
    repository.list = AsyncMock()
    repository.update = AsyncMock()
    repository.delete = AsyncMock()
    repository.count = AsyncMock()
    return repository


@pytest.fixture
def sample_create_product_dto():
    """Sample CreateProductDTO for testing"""
    from application.dto.product_dto import CreateProductDTO
    
    return CreateProductDTO(
        name="New Product",
        price=149.99,
        stock=25,
        category="clothing",
        description="A new product",
        is_active=True,
    )


@pytest.fixture
def sample_update_product_dto():
    """Sample UpdateProductDTO for testing"""
    from application.dto.product_dto import UpdateProductDTO
    
    return UpdateProductDTO(
        name="Updated Product",
        price=199.99,
        stock=30,
        category="electronics",
        description="An updated product",
        is_active=True,
    )


@pytest.fixture
def jwt_secret_key():
    """JWT secret key for testing"""
    return "test-secret-key-for-jwt-token-generation"


@pytest.fixture
def sample_user_payload():
    """Sample user payload for JWT testing"""
    return {
        "user_id": 1,
        "email": "test@example.com",
        "role": "user",
    }

