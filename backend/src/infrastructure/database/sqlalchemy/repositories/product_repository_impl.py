"""
SQLAlchemy implementation of ProductRepository
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from decimal import Decimal
from datetime import datetime

from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from infrastructure.database.sqlalchemy.models import ProductModel


class ProductRepositoryImpl(ProductRepository):
    """
    SQLAlchemy implementation of ProductRepository.
    
    This is part of the Infrastructure layer and implements
    the interface defined in the Domain layer.
    """
    
    def __init__(self, session: Session):
        """Initialize repository with database session"""
        self._session = session
    
    def _to_domain_entity(self, db_model: ProductModel) -> Product:
        """
        Map SQLAlchemy model to domain entity.
        
        Converts database representation to domain entity with value objects.
        """
        return Product(
            id=db_model.id,
            name=db_model.name,
            price=Price(Decimal(str(db_model.price))),  # Convert float to Decimal
            stock=Stock(db_model.stock),
            category=db_model.category,
            description=db_model.description,
            is_active=db_model.is_active,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )
    
    def _to_db_model(self, entity: Product) -> ProductModel:
        """
        Map domain entity to SQLAlchemy model.
        """
        return ProductModel(
            id=entity.id,
            name=entity.name,
            price=float(entity.price.value),  # Convert Decimal to float for DB
            stock=entity.stock.value,
            category=entity.category,
            description=entity.description,
            is_active=entity.is_active,
            created_at=entity.created_at or datetime.now(),
            updated_at=entity.updated_at or datetime.now()
        )
    
    async def create(self, product: Product) -> Product:
        """Create a new product"""
        # SQLAlchemy is synchronous, but we keep async interface for compatibility
        db_model = ProductModel(
            name=product.name,
            price=float(product.price.value),
            stock=product.stock.value,
            category=product.category,
            description=product.description,
            is_active=product.is_active,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self._session.add(db_model)
        self._session.commit()
        self._session.refresh(db_model)
        
        return self._to_domain_entity(db_model)
    
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        db_model = self._session.query(ProductModel).filter(
            and_(
                ProductModel.id == product_id,
                ProductModel.is_active == True
            )
        ).first()
        
        if not db_model:
            return None
        
        return self._to_domain_entity(db_model)
    
    async def list(
        self,
        filters: Optional[dict] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Product]:
        """List products with optional filters"""
        query = self._session.query(ProductModel).filter(
            ProductModel.is_active == True
        )
        
        # Apply filters safely using SQLAlchemy (protects against SQL injection)
        if filters:
            if filters.get("category"):
                query = query.filter(ProductModel.category == filters["category"])
            
            if filters.get("min_price") is not None:
                query = query.filter(ProductModel.price >= float(filters["min_price"]))
            
            if filters.get("max_price") is not None:
                query = query.filter(ProductModel.price <= float(filters["max_price"]))
            
            if filters.get("search"):
                search_term = f"%{filters['search']}%"
                query = query.filter(ProductModel.name.like(search_term))
            
            if filters.get("is_active") is not None:
                query = query.filter(ProductModel.is_active == filters["is_active"])
        
        # Pagination
        query = query.limit(limit).offset(offset)
        
        # Order by ID for consistency
        query = query.order_by(ProductModel.id)
        
        db_models = query.all()
        
        return [self._to_domain_entity(model) for model in db_models]
    
    async def update(self, product: Product) -> Product:
        """Update existing product"""
        db_model = self._session.query(ProductModel).filter(
            ProductModel.id == product.id
        ).first()
        
        if not db_model:
            raise ValueError(f"Product with ID {product.id} not found")
        
        # Update fields
        db_model.name = product.name
        db_model.price = float(product.price.value)
        db_model.stock = product.stock.value
        db_model.category = product.category
        db_model.description = product.description
        db_model.is_active = product.is_active
        db_model.updated_at = datetime.now()
        
        self._session.commit()
        self._session.refresh(db_model)
        
        return self._to_domain_entity(db_model)
    
    async def delete(self, product_id: int) -> None:
        """Soft delete product"""
        db_model = self._session.query(ProductModel).filter(
            ProductModel.id == product_id
        ).first()
        
        if not db_model:
            raise ValueError(f"Product with ID {product_id} not found")
        
        # Soft delete
        db_model.is_active = False
        db_model.updated_at = datetime.now()
        
        self._session.commit()
    
    async def count(self, filters: Optional[dict] = None) -> int:
        """Count products matching filters"""
        query = self._session.query(ProductModel).filter(
            ProductModel.is_active == True
        )
        
        # Apply same filters as list()
        if filters:
            if filters.get("category"):
                query = query.filter(ProductModel.category == filters["category"])
            
            if filters.get("min_price") is not None:
                query = query.filter(ProductModel.price >= float(filters["min_price"]))
            
            if filters.get("max_price") is not None:
                query = query.filter(ProductModel.price <= float(filters["max_price"]))
            
            if filters.get("search"):
                search_term = f"%{filters['search']}%"
                query = query.filter(ProductModel.name.like(search_term))
            
            if filters.get("is_active") is not None:
                query = query.filter(ProductModel.is_active == filters["is_active"])
        
        return query.count()

