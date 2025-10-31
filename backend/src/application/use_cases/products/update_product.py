"""
Use case: Update Product
"""
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from domain.exceptions.product_exceptions import ProductNotFoundError
from application.dto.product_dto import UpdateProductDTO


class UpdateProductUseCase:
    """
    Use case for updating an existing product.
    """
    
    def __init__(self, repository: ProductRepository):
        """Initialize use case with repository"""
        self._repository = repository
    
    async def execute(self, product_id: int, dto: UpdateProductDTO) -> Product:
        """
        Execute the update product use case.
        
        Args:
            product_id: Product ID to update
            dto: Update data
        
        Returns:
            Updated Product entity
        
        Raises:
            ValueError: If product_id is invalid
            ProductNotFoundError: If product doesn't exist
            ValueError: If no fields to update
        """
        # Validate input
        if not product_id or product_id <= 0:
            raise ValueError("Product ID must be a positive integer")
        
        # Get existing product
        product = await self._repository.get_by_id(product_id)
        if not product:
            raise ProductNotFoundError(f"Product with ID {product_id} not found")
        
        # Update fields (only provided ones)
        from domain.value_objects.price import Price
        from domain.value_objects.stock import Stock
        
        if dto.name is not None:
            product.name = dto.name.strip()
        
        if dto.price is not None:
            product.price = Price(dto.price)
        
        if dto.stock is not None:
            product.stock = Stock(dto.stock)
        
        if dto.category is not None:
            product.category = dto.category.strip()
        
        if dto.description is not None:
            product.description = dto.description.strip() if dto.description else None
        
        if dto.is_active is not None:
            product.is_active = dto.is_active
        
        # Check if any field was updated
        if not any([
            dto.name is not None,
            dto.price is not None,
            dto.stock is not None,
            dto.category is not None,
            dto.description is not None,
            dto.is_active is not None
        ]):
            raise ValueError("No fields to update")
        
        # Persist changes
        updated_product = await self._repository.update(product)
        
        return updated_product

