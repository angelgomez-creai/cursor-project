# Backend Testing Guide

## 📋 Descripción

Guía completa para ejecutar y escribir tests unitarios para el backend del e-commerce.

## 🚀 Inicio Rápido

### Instalar dependencias

```bash
cd backend
pip install -r requirements-dev.txt
```

### Ejecutar todos los tests

```bash
# Ejecutar todos los tests
pytest

# Con coverage
pytest --cov=src --cov-report=html

# Solo tests unitarios
pytest tests/unit/ -v

# Test específico
pytest tests/unit/test_jwt_service.py -v
```

## 📁 Estructura de Tests

```
backend/tests/
├── __init__.py
├── conftest.py              # Fixtures compartidos
├── unit/                    # Tests unitarios
│   ├── test_value_objects.py
│   ├── test_product_entity.py
│   ├── test_jwt_service.py
│   ├── test_password_service.py
│   └── test_product_use_cases.py
└── README.md
```

## 🧪 Tests Unitarios Disponibles

### 1. Value Objects

**Archivo**: `tests/unit/test_value_objects.py`

Tests para:
- `Price`: Validación, operaciones, edge cases
- `Stock`: Validación, operaciones, disponibilidad

**Ejecutar**:
```bash
pytest tests/unit/test_value_objects.py -v
```

### 2. Product Entity

**Archivo**: `tests/unit/test_product_entity.py`

Tests para:
- Creación de productos
- Validaciones (nombre, categoría, descripción)
- Operaciones de stock (reduce, increase)
- Activación/desactivación
- Disponibilidad

**Ejecutar**:
```bash
pytest tests/unit/test_product_entity.py -v
```

### 3. JWT Service

**Archivo**: `tests/unit/test_jwt_service.py`

Tests para:
- Creación de tokens
- Verificación de tokens
- Expiración de tokens
- Tokens inválidos/tampered

**Ejecutar**:
```bash
pytest tests/unit/test_jwt_service.py -v
```

### 4. Password Service

**Archivo**: `tests/unit/test_password_service.py`

Tests para:
- Hash de passwords
- Verificación de passwords
- Validación de inputs
- Detección de hashes

**Ejecutar**:
```bash
pytest tests/unit/test_password_service.py -v
```

### 5. Product Use Cases

**Archivo**: `tests/unit/test_product_use_cases.py`

Tests para:
- CreateProductUseCase
- GetProductUseCase
- ListProductsUseCase
- UpdateProductUseCase
- DeleteProductUseCase

**Ejecutar**:
```bash
pytest tests/unit/test_product_use_cases.py -v
```

## 📊 Coverage

### Ver coverage

```bash
# Generar reporte HTML
pytest --cov=src --cov-report=html

# Abrir reporte
open htmlcov/index.html  # macOS
# O navegar a htmlcov/index.html en el navegador
```

### Coverage mínimo

El proyecto requiere **70%** de coverage mínimo (configurado en `pytest.ini`).

### Verificar coverage

```bash
pytest --cov=src --cov-report=term-missing --cov-fail-under=70
```

## 🔧 Fixtures Disponibles

### Fixtures de conftest.py

- `sample_product_data`: Datos de ejemplo para productos
- `sample_product`: Product entity de ejemplo
- `mock_product_repository`: Mock del repositorio
- `sample_create_product_dto`: DTO para crear productos
- `sample_update_product_dto`: DTO para actualizar productos
- `jwt_secret_key`: Secret key para JWT tests
- `sample_user_payload`: Payload de usuario para JWT

**Uso**:
```python
def test_example(sample_product, mock_product_repository):
    # Use fixtures
    assert sample_product.name == "Test Product"
```

## ✍️ Escribir Nuevos Tests

### Estructura básica

```python
"""
Unit tests for MyService
"""
import pytest
from my_module import MyService


class TestMyService:
    """Test cases for MyService"""
    
    def test_valid_case(self):
        """Test valid scenario"""
        service = MyService()
        result = service.method()
        assert result == expected_value
    
    def test_invalid_case(self):
        """Test invalid scenario"""
        with pytest.raises(ValueError):
            MyService().method(invalid_input)
```

### Tests asíncronos

```python
@pytest.mark.asyncio
async def test_async_method(self):
    """Test async method"""
    result = await async_function()
    assert result is not None
```

### Usar mocks

```python
from unittest.mock import Mock, AsyncMock

def test_with_mock(self):
    """Test with mocked dependency"""
    mock_dependency = Mock()
    mock_dependency.method.return_value = "mocked"
    
    service = MyService(mock_dependency)
    result = service.use_dependency()
    
    assert result == "mocked"
    mock_dependency.method.assert_called_once()
```

## 📝 Markers

### Markers disponibles

- `@pytest.mark.unit`: Tests unitarios
- `@pytest.mark.integration`: Tests de integración
- `@pytest.mark.e2e`: Tests end-to-end
- `@pytest.mark.slow`: Tests lentos
- `@pytest.mark.security`: Tests de seguridad

### Ejecutar por marker

```bash
# Solo tests unitarios
pytest -m unit

# Excluir tests lentos
pytest -m "not slow"
```

## 🐛 Troubleshooting

### Tests fallan con imports

```bash
# Asegurar que el proyecto está instalado en modo desarrollo
pip install -e .
```

### Tests asíncronos no funcionan

```bash
# Instalar pytest-asyncio
pip install pytest-asyncio
```

### Coverage no se genera

```bash
# Instalar pytest-cov
pip install pytest-cov
```

## 📚 Recursos

- [pytest Documentation](https://docs.pytest.org/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)

