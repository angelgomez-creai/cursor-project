"""
Use case: Get Product by ID
"""
from typing import Optional
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from domain.exceptions.product_exceptions import ProductNotFoundError


class GetProductUseCase:
    """
    Use case for getting a product by ID.
    """
    
    def __init__(self, repository: ProductRepository):
        """Initialize use case with repository"""
        self._repository = repository
    
    async def execute(self, product_id: int) -> Product:
        """
        Execute the get product use case.
        
        Args:
            product_id: Product ID to retrieve
        
        Returns:
            Product entity
        
        Raises:
            ValueError: If product_id is invalid
            ProductNotFoundError: If product doesn't exist
        """
        # Validate input
        if not product_id or product_id <= 0:
            raise ValueError("Product ID must be a positive integer")
        
        # Get from repository
        product = await self._repository.get_by_id(product_id)
        
        if not product:
            raise ProductNotFoundError(f"Product with ID {product_id} not found")
        
        return product

