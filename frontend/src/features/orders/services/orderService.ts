import { apiClient } from '@shared/services/apiClient'
import type { Order } from '../types'

/**
 * Servicio para operaciones relacionadas con órdenes
 */
export const orderService = {
  /**
   * Obtiene todas las órdenes del usuario actual
   */
  async getAll(): Promise<Order[]> {
    return apiClient.get<Order[]>('/api/orders')
  },

  /**
   * Obtiene una orden por ID
   */
  async getById(orderId: number): Promise<Order> {
    return apiClient.get<Order>(`/api/orders/${orderId}`)
  },

  /**
   * Crea una nueva orden desde el carrito
   */
  async create(cartItems: any[], shippingAddress: string): Promise<Order> {
    return apiClient.post<Order>('/api/orders', {
      items: cartItems,
      shippingAddress,
    })
  },

  /**
   * Cancela una orden
   */
  async cancel(orderId: number): Promise<Order> {
    return apiClient.post<Order>(`/api/orders/${orderId}/cancel`)
  },
}

