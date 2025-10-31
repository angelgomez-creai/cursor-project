# Ejemplos de Estructura Feature-Based para E-commerce

## 📦 Feature: Products

### Estructura Completa
```
features/products/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.test.tsx
│   │   ├── ProductCard.module.css
│   │   └── index.ts
│   ├── ProductList/
│   │   ├── ProductList.tsx
│   │   ├── ProductList.test.tsx
│   │   └── index.ts
│   ├── ProductFilters/
│   │   ├── ProductFilters.tsx
│   │   ├── PriceFilter.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── index.ts
│   ├── ProductSearch/
│   │   ├── ProductSearch.tsx
│   │   └── index.ts
│   └── ProductDetail/
│       ├── ProductDetail.tsx
│       ├── ProductImages.tsx
│       ├── ProductInfo.tsx
│       └── index.ts
│
├── hooks/
│   ├── useProducts.ts          # Fetch lista de productos
│   ├── useProduct.ts           # Fetch producto individual
│   ├── useProductFilters.ts    # Lógica de filtros
│   ├── useProductSearch.ts     # Lógica de búsqueda
│   └── useProductCategories.ts # Fetch categorías
│
├── services/
│   └── productService.ts       # Llamadas a API de productos
│
├── store/                       # Estado global del feature
│   └── productSlice.ts         # Redux slice o Zustand store
│
├── types/
│   └── product.types.ts        # Tipos específicos del feature
│
├── utils/                       # Utilidades específicas
│   ├── formatPrice.ts
│   ├── formatProduct.ts
│   └── productHelpers.ts
│
└── pages/
    ├── ProductsPage.tsx        # Lista de productos
    ├── ProductDetailPage.tsx   # Detalle de producto
    └── ProductSearchPage.tsx   # Búsqueda de productos
```

### Ejemplo de Código

#### `features/products/types/product.types.ts`
```typescript
export interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: ProductCategory
  description: string
  images: string[]
  sku: string
  rating?: number
  reviewCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ProductCategory = 
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'sports'
  | 'books'

export interface ProductFilters {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'price' | 'name' | 'rating' | 'date'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedProducts {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

#### `features/products/services/productService.ts`
```typescript
import { apiClient } from '@shared/services/api'
import type { Product, ProductFilters, PaginatedProducts } from '../types/product.types'

export const productService = {
  async getAll(filters?: ProductFilters): Promise<PaginatedProducts> {
    return apiClient.get<PaginatedProducts>('/api/products', { params: filters })
  },

  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`)
  },

  async search(query: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/api/products/search', { params: { q: query } })
  },

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/api/products/categories')
  }
}
```

#### `features/products/hooks/useProducts.ts`
```typescript
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import type { ProductFilters, PaginatedProducts } from '../types/product.types'

export const useProducts = (filters?: ProductFilters) => {
  return useQuery<PaginatedProducts, Error>({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
```

#### `features/products/components/ProductCard/ProductCard.tsx`
```typescript
import React from 'react'
import { Card, Button, Tag, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { formatPrice } from '../../utils/formatPrice'
import type { Product } from '../../types/product.types'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number) => void
  loading?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  loading = false
}) => {
  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <img
          alt={product.name}
          src={product.images[0]}
          className={styles.image}
        />
      }
      actions={[
        <Button
          key="cart"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(product.id)}
          loading={loading}
        >
          Add to Cart
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <div>
            <Typography.Title level={5}>{product.name}</Typography.Title>
            <Tag>{product.category}</Tag>
          </div>
        }
        description={
          <div>
            <Typography.Paragraph ellipsis={{ rows: 2 }}>
              {product.description}
            </Typography.Paragraph>
            <Typography.Title level={4} className={styles.price}>
              {formatPrice(product.price)}
            </Typography.Title>
          </div>
        }
      />
    </Card>
  )
}
```

---

## 🛒 Feature: Cart

### Estructura Completa
```
features/cart/
├── components/
│   ├── CartItem/
│   │   ├── CartItem.tsx
│   │   ├── CartItem.test.tsx
│   │   └── index.ts
│   ├── CartSummary/
│   │   ├── CartSummary.tsx
│   │   └── index.ts
│   ├── CartDropdown/
│   │   ├── CartDropdown.tsx
│   │   └── index.ts
│   └── EmptyCart/
│       ├── EmptyCart.tsx
│       └── index.ts
│
├── hooks/
│   ├── useCart.ts              # Hook principal del carrito
│   ├── useCartTotal.ts        # Cálculo de totales
│   └── useCartItems.ts        # Gestión de items
│
├── services/
│   └── cartService.ts         # API calls del carrito
│
├── store/
│   └── cartStore.ts           # Zustand store del carrito
│
├── types/
│   └── cart.types.ts
│
└── pages/
    └── CartPage.tsx
```

### Ejemplo de Código

#### `features/cart/store/cartStore.ts` (Zustand)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types/cart.types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { product, quantity, addedAt: new Date().toISOString() }]
          })
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      }
    }
  )
)
```

#### `features/cart/hooks/useCart.ts`
```typescript
import { useCartStore } from '../store/cartStore'
import { productService } from '@features/products/services/productService'
import { message } from 'antd'

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  } = useCartStore()

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const product = await productService.getById(productId)
      
      if (product.stock < quantity) {
        message.error('No hay suficiente stock disponible')
        return
      }
      
      addItem(product, quantity)
      message.success('Producto agregado al carrito')
    } catch (error) {
      message.error('Error al agregar producto al carrito')
    }
  }

  return {
    items,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
    isEmpty: items.length === 0
  }
}
```

---

## 🔐 Feature: Auth

### Estructura Completa
```
features/auth/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   ├── RegisterForm/
│   │   ├── RegisterForm.tsx
│   │   └── index.ts
│   └── AuthGuard/
│       ├── AuthGuard.tsx
│       └── index.ts
│
├── hooks/
│   ├── useAuth.ts             # Estado de autenticación
│   ├── useLogin.ts            # Hook de login
│   └── useLogout.ts           # Hook de logout
│
├── services/
│   └── authService.ts         # API calls de auth
│
├── store/
│   └── authStore.ts           # Estado global de auth
│
├── types/
│   └── auth.types.ts
│
└── pages/
    ├── LoginPage.tsx
    └── RegisterPage.tsx
```

### Ejemplo de Código

#### `features/auth/store/authStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthResponse } from '../types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (authResponse: AuthResponse) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (authResponse) => {
        set({
          user: authResponse.user,
          token: authResponse.token,
          isAuthenticated: true
        })
        // Guardar token en localStorage para interceptors
        localStorage.setItem('auth_token', authResponse.token)
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        localStorage.removeItem('auth_token')
      },
      
      updateUser: (userUpdates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null
        }))
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
```

---

## 🎨 Shared Components

### Estructura de Header Refactorizado

```
shared/components/layout/Header/
├── Header.tsx                 # Componente principal
├── Navigation.tsx              # Menú de navegación
├── UserMenu.tsx               # Menú de usuario (dropdown)
├── CartIcon.tsx               # Icono del carrito con badge
├── SearchBar.tsx              # Barra de búsqueda
└── index.ts
```

#### `shared/components/layout/Header/Header.tsx`
```typescript
import React from 'react'
import { Layout } from 'antd'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'
import { CartIcon } from './CartIcon'
import { SearchBar } from './SearchBar'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  return (
    <Layout.Header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          🛒 E-commerce
        </div>
        
        <Navigation />
        
        <div className={styles.actions}>
          <SearchBar />
          <CartIcon />
          <UserMenu />
        </div>
      </div>
    </Layout.Header>
  )
}
```

---

## 📁 Convenciones de Archivos

### Naming Conventions
- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useProducts.ts`)
- **Servicios**: camelCase con sufijo `Service` (`productService.ts`)
- **Tipos**: camelCase con sufijo `.types.ts` (`product.types.ts`)
- **Tests**: Mismo nombre + `.test.tsx` (`ProductCard.test.tsx`)
- **Estilos**: Mismo nombre + `.module.css` (`ProductCard.module.css`)

### Exports
Cada carpeta debe tener un `index.ts` que exporte los elementos públicos:

```typescript
// features/products/components/ProductCard/index.ts
export { ProductCard } from './ProductCard'
export type { ProductCardProps } from './ProductCard'
```

---

## 🔗 Dependencias entre Features

### Reglas de Dependencias

```
✅ Permitido:
- features/products → shared/
- features/cart → shared/
- features/cart → features/products (tipos solamente)

❌ NO Permitido:
- features/products → features/cart
- features/auth → features/products
- shared/ → features/
```

### Ejemplo de Comunicación entre Features

```typescript
// features/cart/hooks/useCart.ts
import type { Product } from '@features/products/types/product.types' // ✅ OK
import { productService } from '@features/products/services/productService' // ⚠️ Considerar mover a shared si es reutilizable
```

Si necesitas compartir lógica entre features, muévela a `shared/`:
```typescript
// shared/utils/productUtils.ts
export const formatProductPrice = (price: number) => { ... }
```

---

## 📊 Ventajas de Esta Estructura

1. **Organización Clara**: Todo el código de un feature está junto
2. **Escalabilidad**: Fácil agregar nuevos features
3. **Mantenibilidad**: Cambios en un feature no afectan otros
4. **Testing**: Cada feature puede testearse independientemente
5. **Colaboración**: Múltiples desarrolladores pueden trabajar en paralelo
6. **Type Safety**: Tipos co-localizados con el código que los usa
7. **Code Splitting**: Lazy loading por feature mejora performance
8. **Documentación**: Estructura auto-documentada

