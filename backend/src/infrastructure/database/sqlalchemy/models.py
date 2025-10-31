"""
SQLAlchemy ORM models for database persistence
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class ProductModel(Base):
    """
    SQLAlchemy model for products table.
    
    This is the database representation of the Product entity.
    Note: Uses Float for price (will be converted to Decimal in domain layer)
    """
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    stock = Column(Integer, nullable=False, default=0)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Indexes for better query performance
    __table_args__ = (
        Index('idx_products_category', 'category'),
        Index('idx_products_price', 'price'),
        Index('idx_products_active', 'is_active'),
        Index('idx_products_category_active', 'category', 'is_active'),
    )

