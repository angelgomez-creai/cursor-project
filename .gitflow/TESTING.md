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

### Estructura

```
backend/
├── tests/
│   ├── unit/              # Tests unitarios
│   │   ├── test_value_objects.py
│   │   ├── test_product_entity.py
│   │   ├── test_jwt_service.py
│   │   ├── test_password_service.py
│   │   └── test_product_use_cases.py
│   └── conftest.py        # Fixtures compartidos
└── pytest.ini            # Configuración
```

### Comandos

```bash
# Todos los tests
pytest

# Con coverage
pytest --cov=src --cov-report=html

# Test específico
pytest tests/unit/test_jwt_service.py -v

# Por marker
pytest -m unit
```

### Coverage

- **Mínimo requerido**: 70%
- **Reportes**: HTML, XML, terminal
- **CI/CD**: Upload automático a Codecov

---

## 🔷 Frontend Testing (Jest + Cypress)

### Estructura

```
frontend/
├── src/
│   └── **/__tests__/      # Tests Jest
├── cypress/
│   ├── e2e/               # Tests E2E
│   ├── component/         # Tests componentes (Cypress)
│   └── fixtures/          # Datos de prueba
└── jest.config.js         # Configuración Jest
```

### Comandos

```bash
# Jest
pnpm test                 # Todos los tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # Con coverage

# Cypress
pnpm cypress:open         # UI interactivo
pnpm cypress:run          # Headless
```

### Coverage

- **Mínimo requerido**: 70%
- **Reportes**: HTML, LCOV, terminal
- **CI/CD**: Upload automático a Codecov

---

## 🔄 GitFlow y CI/CD

### Branches

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/* (features)
  │     ├── bugfix/* (bugfixes)
  │     └── hotfix/* (hotfixes)
```

### Workflow

1. **Feature Branch** → Tests unitarios → PR
2. **PR** → CI/CD ejecuta todos los tests
3. **Merge a develop** → Tests completos + coverage
4. **Release** → Tests E2E + Smoke tests
5. **Merge a main** → Deploy a producción

### GitHub Actions

#### Backend Tests
- **Trigger**: Push/PR en `backend/**`
- **Ejecuta**: pytest con coverage
- **Services**: PostgreSQL, Redis
- **Artifacts**: Coverage HTML, test results

#### Frontend Tests
- **Trigger**: Push/PR en `frontend/**`
- **Ejecuta**: 
  - Jest unit tests
  - Cypress E2E tests
- **Artifacts**: Coverage, screenshots, videos

---

## 📊 Coverage Reports

### Ver Reportes

**Backend**:
```bash
cd backend
pytest --cov=src --cov-report=html
open htmlcov/index.html
```

**Frontend**:
```bash
cd frontend
pnpm test:coverage
open coverage/index.html
```

### CI/CD Reports

- **Codecov**: Coverage consolidado
- **GitHub Actions**: Artifacts descargables
- **Badges**: En README.md

---

## ✅ Checklist de Testing

### Antes de PR

- [ ] Todos los tests unitarios pasan
- [ ] Coverage >= 70%
- [ ] Tests nuevos para código nuevo
- [ ] Tests actualizados para código modificado
- [ ] No tests pendientes (skip/todo)

### Antes de Merge

- [ ] CI/CD pipeline pasa
- [ ] Tests E2E pasan (si aplica)
- [ ] Coverage no disminuye
- [ ] Documentación actualizada

---

## 📚 Recursos

- [Backend Testing Guide](./backend/tests/README.md)
- [Frontend Testing Guide](./frontend/tests/README.md)
- [pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [Cypress Documentation](https://docs.cypress.io/)

