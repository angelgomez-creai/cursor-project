"""
Dependency injection for FastAPI
"""
from fastapi import Depends
from sqlalchemy.orm import Session
from infrastructure.database.sqlalchemy.session import get_db_session
from domain.repositories.product_repository import ProductRepository
from infrastructure.database.sqlalchemy.repositories.product_repository_impl import (
    ProductRepositoryImpl
)


def get_product_repository(
    session: Session = Depends(get_db_session)
) -> ProductRepository:
    """
    Dependency injection: Returns ProductRepository implementation.
    
    This function is used by FastAPI's dependency injection system.
    Can be easily swapped for a different implementation (e.g., for testing).
    
    Args:
        session: Database session (injected by FastAPI)
    
    Returns:
        ProductRepository implementation
    """
    return ProductRepositoryImpl(session)

