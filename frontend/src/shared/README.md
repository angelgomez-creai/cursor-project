# Shared Directory

Este directorio contiene código reutilizable compartido entre features.

## Estructura

```
shared/
├── components/         # Componentes UI reutilizables
│   ├── ui/            # Componentes base (Button, Input, etc.)
│   ├── layout/        # Componentes de layout (Header, Footer)
│   └── feedback/      # Componentes de feedback (ErrorBoundary, Loading)
├── hooks/             # Hooks genéricos reutilizables
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── services/          # Servicios compartidos
│   └── apiClient.ts   # Cliente API principal
├── utils/             # Utilidades generales
│   ├── formatters/    # Formateo (currency, date)
│   ├── validators/    # Validación de datos
│   └── helpers/       # Helpers generales
└── types/             # Tipos compartidos
    └── index.ts
```

## Componentes

### UI Components
Componentes base de UI que pueden ser utilizados en cualquier feature:
- `Button`: Wrapper de Ant Design Button
- `LoadingSpinner`: Spinner de carga
- `ErrorMessage`: Mensaje de error

### Layout Components
Componentes de estructura de la aplicación:
- `Header`: Encabezado principal
- `Footer`: Pie de página

### Feedback Components
Componentes para mostrar estados al usuario:
- `ErrorBoundary`: Captura errores de React

## Hooks

### useLocalStorage
Hook para manejar localStorage de forma reactiva.

```typescript
const [value, setValue] = useLocalStorage('key', initialValue)
```

### useDebounce
Hook para debounce de valores.

```typescript
const debouncedValue = useDebounce(value, 500)
```

### useMediaQuery
Hook para detectar media queries.

```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
```

## Utils

### Formatters
Utilidades para formateo:
- `formatCurrency`: Formatea números como moneda
- `formatDate`: Formatea fechas

### Validators
Utilidades de validación:
- `isValidEmail`: Valida email
- `isValidPassword`: Valida contraseña
- `isValidPhone`: Valida teléfono

### Helpers
Utilidades generales:
- `cn`: Combina clases CSS
- `truncate`: Trunca texto
- `generateId`: Genera ID único

## Servicios

### apiClient
Cliente HTTP compartido para todas las llamadas a API.
- Interceptores configurados
- Manejo de autenticación
- Manejo de errores centralizado

## Principios

1. **Reutilización**: Solo código que se usa en múltiples features
2. **Independencia**: Shared no debe depender de features
3. **Generalidad**: Código genérico, no específico de dominio
4. **Documentación**: Cada utilidad debe estar documentada

