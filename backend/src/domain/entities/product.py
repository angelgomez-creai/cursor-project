"""
Product domain entity with business rules
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from decimal import Decimal
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.exceptions.product_exceptions import (
    InvalidStockOperation,
    InsufficientStock,
    InvalidPriceError
)


@dataclass
class Product:
    """
    Product domain entity with business rules
    
    This is the core business entity that contains:
    - Business logic methods
    - Validation rules
    - Value objects for type safety
    """
    id: Optional[int]
    name: str
    price: Price  # Value object, not float
    stock: Stock  # Value object with validations
    category: str
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Validate product on creation"""
        if not self.name or len(self.name.strip()) == 0:
            raise ValueError("Product name cannot be empty")
        if len(self.name) > 255:
            raise ValueError("Product name cannot exceed 255 characters")
        if not self.category or len(self.category.strip()) == 0:
            raise ValueError("Product category cannot be empty")
        if self.description and len(self.description) > 1000:
            raise ValueError("Product description cannot exceed 1000 characters")
    
    def reduce_stock(self, quantity: int) -> None:
        """
        Business rule: Reduce stock
        
        Raises:
            InvalidStockOperation: If quantity is invalid
            InsufficientStock: If not enough stock available
        """
        if quantity <= 0:
            raise InvalidStockOperation("Quantity must be positive")
        
        if quantity > self.stock.value:
            raise InsufficientStock(
                f"Only {self.stock.value} items available, requested {quantity}"
            )
        
        # Create new Stock instance (immutable)
        self.stock = Stock(self.stock.value - quantity)
        self.updated_at = datetime.now()
    
    def increase_stock(self, quantity: int) -> None:
        """
        Business rule: Increase stock
        
        Raises:
            InvalidStockOperation: If quantity is invalid
        """
        if quantity <= 0:
            raise InvalidStockOperation("Quantity must be positive")
        
        self.stock = Stock(self.stock.value + quantity)
        self.updated_at = datetime.now()
    
    def apply_discount(self, percentage: Decimal) -> Price:
        """
        Business rule: Calculate discounted price
        
        Args:
            percentage: Discount percentage (0-100)
        
        Returns:
            New Price with discount applied
        
        Raises:
            InvalidPriceError: If percentage is invalid
        """
        if percentage < 0 or percentage > 100:
            raise InvalidPriceError("Discount percentage must be between 0 and 100")
        
        discount_amount = self.price.value * (percentage / Decimal("100"))
        new_price = self.price.value - discount_amount
        
        if new_price < 0:
            raise InvalidPriceError("Discounted price cannot be negative")
        
        return Price(new_price)
    
    def is_available(self) -> bool:
        """Business rule: Check if product is available for purchase"""
        return self.is_active and self.stock.is_available()
    
    def is_low_stock(self, threshold: int = 10) -> bool:
        """Business rule: Check if product has low stock"""
        return self.stock.is_low_stock(threshold)
    
    def deactivate(self) -> None:
        """Business rule: Deactivate product"""
        self.is_active = False
        self.updated_at = datetime.now()
    
    def activate(self) -> None:
        """Business rule: Activate product"""
        self.is_active = True
        self.updated_at = datetime.now()

