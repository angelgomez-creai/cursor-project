# Frontend Integrations

## 📋 Descripción

Este documento describe todas las integraciones del frontend con servicios externos, APIs y librerías.

## 🔌 Integraciones Principales

### 1. Backend API

**Service**: `@shared/services/apiClient`

**Descripción**: Cliente HTTP principal para comunicación con el backend FastAPI.

**Endpoints principales**:
- `/api/products` - Gestión de productos
- `/api/auth` - Autenticación
- `/api/cart` - Carrito de compras
- `/api/orders` - Órdenes

**Configuración**:
```typescript
// Base URL configurada via environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

**Características**:
- Interceptores para autenticación automática
- Manejo de errores centralizado
- Timeout de 10 segundos
- Headers automáticos (Content-Type: application/json)

**Edge Cases**:
- **401 Unauthorized**: Token eliminado automáticamente, requiere re-autenticación
- **Network Error**: Sin retry automático (pendiente implementación)
- **Timeout**: Request cancelado después de 10s

**Ejemplo de uso**:
```typescript
import { apiClient } from '@shared/services/apiClient'

// GET request
const products = await apiClient.get<Product[]>('/api/products')

// POST request
const newProduct = await apiClient.post<Product>('/api/products', {
  name: 'New Product',
  price: 99.99
})
```

---

### 2. React Router

**Service**: `react-router-dom`

**Versión**: ^6.8.0

**Descripción**: Enrutamiento del lado del cliente.

**Configuración**:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
```

**Rutas principales**:
- `/` - HomePage
- `/products` - ProductsPage
- `/products/:id` - ProductDetailPage
- `/cart` - CartPage
- `/login` - LoginPage
- `/register` - RegisterPage
- `/orders` - OrdersPage

**Integración**:
- Usado en `App.tsx` para routing
- Integrado con AuthGuard para rutas protegidas
- Soporte para navegación programática

**Edge Cases**:
- **Ruta no encontrada**: Renderiza ErrorBoundary
- **Redirect después de login**: Implementado en AuthGuard
- **Deep linking**: Soportado con BrowserRouter

---

### 3. Ant Design

**Service**: `antd`

**Versión**: ^5.12.0

**Descripción**: Biblioteca de componentes UI.

**Componentes utilizados**:
- `Layout` - Estructura de página
- `Button` - Botones
- `Card` - Tarjetas
- `Input` - Inputs de formulario
- `Form` - Formularios
- `Table` - Tablas
- `Modal` - Modales
- `Message` - Notificaciones

**Configuración**:
```typescript
import { Button, Card, Layout } from 'antd'
```

**Theming**:
- Configurable via `ConfigProvider`
- Variables CSS customizables
- Tema por defecto

**Edge Cases**:
- **SSR**: Requiere configuración especial
- **Tree shaking**: Solo importar componentes necesarios
- **Bundle size**: ~500KB gzipped (considerar code splitting)

---

### 4. Axios

**Service**: `axios`

**Versión**: ^1.6.0

**Descripción**: Cliente HTTP para requests.

**Uso**:
- Envuelto en `apiClient` para uso consistente
- Interceptores configurados
- Timeout y error handling

**Edge Cases**:
- **CORS**: Requiere configuración en backend
- **CSRF**: No implementado (pendiente)
- **Request cancellation**: No implementado (pendiente)

---

### 5. LocalStorage

**Service**: `localStorage` (Browser API)

**Descripción**: Almacenamiento local del navegador.

**Uso**:
- Tokens de autenticación
- Preferencias de usuario
- Cache temporal

**Wrapper**: `@shared/hooks/useLocalStorage`

**Edge Cases**:
- **Private/Incognito mode**: Puede fallar silenciosamente
- **Quota exceeded**: Requiere manejo de errores
- **SSR**: No disponible en server-side

**Ejemplo**:
```typescript
import { useLocalStorage } from '@shared/hooks'

const [token, setToken] = useLocalStorage<string | null>('auth_token', null)
```

---

### 6. React Query (Planeado)

**Service**: `@tanstack/react-query`

**Estado**: Pendiente implementación

**Propósito**: 
- Caching de requests
- Refetch automático
- Estado de loading/error centralizado

**Migración planificada**:
- Reemplazar implementaciones manuales en hooks
- Implementar en `useProducts`, `useCart`, etc.

---

### 7. Zustand (Planeado)

**Service**: `zustand`

**Estado**: Pendiente implementación

**Propósito**:
- State management global
- Stores por feature (authStore, cartStore, productStore)

**Migración planificada**:
- Reemplazar context API donde sea necesario
- Implementar stores en cada feature

---

## 🔗 Integraciones Externas

### Analytics (Planeado)
- **Google Analytics**: Tracking de eventos
- **Hotjar**: Heatmaps y session recording

### Monitoring (Planeado)
- **Sentry**: Error tracking
- **LogRocket**: Session replay

### Payment (Planeado)
- **Stripe**: Procesamiento de pagos
- **PayPal**: Procesamiento alternativo

---

## 📝 Notas de Integración

### CORS
El backend debe configurar CORS para permitir requests desde el frontend:
```python
# Backend FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://production.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables
```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GA_TRACKING_ID=UA-...
```

### Type Safety
Todas las integraciones están tipadas con TypeScript:
- Tipos compartidos en `@shared/types`
- Tipos por feature en `@features/*/types`

---

## 🐛 Troubleshooting

### API Connection Issues
1. Verificar que backend esté corriendo
2. Verificar CORS configuration
3. Verificar VITE_API_URL en `.env`

### Ant Design Styling
1. Verificar import de estilos CSS
2. Verificar ConfigProvider wrapper
3. Verificar variables CSS customizadas

### LocalStorage Issues
1. Verificar que no esté en modo privado
2. Verificar quota disponible
3. Usar try-catch en operaciones críticas

