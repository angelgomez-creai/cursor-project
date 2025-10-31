/**
 * Tipos específicos del feature Cart
 */

import type { Product, Price } from '@features/products/types'
import type { Timestamps } from '@shared/types/common.types'

/**
 * Item del carrito
 */
export interface CartItem extends Timestamps {
  id?: number
  productId: number
  product: Product // Producto completo
  quantity: number
  addedAt: string
  notes?: string
  selectedOptions?: Record<string, string | number> // Para variantes del producto
}

/**
 * Resumen del carrito
 */
export interface CartSummary {
  subtotal: Price
  tax: Price
  shipping: Price
  discount?: Price
  total: Price
  itemCount: number
  uniqueItemCount: number
}

/**
 * Carrito completo
 */
export interface Cart {
  items: CartItem[]
  summary: CartSummary
  userId?: number
  sessionId?: string
  expiresAt?: string
}

/**
 * Input para agregar item al carrito
 */
export interface AddToCartInput {
  productId: number
  quantity: number
  selectedOptions?: Record<string, string | number>
  notes?: string
}

/**
 * Input para actualizar item del carrito
 */
export interface UpdateCartItemInput {
  quantity: number
  selectedOptions?: Record<string, string | number>
  notes?: string
}
