"""
Use case: List Products with filters and pagination
"""
from typing import List
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from application.dto.product_dto import ProductFiltersDTO


class ListProductsUseCase:
    """
    Use case for listing products with filters and pagination.
    """
    
    def __init__(self, repository: ProductRepository):
        """Initialize use case with repository"""
        self._repository = repository
    
    async def execute(
        self,
        filters: ProductFiltersDTO,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        """
        Execute the list products use case.
        
        Args:
            filters: Filter criteria
            page: Page number (1-indexed)
            limit: Items per page
        
        Returns:
            Dictionary with:
                - items: List of Product entities
                - total: Total count
                - page: Current page
                - limit: Items per page
                - total_pages: Total pages
        """
        # Validate pagination
        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20
        
        offset = (page - 1) * limit
        
        # Convert DTO to dict for repository
        filters_dict = None
        if filters:
            filters_dict = {}
            if filters.category:
                filters_dict["category"] = filters.category
            if filters.min_price is not None:
                filters_dict["min_price"] = filters.min_price
            if filters.max_price is not None:
                filters_dict["max_price"] = filters.max_price
            if filters.search:
                filters_dict["search"] = filters.search
            if filters.is_active is not None:
                filters_dict["is_active"] = filters.is_active
        
        # Get products and count
        products = await self._repository.list(
            filters=filters_dict,
            limit=limit,
            offset=offset
        )
        total = await self._repository.count(filters=filters_dict)
        
        # Calculate total pages
        total_pages = (total + limit - 1) // limit if total > 0 else 0
        
        return {
            "items": products,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

