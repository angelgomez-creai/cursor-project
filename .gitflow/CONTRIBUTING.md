# Contributing Guide - E-commerce

## 📋 Guía de Contribución

Esta guía explica cómo contribuir al proyecto siguiendo GitFlow y buenas prácticas.

## 🌿 GitFlow Workflow

### 1. Crear Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Desarrollar...
git add .
git commit -m "feat: add new feature"

# Push y crear PR
git push origin feature/my-feature
```

### 2. Tests Obligatorios

**Antes de PR**:
```bash
# Backend
cd backend
pytest tests/unit/ -v --cov=src

# Frontend
cd frontend
pnpm test
pnpm run cypress:run  # Opcional antes de PR
```

### 3. Crear Pull Request

- **Base**: `develop`
- **Title**: Siguiendo Conventional Commits
- **Description**: Incluir cambios, tests, breaking changes

**Template**:
```markdown
## Descripción
[Descripción del cambio]

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change

## Tests
- [ ] Tests unitarios agregados
- [ ] Tests E2E agregados (si aplica)
- [ ] Todos los tests pasan

## Checklist
- [ ] Código sigue convenciones
- [ ] Self-review realizado
- [ ] Documentación actualizada
```

### 4. Code Review

- **Revisores**: Mínimo 1 aprobación
- **CI/CD**: Debe pasar todos los checks
- **Coverage**: No debe disminuir < 70%

### 5. Merge

- **Merge**: Squash merge recomendado
- **Cleanup**: Branch eliminado automáticamente

## ✅ Checklist Pre-PR

### Backend
- [ ] Tests unitarios pasan
- [ ] Coverage >= 70%
- [ ] Linters pasan (Black, isort, Flake8)
- [ ] Security scans pasan
- [ ] Type hints agregados

### Frontend
- [ ] Jest tests pasan
- [ ] Coverage >= 70%
- [ ] ESLint pasa
- [ ] TypeScript compila
- [ ] No warnings en consola

## 📝 Commit Messages

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search functionality
fix: resolve cart update issue
test: add unit tests for ProductService
docs: update API documentation
refactor: improve error handling
chore: update dependencies
```

**Format**: `type(scope): description`

**Types**:
- `feat`: Nueva feature
- `fix`: Bug fix
- `test`: Tests
- `docs`: Documentación
- `refactor`: Refactoring
- `chore`: Mantenimiento

## 🧪 Escribir Tests

### Backend

```python
def test_my_function():
    """Test description"""
    result = my_function()
    assert result == expected
```

### Frontend

```typescript
it('should work correctly', () => {
  const result = myFunction()
  expect(result).toBe(expected)
})
```

## 📚 Recursos

- [Testing Strategy](./TESTING.md)
- [GitFlow Guide](./README.md)
- [Backend Tests](../backend/tests/README.md)
- [Frontend Tests](../frontend/tests/README.md)

