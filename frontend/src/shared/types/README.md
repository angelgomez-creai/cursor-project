# Tipos TypeScript - E-commerce

Este directorio contiene todos los tipos TypeScript compartidos del proyecto e-commerce.

## Estructura

```
shared/types/
├── api.types.ts       # Tipos relacionados con API (responses, errors, paginación)
├── common.types.ts    # Tipos comunes (Address, Payment, Review, etc.)
├── enums.ts           # Enumeraciones y constantes tipadas
├── utils.types.ts     # Utility types y tipos auxiliares
└── index.ts           # Exportaciones centralizadas
```

## Tipos Principales

### API Types (`api.types.ts`)

- `ApiResponse<T>` - Respuesta estándar de API
- `PaginatedResponse<T>` - Respuesta con paginación
- `ApiError` - Error estructurado de API
- `PaginationParams` - Parámetros de paginación
- `SortParams` - Parámetros de ordenamiento
- `AsyncState<T>` - Estado de operación asíncrona

### Common Types (`common.types.ts`)

- `Address` - Dirección completa
- `Payment` - Información de pago
- `PaymentMethod` - Métodos de pago
- `PaymentStatus` - Estados de pago
- `Review` - Reseñas de productos
- `WishlistItem` - Items de lista de deseos
- `Notification` - Notificaciones

### Enums (`enums.ts`)

- `UserRole` - Roles de usuario
- `OrderStatus` - Estados de orden
- `ProductCategory` - Categorías de productos
- `PaymentMethod` - Métodos de pago
- `PaymentStatus` - Estados de pago
- `SortField` - Campos de ordenamiento

### Utility Types (`utils.types.ts`)

- `RequiredFields<T, K>` - Campos requeridos
- `OptionalFields<T, K>` - Campos opcionales
- `PartialUpdate<T>` - Actualizaciones parciales
- `CreateInput<T>` - Input para crear
- `FormState<T>` - Estado de formulario
- `LoadingState<T>` - Estado de carga
- `WithTimestamps<T>` - Con timestamps
- `Paginated<T>` - Con paginación
- `Price`, `Email`, `URL` - Tipos semánticos

## Tipos por Feature

Los tipos específicos de cada feature están en sus respectivos directorios:

- `@features/products/types` - Product, ProductCategory, ProductFilters
- `@features/auth/types` - User, LoginRequest, AuthResponse
- `@features/orders/types` - Order, OrderItem, OrderStatus
- `@features/cart/types` - CartItem, CartSummary

## Uso

```typescript
import type { Address, PaymentMethod } from '@shared/types'
import type { Product } from '@features/products/types'
import type { Order } from '@features/orders/types'
```

## Mejores Prácticas

1. **Usar tipos compartidos** para entidades que se usan en múltiples features
2. **Usar tipos específicos** para lógica interna de cada feature
3. **Re-exportar** tipos comunes desde `index.ts` para facilidad de uso
4. **Documentar** interfaces complejas con JSDoc
5. **Usar utility types** para operaciones comunes (Partial, Omit, etc.)

