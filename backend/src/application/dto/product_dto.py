"""
Product Data Transfer Objects (DTOs)
Used for communication between layers
"""
from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime


class CreateProductDTO(BaseModel):
    """DTO for creating a product"""
    name: str = Field(..., min_length=1, max_length=255)
    price: Decimal = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    category: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: bool = Field(default=True)


class UpdateProductDTO(BaseModel):
    """DTO for updating a product"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[Decimal] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None


class ProductResponseDTO(BaseModel):
    """DTO for product response"""
    id: int
    name: str
    price: Decimal
    stock: int
    category: str
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ProductListResponseDTO(BaseModel):
    """DTO for paginated product list response"""
    items: list[ProductResponseDTO]
    total: int
    page: int
    limit: int
    total_pages: int


class ProductFiltersDTO(BaseModel):
    """DTO for product filters"""
    category: Optional[str] = None
    min_price: Optional[Decimal] = Field(None, ge=0)
    max_price: Optional[Decimal] = Field(None, ge=0)
    search: Optional[str] = None
    is_active: Optional[bool] = None

