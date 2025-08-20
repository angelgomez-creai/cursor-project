// ====== SHARED TYPES ======
// ❌ PROBLEMA: Types muy básicos sin validation avanzada
// ❌ PROBLEMA: No branded types para type safety
// ❌ PROBLEMA: No utility types para transformaciones

// ❌ PROBLEMA: Product interface sin validaciones avanzadas
// ❌ PROBLEMA: No computed properties o getters
// ❌ PROBLEMA: Price como number sin decimal precision handling
export interface Product {
  id: number
  name: string
  price: number // ❌ PROBLEMA: Should be branded type for currency
  stock: number
  category: string // ❌ PROBLEMA: Should be enum or union type
  description?: string
  image?: string // ❌ PROBLEMA: Should be array of images
  isActive?: boolean
  createdAt?: string // ❌ PROBLEMA: Should be Date type with proper handling
  updatedAt?: string
  // ❌ PROBLEMA: Missing fields: SKU, weight, dimensions, ratings, etc.
}

// ❌ PROBLEMA: User interface muy básica
// ❌ PROBLEMA: No role-based fields
// ❌ PROBLEMA: No address management
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  // ❌ PROBLEMA: Missing fields: role, avatar, phone, address, preferences
}

// ❌ PROBLEMA: OrderItem sin business validation rules
export interface OrderItem {
  id?: number
  productId: number
  productName: string
  quantity: number // ❌ PROBLEMA: No min/max validation
  unitPrice: number // ❌ PROBLEMA: Currency handling
  totalPrice: number // ❌ PROBLEMA: Should be computed, not stored
  // ❌ PROBLEMA: Missing: product image, SKU, discount info
}

// ❌ PROBLEMA: Order interface sin workflow states apropiados
// ❌ PROBLEMA: Status como string literal - should be more structured
export interface Order {
  id?: number
  userId: number
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  shippingAmount: number
  totalAmount: number // ❌ PROBLEMA: Should be computed
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string // ❌ PROBLEMA: Should be structured address
  paymentMethod: string // ❌ PROBLEMA: Should be enum
  trackingNumber?: string
  createdAt?: string
  updatedAt?: string
  // ❌ PROBLEMA: Missing: billing address, payment status, refund info
}

// ❌ PROBLEMA: CartItem muy simple sin persistence logic
export interface CartItem {
  product: Product
  quantity: number
  // ❌ PROBLEMA: Missing: addedAt, selectedOptions, saved for later
}

// ❌ PROBLEMA: ApiResponse genérico muy básico
// ❌ PROBLEMA: No pagination info
// ❌ PROBLEMA: No metadata fields
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
  // ❌ PROBLEMA: Missing: pagination, metadata, request ID, timestamp
}

// ❌ PROBLEMA: PaginationParams sin sorting y advanced filtering
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  // ❌ PROBLEMA: Missing: sort, order, filters array, facets
}

// ❌ PROBLEMA: Auth types sin security considerations
// ❌ PROBLEMA: No password strength validation
// ❌ PROBLEMA: No multi-factor auth support
export interface LoginRequest {
  email: string
  password: string
  // ❌ PROBLEMA: Missing: rememberMe, captcha, MFA code
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  // ❌ PROBLEMA: Missing: terms acceptance, password confirmation, phone
}

// ❌ PROBLEMA: AuthResponse sin refresh token
// ❌ PROBLEMA: No token expiry information
export interface AuthResponse {
  token: string // ❌ PROBLEMA: Should include refresh token
  user: User
  // ❌ PROBLEMA: Missing: refreshToken, expiresAt, tokenType
}

// ❌ PROBLEMA: ApiError muy básico sin error codes
// ❌ PROBLEMA: No internationalization support
// ❌ PROBLEMA: No error tracking ID
export interface ApiError {
  message: string
  status: number
  details?: any
  // ❌ PROBLEMA: Missing: errorCode, trackingId, timestamp, i18nKey
}

// ❌ PROBLEMA: No utility types para:
// - Partial updates
// - Form states
// - Loading states  
// - Error states
// - Async operations
// - Brand types para type safety

// ❌ PROBLEMA: No enums para constants
// ❌ PROBLEMA: No discriminated unions para complex states
// ❌ PROBLEMA: No generic constraints para reusability