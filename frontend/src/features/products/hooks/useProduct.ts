// TODO: Instalar @tanstack/react-query para usar este hook
// import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import type { Product } from '../types'

/**
 * Hook para obtener un producto individual por ID
 * @param productId - ID del producto
 * 
 * TODO: Implementar con React Query cuando esté instalado
 */
export const useProduct = (productId: number | null) => {
  // Implementación temporal sin React Query
  // TODO: Reemplazar con React Query
  return {
    data: null as Product | null,
    isLoading: false,
    error: null as Error | null,
    refetch: async () => {
      if (!productId) return null
      return productService.getById(productId)
    },
  }
}

