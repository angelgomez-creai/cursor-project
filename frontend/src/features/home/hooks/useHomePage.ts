import { useCallback } from 'react'
import { message } from 'antd'
import { useProducts } from '@features/products/hooks'

/**
 * Hook personalizado para la lógica de la página Home
 */
export const useHomePage = () => {
  const { data: productsData, isLoading, error } = useProducts()

  /**
   * Maneja la adición de un producto al carrito
   */
  const handleAddToCart = useCallback((productId: number) => {
    // TODO: Implementar con hook useCart cuando esté disponible
    message.info(`Agregando producto ${productId} al carrito...`)
    // Aquí se integrará con el hook useCart del feature cart
  }, [])

  /**
   * Maneja la adición de un producto a la lista de deseos
   */
  const handleAddToWishlist = useCallback((productId: number) => {
    // TODO: Implementar con hook useWishlist cuando esté disponible
    message.info(`Agregando producto ${productId} a la lista de deseos...`)
  }, [])

  return {
    products: productsData?.data ?? [],
    isLoading,
    error,
    handleAddToCart,
    handleAddToWishlist,
    isEmpty: !productsData || productsData.data.length === 0,
  }
}

