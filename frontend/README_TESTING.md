# Testing Guide - Frontend

## 📋 Descripción

Guía completa para testing del frontend con Jest y React Testing Library.

## 🧪 Configuración

### Dependencias

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.1",
    "identity-obj-proxy": "^3.0.0"
  }
}
```

### Archivos de Configuración

- **`jest.config.js`** - Configuración principal de Jest
- **`src/setupTests.ts`** - Setup global para tests
- **`src/__mocks__/fileMock.js`** - Mock para imports de archivos estáticos

## 🚀 Comandos

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# CI mode
pnpm test:ci
```

## 📝 Escribir Tests

### Ejemplo Básico

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Ejemplo con User Events

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should handle click', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📊 Coverage

Coverage mínimo configurado: **70%**

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🔧 Path Aliases

Los path aliases están configurados en Jest:

- `@/` → `src/`
- `@features/` → `src/features/`
- `@shared/` → `src/shared/`

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

