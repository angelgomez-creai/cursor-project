/**
 * Tipos específicos del feature Orders
 */

import type { Product, Price } from '@features/products/types'
import type { Address, PaymentMethod, PaymentStatus, Timestamps } from '@shared/types/common.types'

/**
 * Estado de orden
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

/**
 * Item de orden
 */
export interface OrderItem extends Timestamps {
  id: number
  orderId: number
  productId: number
  product?: Product // Producto completo cuando se carga
  productName: string
  productSku: string
  productImage?: string
  quantity: number
  unitPrice: Price
  totalPrice: Price
  discount?: Price
  discountPercentage?: number
}

/**
 * Información de envío
 */
export interface ShippingInfo {
  carrier?: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  shippingCost: Price
  shippingMethod: 'standard' | 'express' | 'overnight'
}

/**
 * Información de facturación
 */
export interface BillingInfo {
  billingAddress: Address
  billingName: string
  billingEmail?: string
  billingPhone?: string
  taxId?: string
}

/**
 * Orden completa
 */
export interface Order extends Timestamps {
  id: number
  orderNumber: string
  userId: number
  items: OrderItem[]
  subtotal: Price
  taxAmount: Price
  shippingAmount: Price
  discountAmount?: Price
  totalAmount: Price
  status: OrderStatus
  shippingAddress: Address
  billingInfo?: BillingInfo
  shippingInfo?: ShippingInfo
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  paymentId?: number
  notes?: string
  cancelledAt?: string
  cancelledReason?: string
}

/**
 * Resumen de orden (para listas)
 */
export type OrderSummary = Pick<
  Order,
  | 'id'
  | 'orderNumber'
  | 'totalAmount'
  | 'status'
  | 'createdAt'
  | 'items'
> & {
  itemCount: number
}

/**
 * Input para crear orden
 */
export interface CreateOrderInput {
  items: Array<{
    productId: number
    quantity: number
  }>
  shippingAddress: Address
  billingInfo?: BillingInfo
  paymentMethod: PaymentMethod
  notes?: string
}

/**
 * Input para actualizar estado de orden
 */
export interface UpdateOrderStatusInput {
  status: OrderStatus
  notes?: string
  trackingNumber?: string
}

/**
 * Filtros para búsqueda de órdenes
 */
export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateFrom?: string
  dateTo?: string
  minAmount?: Price
  maxAmount?: Price
  search?: string
}
