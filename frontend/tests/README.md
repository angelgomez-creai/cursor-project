# Frontend Testing Guide

## 📋 Descripción

Guía completa para ejecutar y escribir tests para el frontend del e-commerce usando Jest y Cypress.

## 🚀 Inicio Rápido

### Instalar dependencias

```bash
cd frontend
pnpm install
```

### Ejecutar tests

```bash
# Todos los tests
pnpm test

# Watch mode
pnpm test:watch

# Con coverage
pnpm test:coverage

# Solo tests unitarios
pnpm test -- --testPathPattern=unit

# Test específico
pnpm test useLocalStorage
```

## 📁 Estructura de Tests

```
frontend/
├── src/
│   ├── __mocks__/          # Mocks globales
│   ├── shared/
│   │   ├── hooks/
│   │   │   └── __tests__/  # Tests de hooks
│   │   └── components/
│   │       └── ui/
│   │           └── __tests__/  # Tests de componentes
│   └── features/
│       └── products/
│           ├── utils/
│           │   └── __tests__/  # Tests de utils
│           └── components/
│               └── __tests__/  # Tests de componentes
├── cypress/
│   ├── e2e/                # Tests E2E
│   ├── component/          # Tests de componentes (Cypress)
│   ├── fixtures/           # Datos de prueba
│   └── support/             # Comandos y configuración
└── jest.config.js          # Configuración Jest
```

## 🧪 Tests Unitarios (Jest)

### 1. Hooks

**Archivos**:
- `src/shared/hooks/__tests__/useLocalStorage.test.ts`
- `src/shared/hooks/__tests__/useDebounce.test.ts`

**Ejecutar**:
```bash
pnpm test useLocalStorage
pnpm test useDebounce
```

### 2. Utils

**Archivos**:
- `src/features/products/utils/__tests__/formatPrice.test.ts`

**Ejecutar**:
```bash
pnpm test formatPrice
```

### 3. Componentes

**Archivos**:
- `src/shared/components/ui/__tests__/LoadingSpinner.test.tsx`
- `src/shared/components/ui/__tests__/ErrorMessage.test.tsx`
- `src/features/products/components/__tests__/ProductCard.test.tsx`

**Ejecutar**:
```bash
pnpm test LoadingSpinner
pnpm test ProductCard
```

## 🔍 Tests E2E (Cypress)

### Ejecutar Cypress

```bash
# Abrir Cypress UI
pnpm exec cypress open

# Ejecutar tests headless
pnpm exec cypress run

# Ejecutar test específico
pnpm exec cypress run --spec "cypress/e2e/home.cy.ts"
```

### Tests E2E Disponibles

1. **Home Page** (`cypress/e2e/home.cy.ts`)
   - Carga de página
   - Lista de productos
   - Navegación a detalle
   - Agregar al carrito

2. **Products Page** (`cypress/e2e/products.cy.ts`)
   - Filtros por categoría
   - Búsqueda
   - Paginación

3. **Cart** (`cypress/e2e/cart.cy.ts`)
   - Agregar productos
   - Actualizar cantidad
   - Remover items

## 📊 Coverage

### Ver coverage

```bash
pnpm test:coverage
```

Esto genera:
- Reporte en terminal
- HTML en `coverage/`
- LCOV en `coverage/lcov.info`

### Coverage mínimo

El proyecto requiere **70%** de coverage (configurado en `jest.config.js`).

## ✍️ Escribir Nuevos Tests

### Test de Hook

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import { useMyHook } from '../useMyHook'

describe('useMyHook', () => {
  it('should work correctly', () => {
    const { result } = renderHook(() => useMyHook())
    
    expect(result.current).toBe(expectedValue)
  })
})
```

### Test de Componente

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle click', () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Test E2E (Cypress)

```typescript
describe('My Feature', () => {
  beforeEach(() => {
    cy.visit('/my-page')
  })

  it('should work correctly', () => {
    cy.get('[data-testid="element"]').should('be.visible')
    cy.contains('Expected Text').click()
    cy.url().should('include', '/expected-path')
  })
})
```

## 🔧 Mocks y Fixtures

### Mocks Globales

Archivos en `src/__mocks__/`:
- `fileMock.js`: Mock para imports de archivos estáticos

### Fixtures de Cypress

Archivos en `cypress/fixtures/`:
- `products.json`: Datos de productos para tests

**Uso**:
```typescript
cy.fixture('products').then((products) => {
  cy.intercept('GET', '/api/products', products)
})
```

## 🎯 Comandos Personalizados (Cypress)

### Comandos disponibles

- `cy.login(email, password)`: Login de usuario
- `cy.addToCart(productId)`: Agregar producto al carrito
- `cy.waitForApi(endpoint)`: Esperar respuesta de API

**Uso**:
```typescript
cy.login('user@example.com', 'password')
cy.addToCart(1)
cy.waitForApi('/api/products')
```

## 📝 Best Practices

### Jest

1. **Usar testing-library**: Para tests de componentes
2. **Mockear dependencias externas**: APIs, localStorage, etc.
3. **Tests aislados**: Cada test debe ser independiente
4. **Nombres descriptivos**: `should display error when API fails`
5. **AAA pattern**: Arrange, Act, Assert

### Cypress

1. **Usar data-testid**: Para elementos de prueba
2. **Evitar waits arbitrarios**: Usar `cy.wait()` para APIs
3. **Tests independientes**: Cada test debe poder ejecutarse solo
4. **Cleanup**: Limpiar estado entre tests
5. **Page Objects**: Para componentes complejos

## 🐛 Troubleshooting

### Tests fallan con imports

Verificar path aliases en `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@features/(.*)$': '<rootDir>/src/features/$1',
  '^@shared/(.*)$': '<rootDir>/src/shared/$1',
}
```

### Cypress no encuentra elementos

- Verificar que el servidor de desarrollo está corriendo
- Usar `cy.wait()` para esperar carga
- Verificar `data-testid` en componentes

### Coverage bajo

```bash
# Ver qué archivos no están cubiertos
pnpm test:coverage
# Revisar reporte HTML en coverage/index.html
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)

