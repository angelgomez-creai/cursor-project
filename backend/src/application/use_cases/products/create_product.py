"""
Use case: Create Product
"""
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from application.dto.product_dto import CreateProductDTO


class CreateProductUseCase:
    """
    Use case for creating a new product.
    
    Orchestrates the creation process:
    1. Validates input DTO
    2. Creates domain entity with value objects
    3. Persists using repository
    4. Returns created entity
    """
    
    def __init__(self, repository: ProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            repository: Product repository implementation
        """
        self._repository = repository
    
    async def execute(self, dto: CreateProductDTO) -> Product:
        """
        Execute the create product use case.
        
        Args:
            dto: Product creation data
        
        Returns:
            Created Product entity
        
        Raises:
            ValueError: If validation fails
            Exception: If persistence fails
        """
        # Create domain entity with value objects
        # Value objects will validate themselves
        product = Product(
            id=None,
            name=dto.name.strip(),
            price=Price(dto.price),  # Value object validates and uses Decimal
            stock=Stock(dto.stock),   # Value object validates
            category=dto.category.strip(),
            description=dto.description.strip() if dto.description else None,
            is_active=dto.is_active,
            created_at=None,
            updated_at=None
        )
        
        # Persist using repository (abstract, implementation in infrastructure)
        created_product = await self._repository.create(product)
        
        return created_product

