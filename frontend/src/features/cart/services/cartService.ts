import { apiClient } from '@shared/services/apiClient'
import type { CartItem } from '../types'

/**
 * Servicio para operaciones relacionadas con el carrito
 */
export const cartService = {
  /**
   * Obtiene el carrito del usuario actual
   */
  async getCart(): Promise<CartItem[]> {
    return apiClient.get<CartItem[]>('/api/cart')
  },

  /**
   * Agrega un producto al carrito
   */
  async addItem(productId: number, quantity: number): Promise<CartItem> {
    return apiClient.post<CartItem>('/api/cart/items', {
      productId,
      quantity,
    })
  },

  /**
   * Actualiza la cantidad de un item en el carrito
   */
  async updateItem(productId: number, quantity: number): Promise<CartItem> {
    return apiClient.put<CartItem>(`/api/cart/items/${productId}`, {
      quantity,
    })
  },

  /**
   * Elimina un item del carrito
   */
  async removeItem(productId: number): Promise<void> {
    return apiClient.delete(`/api/cart/items/${productId}`)
  },

  /**
   * Limpia todo el carrito
   */
  async clearCart(): Promise<void> {
    return apiClient.delete('/api/cart')
  },
}

