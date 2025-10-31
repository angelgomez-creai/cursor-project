"""
Products API router - Presentation layer
Only handles HTTP concerns, delegates to use cases
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal

from application.use_cases.products.create_product import CreateProductUseCase
from application.use_cases.products.get_product import GetProductUseCase
from application.use_cases.products.list_products import ListProductsUseCase
from application.use_cases.products.update_product import UpdateProductUseCase
from application.use_cases.products.delete_product import DeleteProductUseCase
from application.dto.product_dto import (
    CreateProductDTO,
    UpdateProductDTO,
    ProductResponseDTO,
    ProductListResponseDTO,
    ProductFiltersDTO
)
from domain.repositories.product_repository import ProductRepository
from domain.exceptions.product_exceptions import ProductNotFoundError
from presentation.api.dependencies import get_product_repository

router = APIRouter(prefix="/products", tags=["Products"])


def _entity_to_response_dto(product) -> ProductResponseDTO:
    """Convert domain entity to response DTO"""
    return ProductResponseDTO(
        id=product.id,
        name=product.name,
        price=product.price.value,
        stock=product.stock.value,
        category=product.category,
        description=product.description,
        is_active=product.is_active,
        created_at=product.created_at,
        updated_at=product.updated_at
    )


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProductResponseDTO)
async def create_product(
    dto: CreateProductDTO,
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    Create a new product.
    
    Router only handles HTTP, delegates to use case.
    """
    use_case = CreateProductUseCase(repository)
    
    try:
        product = await use_case.execute(dto)
        return _entity_to_response_dto(product)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/{product_id}", response_model=ProductResponseDTO)
async def get_product(
    product_id: int,
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    Get a single product by ID.
    """
    use_case = GetProductUseCase(repository)
    
    try:
        product = await use_case.execute(product_id)
        return _entity_to_response_dto(product)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ProductNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/", response_model=ProductListResponseDTO)
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in product name"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    List products with optional filters and pagination.
    """
    use_case = ListProductsUseCase(repository)
    
    # Build filters DTO
    filters = ProductFiltersDTO(
        category=category,
        min_price=min_price,
        max_price=max_price,
        search=search,
        is_active=is_active
    )
    
    try:
        result = await use_case.execute(filters, page, limit)
        
        # Convert entities to DTOs
        items = [_entity_to_response_dto(product) for product in result["items"]]
        
        return ProductListResponseDTO(
            items=items,
            total=result["total"],
            page=result["page"],
            limit=result["limit"],
            total_pages=result["total_pages"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/{product_id}", response_model=ProductResponseDTO)
async def update_product(
    product_id: int,
    dto: UpdateProductDTO,
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    Update an existing product.
    """
    use_case = UpdateProductUseCase(repository)
    
    try:
        product = await use_case.execute(product_id, dto)
        return _entity_to_response_dto(product)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ProductNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    Delete a product (soft delete).
    """
    use_case = DeleteProductUseCase(repository)
    
    try:
        await use_case.execute(product_id)
        return None
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ProductNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

