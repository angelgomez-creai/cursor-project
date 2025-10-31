# ADR-001: Selección de Zustand para State Management

## Status
**Aceptado** — 2024-11-15

## Contexto
Necesitamos una solución de gestión de estado que:
- Maneje estado global complejo
- Tenga excelente soporte TypeScript
- Sea performante con re-renders mínimos
- Ofrezca buena developer experience

## Decisión
Adoptar **Zustand** como solución principal de state management.

## Justificación

### Pros de Zustand
- API minimalista y simple
- TypeScript support nativo
- No requiere providers/context wrapping
- Bundle size pequeño (2.9kb)
- Subscripción granular al estado

### Alternativas Evaluadas
- **Redux Toolkit**: Demasiado boilerplate, curva de aprendizaje empinada
- **Recoil**: Experimental, documentación limitada
- **Context API**: Performance issues con estado complejo

## Consecuencias

### Positivas
- Desarrollo más rápido
- Mejor TypeScript experience
- Bundle size optimizado
- Testing más simple

### Negativas
- Ecosistema menor vs Redux
- Algunas funcionalidades avanzadas requieren implementación custom

## Implementación
```typescript
// stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));