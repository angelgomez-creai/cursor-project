/**
 * Enums y constantes tipadas para el proyecto
 */

/**
 * Roles de usuario
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

/**
 * Estados de orden
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Categorías de productos
 */
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  HOME = 'home',
  SPORTS = 'sports',
  BOOKS = 'books',
  BEAUTY = 'beauty',
  TOYS = 'toys',
  FOOD = 'food',
}

/**
 * Métodos de pago
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

/**
 * Estados de pago
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

/**
 * Tipos de notificación
 */
export enum NotificationType {
  ORDER = 'order',
  PRODUCT = 'product',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

/**
 * Campos de ordenamiento
 */
export enum SortField {
  PRICE = 'price',
  NAME = 'name',
  RATING = 'rating',
  DATE = 'date',
  POPULARITY = 'popularity',
}

