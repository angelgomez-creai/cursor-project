# Testing Strategy - E-commerce

## 📋 Descripción

Estrategia completa de testing para el proyecto e-commerce, incluyendo tests unitarios, integración y E2E con CI/CD automático.

## 🏗️ Arquitectura de Testing

```
┌─────────────────────────────────────────┐
│         CI/CD Pipeline                  │
├─────────────────────────────────────────┤
│  Push/PR → Tests Backend → Tests Frontend │
│       → Coverage Reports → Deploy       │
└─────────────────────────────────────────┘
```

## 🔷 Backend Testing (Python/pytest)

### Ejecutar Tests

```bash
cd backend

# Todos los tests
pytest

# Con coverage
pytest --cov=src --cov-report=html

# Solo tests unitarios
pytest tests/unit/ -v

# Test específico
pytest tests/unit/test_jwt_service.py -v
```

### Tests Disponibles

- **Value Objects**: `test_value_objects.py`, `test_price_value_object.py`, `test_stock_value_object.py`
- **Entities**: `test_product_entity.py`
- **Services**: `test_jwt_service.py`, `test_password_service.py`
- **Use Cases**: `test_product_use_cases.py`
- **Exceptions**: `test_product_exceptions.py`

### Coverage

- **Mínimo**: 70%
- **Comando**: `pytest --cov=src --cov-fail-under=70`

## 🔷 Frontend Testing (Jest + Cypress)

### Jest Unit Tests

```bash
cd frontend

# Todos los tests
pnpm test

# Watch mode
pnpm test:watch

# Con coverage
pnpm test:coverage
```

**Tests disponibles**:
- Hooks: `useLocalStorage`, `useDebounce`
- Utils: `formatPrice`
- Componentes: `LoadingSpinner`, `ErrorMessage`, `ProductCard`

### Cypress E2E Tests

```bash
# Abrir Cypress UI
pnpm cypress:open

# Ejecutar headless
pnpm cypress:run
```

**Tests E2E**:
- `home.cy.ts`: Home page
- `products.cy.ts`: Products page
- `cart.cy.ts`: Cart functionality

## 🔄 CI/CD con GitHub Actions

### Backend Tests Workflow

**Archivo**: `.github/workflows/test-backend.yml`

**Ejecuta**:
- Setup Python 3.11
- Setup PostgreSQL y Redis
- Linters (Black, isort, Flake8)
- Security scans (Bandit, Safety)
- Unit tests con coverage
- Upload a Codecov

**Trigger**: Push/PR en `backend/**`

### Frontend Tests Workflow

**Archivo**: `.github/workflows/test-frontend.yml`

**Ejecuta**:
- Jest unit tests
- Cypress E2E tests
- Coverage reports
- Screenshots/videos (on failure)

**Trigger**: Push/PR en `frontend/**`

## 📊 Coverage Reports

- **Backend**: `backend/htmlcov/index.html`
- **Frontend**: `frontend/coverage/index.html`
- **Codecov**: Coverage consolidado online

## ✅ Checklist

### Antes de PR
- [ ] Tests unitarios pasan
- [ ] Coverage >= 70%
- [ ] Linters pasan
- [ ] CI/CD pasa

### Antes de Merge
- [ ] Todos los tests pasan
- [ ] Tests E2E pasan
- [ ] Coverage no disminuye
- [ ] Documentación actualizada

## 📚 Documentación Completa

- [Backend Tests Guide](./backend/tests/README.md)
- [Frontend Tests Guide](./frontend/tests/README.md)
- [GitFlow Testing](./.gitflow/TESTING.md)
- [GitFlow CI/CD](./.gitflow/README.md)

