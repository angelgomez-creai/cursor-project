# Ejemplos de Implementación Clean Architecture

## 🔄 Flujo Completo: Create Product

### 1. Request llega al Router

```python
# presentation/api/v1/products/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from application.use_cases.products.create_product import CreateProductUseCase
from application.dto.product_dto import CreateProductDTO
from presentation.api.dependencies import get_product_repository
from domain.repositories.product_repository import ProductRepository

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(
    dto: CreateProductDTO,
    repository: ProductRepository = Depends(get_product_repository)
):
    """
    Create a new product.
    Router solo valida request y llama al use case.
    """
    use_case = CreateProductUseCase(repository)
    
    try:
        product = await use_case.execute(dto)
        return product
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
```

### 2. Use Case Orquesta la Lógica

```python
# application/use_cases/products/create_product.py
from typing import Protocol
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from application.dto.product_dto import CreateProductDTO

class CreateProductUseCase:
    """
    Use case para crear un producto.
    Orquesta la creación del producto y aplica reglas de negocio.
    """
    
    def __init__(self, repository: ProductRepository):
        self._repository = repository
    
    async def execute(self, dto: CreateProductDTO) -> Product:
        """
        Ejecuta el caso de uso de creación de producto.
        """
        # Validaciones de aplicación
        if not dto.name or len(dto.name.strip()) == 0:
            raise ValueError("Product name cannot be empty")
        
        # Crear entidad de dominio con value objects
        product = Product(
            id=None,
            name=dto.name.strip(),
            price=Price(dto.price),  # Value object valida automáticamente
            stock=Stock(dto.stock),   # Value object valida automáticamente
            category=dto.category,
            description=dto.description,
            is_active=True,
            created_at=None,
            updated_at=None
        )
        
        # Persistir usando repository (abstracto)
        created_product = await self._repository.create(product)
        
        return created_product
```

### 3. Domain Entity con Business Rules

```python
# domain/entities/product.py
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from decimal import Decimal
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from domain.exceptions.product_exceptions import (
    InvalidStockOperation,
    InsufficientStock
)

@dataclass
class Product:
    """Product domain entity"""
    id: Optional[int]
    name: str
    price: Price
    stock: Stock
    category: str
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    def reduce_stock(self, quantity: int) -> None:
        """Business rule: Reduce stock"""
        if quantity <= 0:
            raise InvalidStockOperation("Quantity must be positive")
        if quantity > self.stock.value:
            raise InsufficientStock(
                f"Only {self.stock.value} items available"
            )
        # Crear nuevo Stock (inmutable)
        self.stock = Stock(self.stock.value - quantity)
        self.updated_at = datetime.now()
```

### 4. Repository Interface (Domain)

```python
# domain/repositories/product_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.product import Product

class ProductRepository(ABC):
    """Abstract repository interface - define contract"""
    
    @abstractmethod
    async def create(self, product: Product) -> Product:
        """Create a new product"""
        pass
    
    @abstractmethod
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        pass
    
    @abstractmethod
    async def list(
        self,
        filters: Optional[dict] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Product]:
        """List products with optional filters"""
        pass
    
    @abstractmethod
    async def update(self, product: Product) -> Product:
        """Update existing product"""
        pass
    
    @abstractmethod
    async def delete(self, product_id: int) -> None:
        """Delete product (soft delete)"""
        pass
```

### 5. Repository Implementation (Infrastructure)

```python
# infrastructure/database/sqlalchemy/repositories/product_repository_impl.py
from typing import List, Optional
from sqlalchemy.orm import Session
from domain.entities.product import Product
from domain.repositories.product_repository import ProductRepository
from infrastructure.database.sqlalchemy.models import ProductModel
from infrastructure.database.sqlalchemy.mappers import product_mapper

class ProductRepositoryImpl(ProductRepository):
    """SQLAlchemy implementation of ProductRepository"""
    
    def __init__(self, session: Session):
        self._session = session
    
    async def create(self, product: Product) -> Product:
        """Create product in database"""
        # Mapear domain entity a SQLAlchemy model
        db_model = product_mapper.to_db_model(product)
        
        self._session.add(db_model)
        self._session.commit()
        self._session.refresh(db_model)
        
        # Mapear de vuelta a domain entity
        return product_mapper.to_domain_entity(db_model)
    
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        db_model = self._session.query(ProductModel).filter(
            ProductModel.id == product_id,
            ProductModel.is_active == True
        ).first()
        
        if not db_model:
            return None
        
        return product_mapper.to_domain_entity(db_model)
    
    async def list(
        self,
        filters: Optional[dict] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Product]:
        """List products with filters"""
        query = self._session.query(ProductModel).filter(
            ProductModel.is_active == True
        )
        
        # Aplicar filtros de forma segura
        if filters:
            if filters.get("category"):
                query = query.filter(ProductModel.category == filters["category"])
            if filters.get("min_price") is not None:
                query = query.filter(ProductModel.price >= filters["min_price"])
            if filters.get("max_price") is not None:
                query = query.filter(ProductModel.price <= filters["max_price"])
            if filters.get("search"):
                search_term = f"%{filters['search']}%"
                query = query.filter(ProductModel.name.like(search_term))
        
        # Paginación
        query = query.limit(limit).offset(offset)
        
        db_models = query.all()
        
        # Mapear a domain entities
        return [product_mapper.to_domain_entity(model) for model in db_models]
    
    async def update(self, product: Product) -> Product:
        """Update product"""
        db_model = self._session.query(ProductModel).filter(
            ProductModel.id == product.id
        ).first()
        
        if not db_model:
            raise ValueError("Product not found")
        
        # Actualizar campos
        db_model.name = product.name
        db_model.price = float(product.price.value)
        db_model.stock = product.stock.value
        db_model.category = product.category
        db_model.description = product.description
        db_model.is_active = product.is_active
        db_model.updated_at = datetime.now()
        
        self._session.commit()
        self._session.refresh(db_model)
        
        return product_mapper.to_domain_entity(db_model)
    
    async def delete(self, product_id: int) -> None:
        """Soft delete product"""
        db_model = self._session.query(ProductModel).filter(
            ProductModel.id == product_id
        ).first()
        
        if not db_model:
            raise ValueError("Product not found")
        
        # Soft delete
        db_model.is_active = False
        db_model.updated_at = datetime.now()
        
        self._session.commit()
```

### 6. Dependency Injection Setup

```python
# presentation/api/dependencies.py
from functools import lru_cache
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
    Puede cambiarse fácilmente sin afectar código que lo usa.
    """
    return ProductRepositoryImpl(session)
```

---

## 🔐 Seguridad: Antes vs Después

### ❌ ANTES (Vulnerable)
```python
# api.py - SQL Injection vulnerable
query = f"SELECT * FROM products WHERE category = '{category}'"
query += f" AND name LIKE '%{search}%'"
cursor.execute(query)  # VULNERABLE!
```

### ✅ DESPUÉS (Seguro)
```python
# repository_impl.py - SQLAlchemy protege contra injection
query = self._session.query(ProductModel)
query = query.filter(ProductModel.category == category)  # Parametrizado
query = query.filter(ProductModel.name.like(f"%{search}%"))  # Seguro
results = query.all()
```

---

## 💰 Manejo de Dinero: Antes vs Después

### ❌ ANTES (Float - Precision Issues)
```python
price: float = 899.99  # Puede tener errores de precisión
# 0.1 + 0.2 = 0.30000000000000004
```

### ✅ DESPUÉS (Decimal - Precise)
```python
# domain/value_objects/price.py
from decimal import Decimal

@dataclass(frozen=True)
class Price:
    value: Decimal  # Precise para dinero
    
    def __post_init__(self):
        if self.value < 0:
            raise ValueError("Price cannot be negative")
```

---

## 🧪 Testing: Ejemplo

### Test del Use Case (Sin DB)
```python
# tests/unit/application/use_cases/test_create_product.py
import pytest
from unittest.mock import Mock
from application.use_cases.products.create_product import CreateProductUseCase
from application.dto.product_dto import CreateProductDTO
from domain.entities.product import Product
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock

def test_create_product_success():
    # Mock del repository
    mock_repository = Mock()
    mock_product = Product(
        id=1,
        name="Test Product",
        price=Price(Decimal("99.99")),
        stock=Stock(10),
        category="Test",
        description="Test description",
        is_active=True,
        created_at=None,
        updated_at=None
    )
    mock_repository.create.return_value = mock_product
    
    # Use case
    use_case = CreateProductUseCase(mock_repository)
    
    # DTO
    dto = CreateProductDTO(
        name="Test Product",
        price=Decimal("99.99"),
        stock=10,
        category="Test",
        description="Test description"
    )
    
    # Execute
    result = await use_case.execute(dto)
    
    # Assertions
    assert result.id == 1
    assert result.name == "Test Product"
    mock_repository.create.assert_called_once()
```

---

## 📋 Checklist de Migración

### Fase 1: Preparación
- [ ] Instalar SQLAlchemy y Alembic
- [ ] Configurar Pydantic BaseSettings
- [ ] Crear estructura de carpetas

### Fase 2: Domain Layer
- [ ] Crear entidades de dominio
- [ ] Crear value objects (Price, Stock, etc.)
- [ ] Definir interfaces de repositories
- [ ] Crear domain exceptions

### Fase 3: Application Layer
- [ ] Crear use cases
- [ ] Crear DTOs
- [ ] Implementar dependency injection

### Fase 4: Infrastructure
- [ ] Configurar SQLAlchemy
- [ ] Crear SQLAlchemy models
- [ ] Implementar repositories
- [ ] Configurar migrations

### Fase 5: Presentation
- [ ] Refactorizar routers
- [ ] Agregar middleware
- [ ] Mejorar error handling

### Fase 6: Testing
- [ ] Tests unitarios de domain
- [ ] Tests de use cases
- [ ] Tests de integración

