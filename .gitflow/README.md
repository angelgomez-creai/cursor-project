# GitFlow y CI/CD - E-commerce

## 📋 Descripción

Guía completa del flujo de trabajo GitFlow y CI/CD automatizado para el proyecto e-commerce.

## 🌿 GitFlow Structure

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/product-search     (new features)
  │     ├── feature/user-authentication
  │     │
  │     ├── bugfix/cart-update-issue   (bug fixes)
  │     │
  │     └── hotfix/critical-security   (hotfixes to main)
  │
  └── release/v1.0.0                   (release branches)
```

## 🔄 Flujo de Trabajo

### 1. Feature Development

```bash
# Crear feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Desarrollar y commit
git add .
git commit -m "feat: add new feature"

# Push y crear PR
git push origin feature/my-feature
# Crear PR a develop en GitHub
```

**CI/CD ejecuta**:
- ✅ Linters (backend/frontend)
- ✅ Unit tests
- ✅ Coverage check (>= 70%)
- ✅ Security scans

### 2. Integration (develop)

```bash
# Merge PR a develop
# CI/CD ejecuta:
# - Todos los tests
# - Integration tests
# - Coverage report
# - Build artifacts
```

### 3. Release

```bash
# Crear release branch
git checkout develop
git checkout -b release/v1.0.0

# Fixes y preparación
# Merge a main y develop
```

**CI/CD ejecuta**:
- ✅ Tests completos
- ✅ E2E tests
- ✅ Smoke tests
- ✅ Deployment a staging

### 4. Production (main)

```bash
# Merge release a main
# CI/CD ejecuta:
# - Full test suite
# - Deployment a producción
```

### 5. Hotfix

```bash
# Crear hotfix desde main
git checkout main
git checkout -b hotfix/critical-bug

# Fix y merge a main y develop
```

---

## 🔄 CI/CD Pipeline

### Workflows Automáticos

#### Backend Tests (`test-backend.yml`)

**Trigger**: Push/PR en `backend/**`

**Steps**:
1. Setup Python 3.11
2. Setup PostgreSQL y Redis (services)
3. Install dependencies
4. Run linters (Black, isort, Flake8)
5. Run security scans (Bandit, Safety)
6. Run unit tests con coverage
7. Upload coverage a Codecov
8. Upload artifacts

**Services**:
- PostgreSQL 15-alpine
- Redis 7-alpine

#### Frontend Tests (`test-frontend.yml`)

**Trigger**: Push/PR en `frontend/**`

**Jobs**:
1. **Jest Tests**
   - Setup Node.js 18
   - Install dependencies
   - Run Jest tests
   - Upload coverage

2. **Cypress E2E**
   - Build application
   - Start dev server
   - Run Cypress tests
   - Upload screenshots/videos

---

## ✅ Checklist por Branch

### Feature Branch

- [ ] Tests unitarios pasan localmente
- [ ] Coverage >= 70%
- [ ] Linters pasan
- [ ] PR creado a develop
- [ ] CI/CD pasa
- [ ] Code review aprobado

### Develop Branch

- [ ] Todos los tests pasan
- [ ] Integration tests pasan
- [ ] Coverage report generado
- [ ] Build artifacts creados
- [ ] No errores en CI/CD

### Release Branch

- [ ] Tests E2E pasan
- [ ] Smoke tests pasan
- [ ] Documentación actualizada
- [ ] Changelog actualizado
- [ ] Deployment a staging exitoso

### Main Branch

- [ ] Todos los tests pasan
- [ ] Security scans pasan
- [ ] Deployment a producción
- [ ] Monitoring configurado

---

## 📊 Coverage Requirements

### Backend
- **Mínimo**: 70%
- **Objetivo**: 80%
- **Reportes**: HTML, XML, Codecov

### Frontend
- **Mínimo**: 70%
- **Objetivo**: 80%
- **Reportes**: HTML, LCOV, Codecov

### CI/CD
- Coverage check en cada PR
- Falla si coverage < 70%
- Reportes públicos en Codecov

---

## 🔒 Security Checks

### Backend
- **Bandit**: Security linter
- **Safety**: Dependency vulnerabilities

### Frontend
- **ESLint**: Code quality
- **npm audit**: Dependency vulnerabilities

### CI/CD
- Security scans en cada PR
- Alertas automáticas
- Fail si vulnerabilidades críticas

---

## 📝 Commits y PRs

### Commit Messages

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search functionality
fix: resolve cart update issue
test: add unit tests for ProductService
docs: update API documentation
refactor: improve error handling
```

### PR Template

```markdown
## Descripción
[Descripción del cambio]

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Tests
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests E2E agregados/actualizados
- [ ] Todos los tests pasan

## Checklist
- [ ] Código sigue las convenciones
- [ ] Self-review realizado
- [ ] Comentarios agregados
- [ ] Documentación actualizada
```

---

## 🚀 Deployment

### Automático (CI/CD)

- **develop** → Staging (automatic)
- **main** → Production (automatic)

### Manual

```bash
# Staging
git push origin develop
# CI/CD despliega automáticamente

# Production
git push origin main
# CI/CD despliega automáticamente
```

---

## 📚 Recursos

- [Testing Strategy](./TESTING.md)
- [Backend Tests](../backend/tests/README.md)
- [Frontend Tests](../frontend/tests/README.md)
- [GitHub Actions Workflows](../.github/workflows/)

