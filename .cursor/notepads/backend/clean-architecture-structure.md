# Estructura Clean Architecture - Backend E-commerce

## 📁 Estructura Detallada por Capa

### 🎯 Domain Layer (Inner - No Dependencies)

```
src/domain/
├── entities/                    # Entidades de dominio
│   ├── product.py              # Product entity con business rules
│   ├── order.py                # Order entity
│   ├── order_item.py           # OrderItem entity
│   ├── user.py                 # User entity
│   └── category.py             # Category entity
│
├── value_objects/              # Value Objects (inmutables)
│   ├── price.py                # Price con validaciones
│   ├── money.py                # Money con currency
│   ├── stock.py                # Stock con business rules
│   ├── email.py                # Email value object
│   └── address.py              # Address value object
│
├── repositories/               # Interfaces de repositorios
│   ├── product_repository.py   # ProductRepository interface
│   ├── order_repository.py     # OrderRepository interface
│   ├── user_repository.py      # UserRepository interface
│   └── category_repository.py  # CategoryRepository interface
│
└── exceptions/                 # Domain exceptions
    ├── domain_exceptions.py    # DomainError base class
    ├── product_exceptions.py    # ProductNotFound, InvalidStock, etc.
    └── order_exceptions.py     # OrderExceptions
```

**Características:**
- ✅ Sin dependencias externas
- ✅ Business logic puro
- ✅ Testeable sin infraestructura
- ✅ Value objects para type safety

---

### 📋 Application Layer (Use Cases)

```
src/application/
├── use_cases/                  # Casos de uso
│   ├── products/
│   │   ├── create_product.py
│   │   ├── get_product.py
│   │   ├── list_products.py
│   │   ├── update_product.py
│   │   ├── delete_product.py
│   │   ├── reduce_stock.py    # Caso de uso específico
│   │   └── search_products.py
│   │
│   ├── orders/
│   │   ├── create_order.py
│   │   ├── get_order.py
│   │   ├── cancel_order.py
│   │   └── update_order_status.py
│   │
│   └── users/
│       ├── register_user.py
│       ├── login_user.py
│       └── get_user_profile.py
│
├── dto/                        # Data Transfer Objects
│   ├── products/
│   │   ├── create_product_dto.py
│   │   ├── update_product_dto.py
│   │   └── product_response_dto.py
│   │
│   ├── orders/
│   │   └── ...
│   │
│   └── common/
│       ├── pagination_dto.py
│       └── filter_dto.py
│
└── interfaces/                 # Interfaces para servicios externos
    ├── email_service.py        # Interface para email
    ├── payment_service.py      # Interface para pagos
    └── storage_service.py      # Interface para almacenamiento
```

**Características:**
- ✅ Depende solo de Domain
- ✅ Orquesta casos de uso
- ✅ Sin dependencias de framework
- ✅ Testeable con mocks

---

### 🔧 Infrastructure Layer (Implementaciones)

```
src/infrastructure/
├── database/
│   ├── sqlalchemy/
│   │   ├── base.py            # Base class para models
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── product_model.py
│   │   │   ├── order_model.py
│   │   │   └── user_model.py
│   │   │
│   │   ├── repositories/      # Implementación de repositories
│   │   │   ├── product_repository_impl.py
│   │   │   ├── order_repository_impl.py
│   │   │   └── user_repository_impl.py
│   │   │
│   │   ├── mappers/           # Domain ↔ Database mappers
│   │   │   ├── product_mapper.py
│   │   │   └── order_mapper.py
│   │   │
│   │   └── session.py         # Session management
│   │
│   └── migrations/            # Alembic migrations
│       ├── versions/
│       └── alembic.ini
│
├── config/
│   ├── settings.py            # Pydantic BaseSettings
│   ├── database_config.py
│   └── logging_config.py
│
├── logging/
│   ├── logger_config.py       # Structured logging
│   └── formatters.py
│
├── external/                  # Servicios externos
│   ├── email/
│   │   └── smtp_email_service.py
│   ├── payment/
│   │   └── stripe_service.py
│   └── storage/
│       └── s3_storage_service.py
│
└── cache/                     # Caching
    └── redis_cache.py
```

**Características:**
- ✅ Implementa interfaces de Domain/Application
- ✅ Maneja detalles técnicos
- ✅ Puede cambiarse sin afectar otras capas

---

### 🎨 Presentation Layer (API)

```
src/presentation/
├── api/
│   ├── v1/                    # API v1
│   │   ├── products/
│   │   │   ├── router.py      # FastAPI router
│   │   │   └── schemas.py     # Request/Response schemas
│   │   │
│   │   ├── orders/
│   │   │   ├── router.py
│   │   │   └── schemas.py
│   │   │
│   │   └── users/
│   │       ├── router.py
│   │       └── schemas.py
│   │
│   ├── dependencies.py        # Dependency injection
│   └── exceptions.py          # API exception handlers
│
├── middleware/
│   ├── error_handler.py       # Global error handler
│   ├── logging_middleware.py  # Request/response logging
│   ├── auth_middleware.py     # JWT authentication
│   ├── rate_limit_middleware.py
│   └── cors_middleware.py     # CORS configurado
│
└── validators/                # Validadores personalizados
    └── product_validators.py
```

**Características:**
- ✅ Solo routing y validación
- ✅ Sin lógica de negocio
- ✅ Maneja HTTP concerns

---

### 🔗 Shared (Utilidades Compartidas)

```
src/shared/
├── exceptions/
│   ├── base_exceptions.py
│   └── http_exceptions.py
│
├── utils/
│   ├── validators.py
│   ├── formatters.py
│   └── helpers.py
│
└── constants/
    ├── error_codes.py
    └── app_constants.py
```

---

## 🔄 Flujo de Dependencias

```
┌─────────────────────────────────────────┐
│     Presentation Layer (FastAPI)        │
│  ┌───────────────────────────────────┐  │
│  │  Router → Use Case → Repository   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Application Layer (Use Cases)       │
│  ┌───────────────────────────────────┐  │
│  │  Use Case → Domain Entity         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Domain Layer (Entities)          │
│  ┌───────────────────────────────────┐  │
│  │  Entity + Business Rules          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────┐
│   Infrastructure Layer (Implementación) │
│  ┌───────────────────────────────────┐  │
│  │  Repository Impl → SQLAlchemy     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📝 Ejemplos de Código por Capa

### Domain Entity Example

```python
# domain/entities/product.py
from dataclasses import dataclass, field
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
    """Product domain entity with business rules"""
    id: Optional[int]
    name: str
    price: Price
    stock: Stock
    category: str
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def reduce_stock(self, quantity: int) -> None:
        """Business rule: Reduce stock"""
        if quantity <= 0:
            raise InvalidStockOperation("Quantity must be positive")
        
        if quantity > self.stock.value:
            raise InsufficientStock(
                f"Only {self.stock.value} items available, requested {quantity}"
            )
        
        self.stock = Stock(self.stock.value - quantity)
        self.updated_at = datetime.now()
    
    def increase_stock(self, quantity: int) -> None:
        """Business rule: Increase stock"""
        if quantity <= 0:
            raise InvalidStockOperation("Quantity must be positive")
        
        self.stock = Stock(self.stock.value + quantity)
        self.updated_at = datetime.now()
    
    def apply_discount(self, percentage: Decimal) -> Price:
        """Business rule: Calculate discounted price"""
        if percentage < 0 or percentage > 100:
            raise ValueError("Discount percentage must be between 0 and 100")
        
        discount_amount = self.price.value * (percentage / 100)
        return Price(self.price.value - discount_amount)
    
    def is_available(self) -> bool:
        """Business rule: Check if product is available"""
        return self.is_active and self.stock.value > 0
```

### Value Object Example

```python
# domain/value_objects/price.py
from decimal import Decimal
from dataclasses import dataclass

@dataclass(frozen=True)  # Immutable
class Price:
    """Price value object - uses Decimal for precision"""
    value: Decimal
    
    def __post_init__(self):
        if self.value < 0:
            raise ValueError("Price cannot be negative")
        if self.value > Decimal("999999.99"):
            raise ValueError("Price exceeds maximum allowed")
    
    def __add__(self, other: 'Price') -> 'Price':
        return Price(self.value + other.value)
    
    def __sub__(self, other: 'Price') -> 'Price':
        result = self.value - other.value
        if result < 0:
            raise ValueError("Resulting price cannot be negative")
        return Price(result)
    
    def __mul__(self, factor: Decimal) -> 'Price':
        return Price(self.value * factor)
```

---

## 🎯 Reglas de Clean Architecture

### Dependency Rule
1. **Domain**: No depende de nada
2. **Application**: Solo depende de Domain
3. **Infrastructure**: Implementa interfaces de Domain/Application
4. **Presentation**: Usa Application, no Infrastructure directamente

### Separación de Concerns
1. **Domain**: Business logic puro
2. **Application**: Orquestación de casos de uso
3. **Infrastructure**: Detalles técnicos (DB, HTTP, etc.)
4. **Presentation**: HTTP concerns (routing, serialization)

### Testing Strategy
1. **Domain**: Tests unitarios puros (sin mocks)
2. **Application**: Tests con mocks de repositories
3. **Infrastructure**: Tests de integración
4. **Presentation**: Tests E2E

---

## 📚 Referencias y Mejores Prácticas

- **Clean Architecture** - Robert C. Martin
- **Domain-Driven Design** - Eric Evans
- **SOLID Principles**
- **Repository Pattern**
- **Dependency Injection**
- **Value Objects Pattern**

