"""
Product repository interface - defines contract for product persistence
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.product import Product


class ProductRepository(ABC):
    """
    Abstract repository interface for Product persistence.
    
    This is part of the Domain layer and defines the contract
    that must be implemented by the Infrastructure layer.
    
    Following Dependency Inversion Principle:
    - Domain defines the interface
    - Infrastructure implements it
    """
    
    @abstractmethod
    async def create(self, product: Product) -> Product:
        """
        Create a new product.
        
        Args:
            product: Product entity to create
        
        Returns:
            Created product with ID assigned
        
        Raises:
            Exception: If creation fails
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """
        Get product by ID.
        
        Args:
            product_id: Product ID
        
        Returns:
            Product entity if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def list(
        self,
        filters: Optional[dict] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Product]:
        """
        List products with optional filters.
        
        Args:
            filters: Dictionary with filter criteria:
                - category: str
                - min_price: Decimal
                - max_price: Decimal
                - search: str
                - is_active: bool
            limit: Maximum number of results
            offset: Number of results to skip
        
        Returns:
            List of Product entities
        """
        pass
    
    @abstractmethod
    async def update(self, product: Product) -> Product:
        """
        Update existing product.
        
        Args:
            product: Product entity with updated data
        
        Returns:
            Updated product entity
        
        Raises:
            ProductNotFoundError: If product doesn't exist
        """
        pass
    
    @abstractmethod
    async def delete(self, product_id: int) -> None:
        """
        Delete product (soft delete by default).
        
        Args:
            product_id: Product ID to delete
        
        Raises:
            ProductNotFoundError: If product doesn't exist
        """
        pass
    
    @abstractmethod
    async def count(self, filters: Optional[dict] = None) -> int:
        """
        Count products matching filters.
        
        Args:
            filters: Same as list() method
        
        Returns:
            Total count of matching products
        """
        pass

