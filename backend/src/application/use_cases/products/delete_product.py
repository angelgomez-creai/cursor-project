"""
Use case: Delete Product
"""
from domain.repositories.product_repository import ProductRepository
from domain.exceptions.product_exceptions import ProductNotFoundError


class DeleteProductUseCase:
    """
    Use case for deleting a product (soft delete).
    """
    
    def __init__(self, repository: ProductRepository):
        """Initialize use case with repository"""
        self._repository = repository
    
    async def execute(self, product_id: int) -> None:
        """
        Execute the delete product use case.
        
        Args:
            product_id: Product ID to delete
        
        Raises:
            ValueError: If product_id is invalid
            ProductNotFoundError: If product doesn't exist
        """
        # Validate input
        if not product_id or product_id <= 0:
            raise ValueError("Product ID must be a positive integer")
        
        # Verify product exists
        product = await self._repository.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(f"Product with ID {product_id} not found")
        
        # Soft delete via repository
        await self._repository.delete(product_id)

