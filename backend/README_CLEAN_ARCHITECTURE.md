# Backend - Clean Architecture Implementation

## 📁 Estructura Clean Architecture

El backend ha sido refactorizado siguiendo Clean Architecture con FastAPI:

```
backend/
├── src/
│   ├── domain/                    # 🎯 Domain Layer (Inner)
│   │   ├── entities/              # Entidades de dominio
│   │   │   └── product.py         # Product entity con business rules
│   │   ├── value_objects/         # Value Objects
│   │   │   ├── price.py          # Price con Decimal (precisión)
│   │   │   └── stock.py          # Stock con validaciones
│   │   ├── repositories/          # Interfaces de repositorios
│   │   │   └── product_repository.py
│   │   └── exceptions/           # Domain exceptions
│   │
│   ├── application/               # 📋 Application Layer (Use Cases)
│   │   ├── use_cases/             # Casos de uso
│   │   │   └── products/
│   │   │       ├── create_product.py
│   │   │       ├── get_product.py
│   │   │       ├── list_products.py
│   │   │       ├── update_product.py
│   │   │       └── delete_product.py
│   │   └── dto/                   # Data Transfer Objects
│   │       └── product_dto.py
│   │
│   ├── infrastructure/            # 🔧 Infrastructure Layer
│   │   ├── database/
│   │   │   └── sqlalchemy/
│   │   │       ├── models.py      # SQLAlchemy ORM models
│   │   │       ├── session.py    # Session management
│   │   │       └── repositories/
│   │   │           └── product_repository_impl.py
│   │   └── config/
│   │       └── settings.py       # Pydantic BaseSettings
│   │
│   └── presentation/              # 🎨 Presentation Layer
│       └── api/
│           └── v1/
│               └── products/
│                   └── router.py  # FastAPI routers
│
└── main.py                         # Application entry point
```

## 🎯 Principios Aplicados

### 1. **Dependency Rule**
- Domain no depende de nada (inner layer)
- Application depende solo de Domain
- Infrastructure implementa interfaces de Domain
- Presentation usa Application, no Infrastructure directamente

### 2. **Separación de Responsabilidades**
- **Domain**: Business logic puro
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Detalles técnicos (DB, HTTP, etc.)
- **Presentation**: HTTP concerns (routing, serialization)

## 🔐 Mejoras de Seguridad

### Antes ❌
- SQL Injection vulnerabilities
- Float para dinero (precisión)
- Validaciones en controllers
- SQL directo sin protección

### Después ✅
- **SQLAlchemy ORM**: Protección contra SQL Injection
- **Value Objects**: Price usa Decimal, Stock con validaciones
- **Validaciones**: En domain entities y value objects
- **Type Safety**: Type hints completos

## 📦 Dependencias

Actualiza las dependencias:

```bash
pip install -r requirements.txt
```

Nuevas dependencias:
- `sqlalchemy==2.0.23`: ORM para base de datos
- `alembic==1.12.1`: Migrations
- `pydantic-settings==2.1.0`: Settings con validación
- `python-dotenv==1.0.0`: Environment variables

## 🚀 Ejecutar

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py
```

La API estará disponible en:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (si DEBUG=True)
- **Health**: http://localhost:8000/health

## 📡 Endpoints

### Products API (`/api/v1/products`)

- `GET /api/v1/products` - Listar productos (con filtros y paginación)
- `GET /api/v1/products/{id}` - Obtener producto por ID
- `POST /api/v1/products` - Crear producto
- `PUT /api/v1/products/{id}` - Actualizar producto
- `DELETE /api/v1/products/{id}` - Eliminar producto (soft delete)

### Ejemplo de Request

```bash
# Crear producto
curl -X POST http://localhost:8000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "stock": 10,
    "category": "Electronics",
    "description": "Product description"
  }'

# Listar productos con filtros
curl "http://localhost:8000/api/v1/products?category=Electronics&page=1&limit=10"
```

## 🔄 Flujo de Ejecución

1. **Request** → `router.py` (Presentation)
2. **Router** → `UseCase` (Application)
3. **UseCase** → `Repository` (Domain interface)
4. **Repository Impl** → `SQLAlchemy` (Infrastructure)
5. **Response** ← Domain Entity → DTO → JSON

## 🧪 Testing

Cada capa es testeable independientemente:

- **Domain**: Tests unitarios puros (sin mocks)
- **Application**: Tests con mocks de repositories
- **Infrastructure**: Tests de integración
- **Presentation**: Tests E2E

## 📚 Documentación

- Análisis de arquitectura: `.cursor/notepads/backend/architecture-analysis.md`
- Estructura detallada: `.cursor/notepads/backend/clean-architecture-structure.md`
- Ejemplos: `.cursor/notepads/backend/clean-architecture-examples.md`

