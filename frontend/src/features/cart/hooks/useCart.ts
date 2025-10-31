/**
 * Hook principal para gestión del carrito
 * TODO: Implementar cuando se agregue state management (Zustand/Redux)
 */

// import { useCartStore } from '../store/cartStore'
import { cartService } from '../services/cartService'

export const useCart = () => {
  /**
   * Agrega un producto al carrito
   */
  const addToCart = async (productId: number, quantity: number = 1): Promise<void> => {
    try {
      await cartService.addItem(productId, quantity)
      // TODO: Actualizar estado local cuando se implemente store
    } catch (error) {
      throw error
    }
  }

  /**
   * Elimina un item del carrito
   */
  const removeItem = async (productId: number): Promise<void> => {
    try {
      await cartService.removeItem(productId)
      // TODO: Actualizar estado local cuando se implemente store
    } catch (error) {
      throw error
    }
  }

  /**
   * Actualiza la cantidad de un item
   */
  const updateQuantity = async (productId: number, quantity: number): Promise<void> => {
    try {
      if (quantity <= 0) {
        await removeItem(productId)
        return
      }
      await cartService.updateItem(productId, quantity)
      // TODO: Actualizar estado local cuando se implemente store
    } catch (error) {
      throw error
    }
  }

  /**
   * Limpia todo el carrito
   */
  const clearCart = async (): Promise<void> => {
    try {
      await cartService.clearCart()
      // TODO: Actualizar estado local cuando se implemente store
    } catch (error) {
      throw error
    }
  }

  // TODO: Implementar cuando se agregue state management
  // Por ahora retornamos funciones y estado básico
  return {
    items: [],
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    total: 0,
    itemCount: 0,
    isEmpty: true,
  }
}

