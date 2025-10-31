# Features Directory

Este directorio contiene todos los features de la aplicación organizados siguiendo la arquitectura Feature-Based.

## Estructura por Feature

Cada feature sigue esta estructura estándar:

```
feature-name/
├── components/          # Componentes específicos del feature
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       └── index.ts
├── hooks/              # Custom hooks del feature
│   └── useFeature.ts
├── services/           # Servicios API del feature
│   └── featureService.ts
├── store/              # Estado global del feature (Zustand/Redux)
│   └── featureStore.ts
├── types/              # Tipos TypeScript específicos
│   └── feature.types.ts
├── utils/              # Utilidades específicas
│   └── featureUtils.ts
├── pages/              # Páginas del feature
│   └── FeaturePage.tsx
└── index.ts           # Exportaciones públicas
```

## Features Disponibles

### 🛍️ Products
Gestión de productos del e-commerce.
- **Componentes**: ProductCard, ProductList
- **Hooks**: useProducts, useProduct
- **Servicios**: productService
- **Páginas**: ProductsPage, ProductDetailPage

### 🛒 Cart
Carrito de compras del usuario.
- **Componentes**: CartItem, CartSummary
- **Hooks**: useCart
- **Servicios**: cartService
- **Páginas**: CartPage

### 🔐 Auth
Autenticación y autorización.
- **Componentes**: LoginForm, AuthGuard
- **Hooks**: useAuth, useLogin
- **Servicios**: authService
- **Páginas**: LoginPage, RegisterPage

### 📦 Orders
Gestión de órdenes.
- **Componentes**: OrderCard
- **Hooks**: useOrders
- **Servicios**: orderService
- **Páginas**: OrdersPage, OrderDetailPage

## Principios

1. **Co-localización**: Todo el código de un feature está junto
2. **Encapsulación**: Features son independientes entre sí
3. **Dependencias**: features → shared → app (unidireccional)
4. **Exportaciones**: Solo exportar lo necesario vía index.ts

## Agregar un Nuevo Feature

1. Crear carpeta en `features/` con nombre del feature
2. Seguir la estructura estándar
3. Crear tipos en `types/`
4. Crear servicios en `services/`
5. Crear componentes en `components/`
6. Crear hooks en `hooks/`
7. Exportar públicamente en `index.ts`

