# Edge Cases y Manejo de Errores

## 📋 Descripción

Este documento documenta todos los edge cases identificados y cómo el frontend los maneja.

## 🛍️ Products Feature

### 1. ProductService

#### `getById(id: number)`

**Edge Cases**:
- ✅ **ID inválido** (null, undefined, 0, negativo): Valida y lanza error
- ✅ **ID no numérico**: Valida tipo y lanza error
- ⚠️ **Producto no existe**: Backend retorna 404, no manejado específicamente
- ⚠️ **Network error**: Sin retry, error propagado al componente

**Manejo actual**:
```typescript
if (!id || typeof id !== 'number' || id <= 0) {
  throw new Error('ID de producto inválido')
}
```

**Mejoras sugeridas**:
- Manejo específico de 404
- Retry logic para network errors
- Cache de productos recientes

---

#### `search(query: string)`

**Edge Cases**:
- ✅ **Query vacío**: Valida y lanza error
- ✅ **Query solo espacios**: Trim aplicado
- ⚠️ **Query con caracteres especiales**: No sanitizado (backend debería manejar)
- ⚠️ **Timeout en búsqueda**: Sin timeout específico

**Manejo actual**:
```typescript
if (!query || typeof query !== 'string' || query.trim().length === 0) {
  throw new Error('Término de búsqueda inválido')
}
```

**Mejoras sugeridas**:
- Debounce automático en el hook
- Sanitización de input
- Rate limiting en el cliente

---

#### `getAll(filters?: ProductFilters)`

**Edge Cases**:
- ⚠️ **Filtros inválidos**: No validados en cliente
- ⚠️ **Paginación desbordada**: No manejado
- ⚠️ **Ordenamiento inválido**: No validado

**Mejoras sugeridas**:
- Validación de filtros con Zod/Yup
- Límites de paginación
- Enum validation para ordenamiento

---

### 2. ProductCard Component

**Edge Cases**:
- ✅ **Sin imagen**: Fallback a placeholder
- ✅ **Precio inválido**: Formateado a "0"
- ⚠️ **Stock negativo**: No validado visualmente
- ⚠️ **Producto sin descripción**: UI puede romperse

**Manejo actual**:
```typescript
// Image fallback
onError={(e) => {
  e.currentTarget.src = '/placeholder.png'
}}

// Price validation
const displayPrice = isNaN(price) || !isFinite(price) || price < 0 ? 0 : price
```

---

## 🛒 Cart Feature

### 1. useCart Hook

**Edge Cases**:
- ⚠️ **Agregar producto duplicado**: No prevenido, puede duplicarse
- ⚠️ **Cantidad excede stock**: No validado antes de agregar
- ⚠️ **Carrito vacío**: No manejado específicamente
- ⚠️ **Persistencia fallida**: localStorage puede fallar silenciosamente

**Mejoras sugeridas**:
```typescript
// Prevenir duplicados
const addToCart = (product: Product) => {
  if (items.some(item => item.productId === product.id)) {
    // Actualizar cantidad existente
    updateQuantity(product.id, items.find(i => i.productId === product.id)!.quantity + 1)
    return
  }
  // Agregar nuevo item
}

// Validar stock
if (quantity > product.stock) {
  throw new Error('Cantidad excede stock disponible')
}
```

---

### 2. CartService

**Edge Cases**:
- ⚠️ **Item eliminado del backend**: No sincronizado con frontend
- ⚠️ **Precio cambiado**: No actualizado en carrito
- ⚠️ **Producto discontinuado**: No removido automáticamente

**Mejoras sugeridas**:
- Sync periódico con backend
- Validación de precios antes de checkout
- Remover items de productos eliminados

---

## 🔐 Auth Feature

### 1. useAuth Hook

**Edge Cases**:
- ⚠️ **Token expirado**: No detectado automáticamente
- ⚠️ **Refresh token**: No implementado
- ⚠️ **Concurrent logins**: No manejado
- ⚠️ **Session timeout**: No detectado

**Mejoras sugeridas**:
```typescript
// Token expiration check
const isTokenExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return payload.exp * 1000 < Date.now()
}

// Auto refresh
const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) throw new Error('No refresh token')
  
  const newToken = await authService.refresh(refresh)
  setAuthToken(newToken)
}
```

---

### 2. AuthGuard Component

**Edge Cases**:
- ⚠️ **Redirect loop**: Si login falla repetidamente
- ⚠️ **Protected route access**: No logueado puede acceder temporalmente
- ⚠️ **Role-based access**: No implementado

**Mejoras sugeridas**:
- Contador de intentos de login
- Verificación inmediata de auth state
- Role checking antes de render

---

## 🔗 Shared Components

### 1. apiClient

**Edge Cases**:
- ✅ **401 Unauthorized**: Token eliminado, pero no redirect automático
- ⚠️ **Network timeout**: Sin retry
- ⚠️ **CORS error**: No manejado específicamente
- ⚠️ **Request cancellation**: No implementado

**Mejoras sugeridas**:
```typescript
// Retry logic
const retryRequest = async (fn: () => Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// Request cancellation
const cancelTokenSource = axios.CancelToken.source()
const request = apiClient.get('/api/products', {
  cancelToken: cancelTokenSource.token
})
// Later: cancelTokenSource.cancel('Operation cancelled')
```

---

### 2. ErrorBoundary

**Edge Cases**:
- ⚠️ **Error en error handler**: No manejado (fallback UI necesario)
- ⚠️ **Memory leaks**: Event listeners no limpiados
- ⚠️ **Error en async code**: No capturado (necesita try-catch en componentes)

**Mejoras sugeridas**:
- Error boundary anidado para el error handler
- Cleanup en useEffect
- Async error boundary con react-error-boundary

---

### 3. useLocalStorage Hook

**Edge Cases**:
- ✅ **SSR**: Devuelve initialValue
- ⚠️ **Quota exceeded**: No manejado
- ⚠️ **Private mode**: Falla silenciosamente

**Mejoras sugeridas**:
```typescript
const setValue = (value: T) => {
  try {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      // Quota exceeded
      console.error('LocalStorage quota exceeded')
      // Fallback to in-memory storage
    }
  }
}
```

---

## 📱 Responsive / Performance

### 1. Image Loading

**Edge Cases**:
- ✅ **Slow network**: Lazy loading con IntersectionObserver
- ⚠️ **Image format**: No se verifica soporte de WebP/AVIF
- ⚠️ **Large images**: No se optimiza tamaño

**Mejoras sugeridas**:
- Picture element con srcset
- Responsive images con sizes
- Progressive image loading

---

### 2. Infinite Scroll (Planeado)

**Edge Cases a considerar**:
- **Scroll muy rápido**: Throttle necesario
- **Network lento**: Loading states
- **Out of memory**: Virtual scrolling para listas grandes

---

## 🔄 State Management

### 1. React State

**Edge Cases**:
- ⚠️ **Race conditions**: En requests async
- ⚠️ **Stale closures**: En callbacks
- ⚠️ **Memory leaks**: useEffect sin cleanup

**Mejoras sugeridas**:
- AbortController para cancelar requests
- useCallback/useMemo para estabilidad
- Cleanup en useEffect

---

## 📊 Data Validation

### 1. Type Safety

**Edge Cases**:
- ⚠️ **Runtime type mismatches**: Backend puede retornar tipos diferentes
- ⚠️ **Null/undefined**: No siempre manejado

**Mejoras sugeridas**:
- Runtime validation con Zod
- Strict null checks
- Type guards

```typescript
// Type guard example
function isProduct(data: any): data is Product {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'number' &&
    typeof data.name === 'string' &&
    typeof data.price === 'number'
  )
}
```

---

## 🎯 Mejores Prácticas para Edge Cases

1. **Siempre validar inputs**: En servicios y componentes
2. **Manejar errores explícitamente**: Try-catch en operaciones críticas
3. **Proveer fallbacks**: UI alternativas cuando algo falla
4. **Logging**: Registrar errores para debugging
5. **Testing**: Unit tests para edge cases identificados
6. **Documentación**: Documentar todos los edge cases conocidos

---

## 📝 Checklist de Edge Cases por Feature

### Products
- [x] ID inválido en getById
- [x] Query vacío en search
- [x] Imagen fallida en ProductCard
- [ ] Producto no encontrado (404)
- [ ] Paginación desbordada
- [ ] Filtros inválidos

### Cart
- [ ] Producto duplicado
- [ ] Stock excedido
- [ ] Persistencia fallida
- [ ] Sincronización con backend

### Auth
- [ ] Token expirado
- [ ] Refresh token
- [ ] Redirect loop
- [ ] Role-based access

### Shared
- [x] 401 Unauthorized
- [ ] Network timeout
- [ ] CORS error
- [ ] LocalStorage quota

