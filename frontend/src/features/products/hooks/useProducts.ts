// TODO: Instalar @tanstack/react-query para usar este hook
// import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import type { ProductFilters, PaginatedProducts } from '../types'

/**
 * Hook for fetching products list
 * 
 * @param {ProductFilters} [filters] - Optional filters for pagination, sorting, and filtering
 * @returns {Object} Products query result
 * @returns {PaginatedProducts | null} returns.data - Products data or null if not loaded
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Error | null} returns.error - Error object or null
 * @returns {Function} returns.refetch - Function to refetch products
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useProducts()
 * 
 * // With filters
 * const { data, isLoading } = useProducts({
 *   category: 'electronics',
 *   page: 1,
 *   limit: 20
 * })
 * 
 * // In component
 * const ProductsList = () => {
 *   const { data, isLoading, error, refetch } = useProducts()
 *   
 *   if (isLoading) return <LoadingSpinner />
 *   if (error) return <ErrorMessage error={error} />
 *   if (!data) return <Empty />
 *   
 *   return (
 *     <div>
 *       {data.data.map(product => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *       <Button onClick={() => refetch()}>Refresh</Button>
 *     </div>
 *   )
 * }
 * ```
 * 
 * @todo Implementar con React Query cuando esté instalado
 * 
 * @remarks
 * - Currently uses temporary implementation without React Query
 * - Will be migrated to React Query for caching and better state management
 * - Returns null data initially (pending React Query implementation)
 * 
 * @see {@link productService} Service used for fetching products
 * @see {@link ProductFilters} Available filter options
 */
export const useProducts = (filters?: ProductFilters) => {
  // Implementación temporal sin React Query
  // TODO: Reemplazar con React Query
  return {
    data: null as PaginatedProducts | null,
    isLoading: false,
    error: null as Error | null,
    refetch: async () => {
      return productService.getAll(filters)
    },
  }
}

