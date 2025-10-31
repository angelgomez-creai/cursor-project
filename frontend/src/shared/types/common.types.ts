/**
 * Tipos comunes compartidos entre features
 */

/**
 * Dirección completa para envíos y facturación
 */
export interface Address {
  id?: number
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  apartment?: string
  isDefault?: boolean
  type?: 'billing' | 'shipping' | 'both'
}

/**
 * Método de pago
 */
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'bank_transfer'
  | 'cash_on_delivery'

/**
 * Información de tarjeta de crédito (para procesamiento)
 */
export interface CreditCardInfo {
  cardNumber: string
  cardHolderName: string
  expiryMonth: number
  expiryYear: number
  cvv: string
  billingAddress?: Address
}

/**
 * Estado de pago
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

/**
 * Información de pago
 */
export interface Payment {
  id: number
  orderId: number
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paidAt?: string
  createdAt: string
}

/**
 * Valoración y reseña de producto
 */
export interface Review {
  id: number
  productId: number
  userId: number
  rating: number // 1-5
  title?: string
  comment?: string
  helpfulCount?: number
  createdAt: string
  updatedAt?: string
  user?: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

/**
 * Wishlist item
 */
export interface WishlistItem {
  id: number
  productId: number
  userId: number
  addedAt: string
  product?: {
    id: number
    name: string
    price: number
    images: string[]
  }
}

/**
 * Notificación
 */
export interface Notification {
  id: number
  userId: number
  type: 'order' | 'product' | 'promotion' | 'system'
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

/**
 * Metadata genérica
 */
export interface Metadata {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Timestamps comunes
 */
export interface Timestamps {
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

