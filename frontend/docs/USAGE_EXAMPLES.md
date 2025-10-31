# Usage Examples

## 📋 Descripción

Ejemplos prácticos de uso de los componentes, hooks y servicios del frontend.

## 🛍️ Products Feature

### useProducts Hook

```typescript
import { useProducts } from '@features/products/hooks'

// Basic usage
const ProductsPage = () => {
  const { data, isLoading, error } = useProducts()
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <div>
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// With filters
const FilteredProducts = () => {
  const { data } = useProducts({
    category: 'electronics',
    minPrice: 100,
    maxPrice: 500,
    page: 1,
    limit: 20
  })
  
  return <ProductList products={data?.data ?? []} />
}
```

### ProductService

```typescript
import { productService } from '@features/products/services'

// Get all products
const products = await productService.getAll()

// Get with pagination
const page2 = await productService.getAll({
  page: 2,
  limit: 10
})

// Get product by ID
const product = await productService.getById(123)

// Search products
const results = await productService.search('laptop', {
  category: 'electronics',
  page: 1
})

// Get categories
const categories = await productService.getCategories()
```

### ProductCard Component

```typescript
import { ProductCard } from '@features/products/components'

// Basic usage
<ProductCard
  product={product}
  onAddToCart={(id) => handleAddToCart(id)}
/>

// With loading state
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  loading={isAddingToCart}
/>
```

---

## 🛒 Cart Feature

### useCart Hook

```typescript
import { useCart } from '@features/cart/hooks'

const CartButton = ({ productId }: { productId: number }) => {
  const { addToCart, items, itemCount, total } = useCart()
  const [loading, setLoading] = useState(false)
  
  const handleAdd = async () => {
    setLoading(true)
    try {
      await addToCart(productId, 1)
      message.success('Producto agregado')
    } catch (error) {
      message.error('Error al agregar producto')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Button onClick={handleAdd} loading={loading}>
        Agregar al Carrito
      </Button>
      <Badge count={itemCount}>
        <ShoppingCartOutlined />
      </Badge>
    </>
  )
}
```

---

## 🔗 Shared Components

### useLocalStorage Hook

```typescript
import { useLocalStorage } from '@shared/hooks'

// Auth token
const [token, setToken] = useLocalStorage<string | null>('auth_token', null)

// User preferences
interface Prefs {
  theme: 'light' | 'dark'
  language: string
}
const [prefs, setPrefs] = useLocalStorage<Prefs>('user_prefs', {
  theme: 'light',
  language: 'en'
})

// Counter with function updater
const [count, setCount] = useLocalStorage('counter', 0)
setCount(prev => prev + 1)
```

### useDebounce Hook

```typescript
import { useDebounce } from '@shared/hooks'

// Search input
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch)
    }
  }, [debouncedSearch])
  
  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar productos..."
    />
  )
}
```

### apiClient

```typescript
import { apiClient } from '@shared/services/apiClient'

// GET request
const products = await apiClient.get<Product[]>('/api/products')

// POST request
const newProduct = await apiClient.post<Product>('/api/products', {
  name: 'New Product',
  price: 99.99
})

// With authentication
apiClient.setAuthToken('jwt-token-here')
const userData = await apiClient.get<User>('/api/user/me')
```

---

## 🔐 Auth Feature

### useAuth Hook

```typescript
import { useAuth } from '@features/auth/hooks'

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return <div>Welcome, {user?.name}</div>
}
```

### AuthGuard Component

```typescript
import { AuthGuard } from '@features/auth/components'

// Protect route
<Route
  path="/profile"
  element={
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  }
/>
```

---

## 📱 Complete Example: Products Page

```typescript
import { useState } from 'react'
import { useProducts } from '@features/products/hooks'
import { useCart } from '@features/cart/hooks'
import { ProductCard } from '@features/products/components'
import { LoadingSpinner, ErrorMessage } from '@shared/components'

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilters>({})
  const { data, isLoading, error } = useProducts(filters)
  const { addToCart } = useCart()
  
  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1)
      message.success('Producto agregado al carrito')
    } catch (error) {
      message.error('Error al agregar producto')
    }
  }
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data || data.data.length === 0) return <Empty description="No hay productos" />
  
  return (
    <div>
      <Filters onFilterChange={setFilters} />
      <Row gutter={[16, 16]}>
        {data.data.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />
          </Col>
        ))}
      </Row>
      <Pagination
        current={data.page}
        total={data.total}
        pageSize={data.limit}
        onChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  )
}
```

---

## 🎯 Best Practices

1. **Error Handling**: Siempre usar try-catch en operaciones async
2. **Loading States**: Mostrar loading mientras se cargan datos
3. **Empty States**: Manejar casos cuando no hay datos
4. **Validation**: Validar inputs antes de enviar
5. **User Feedback**: Mostrar mensajes de éxito/error al usuario

---

## 📚 Más Ejemplos

Ver documentación completa generada por TypeDoc en `docs/` para más ejemplos y detalles de cada componente, hook y servicio.

