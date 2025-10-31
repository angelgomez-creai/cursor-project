import { apiClient } from '@shared/services/apiClient'
import type { Product, ProductFilters, PaginatedProducts } from '../types'

/**
 * Service for product-related operations
 * 
 * @namespace productService
 * @description Provides methods to interact with the products API endpoint
 * 
 * @example
 * ```typescript
 * import { productService } from '@features/products/services'
 * 
 * // Get all products
 * const products = await productService.getAll()
 * 
 * // Get filtered products
 * const filtered = await productService.getAll({
 *   category: 'electronics',
 *   minPrice: 100,
 *   maxPrice: 500
 * })
 * 
 * // Get product by ID
 * const product = await productService.getById(123)
 * 
 * // Search products
 * const results = await productService.search('laptop', {
 *   page: 1,
 *   limit: 20
 * })
 * ```
 * 
 * @see {@link Product} Product type definition
 * @see {@link ProductFilters} Available filters
 */
export const productService = {
  /**
   * Gets all products with optional filters
   * 
   * @param {ProductFilters} [filters] - Optional filters for pagination, sorting, and filtering
   * @returns {Promise<PaginatedProducts>} Paginated products response
   * 
   * @throws {ApiError} When request fails (network error, 500, etc.)
   * 
   * @example
   * ```typescript
   * // Get all products
   * const { data, total, page, limit } = await productService.getAll()
   * 
   * // With pagination
   * const page2 = await productService.getAll({ page: 2, limit: 20 })
   * 
   * // With filters
   * const electronics = await productService.getAll({
   *   category: 'electronics',
   *   minPrice: 100,
   *   sortBy: 'price',
   *   sortOrder: 'asc'
   * })
   * ```
   * 
   * @edgeCases
   * - **Empty results**: Returns empty array, not an error
   * - **Invalid filters**: Backend may ignore or return error
   * - **Network timeout**: Throws ApiError with status 0
   */
  async getAll(filters?: ProductFilters): Promise<PaginatedProducts> {
    return apiClient.get<PaginatedProducts>('/api/products', {
      params: filters,
    })
  },

  /**
   * Gets a single product by ID
   * 
   * @param {number} id - Product ID (must be positive integer)
   * @returns {Promise<Product>} Product object
   * 
   * @throws {Error} When ID is invalid (null, undefined, <= 0, or non-numeric)
   * @throws {ApiError} When product not found (404) or request fails
   * 
   * @example
   * ```typescript
   * // Get product by ID
   * try {
   *   const product = await productService.getById(123)
   *   console.log(product.name, product.price)
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Product not found')
   *   }
   * }
   * 
   * // Invalid ID handling
   * try {
   *   await productService.getById(-1) // Throws Error
   * } catch (error) {
   *   console.error('Invalid ID:', error.message)
   * }
   * ```
   * 
   * @edgeCases
   * - **ID inválido**: Valida antes de hacer request (null, undefined, <= 0)
   * - **Producto no existe**: Backend retorna 404, no manejado específicamente
   * - **Network error**: Propaga ApiError
   */
  async getById(id: number): Promise<Product> {
    // Validar que el ID sea un número positivo
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID de producto inválido')
    }

    return apiClient.get<Product>(`/api/products/${id}`)
  },

  /**
   * Searches products by query term
   * Returns paginated results for consistency with other methods
   * 
   * @param {string} query - Search query term
   * @param {ProductFilters} [filters] - Additional filters (pagination, sorting, etc.)
   * @returns {Promise<PaginatedProducts>} Paginated search results
   * 
   * @throws {Error} When query is empty or invalid
   * @throws {ApiError} When request fails
   * 
   * @example
   * ```typescript
   * // Simple search
   * const results = await productService.search('laptop')
   * 
   * // Search with filters
   * const filtered = await productService.search('phone', {
   *   category: 'electronics',
   *   minPrice: 200,
   *   page: 1,
   *   limit: 10
   * })
   * 
   * // Empty query handling
   * try {
   *   await productService.search('   ') // Throws Error
   * } catch (error) {
   *   console.error('Invalid query:', error.message)
   * }
   * ```
   * 
   * @remarks
   * - Query is automatically trimmed
   * - Search is case-insensitive (handled by backend)
   * - Returns same structure as getAll for consistency
   * 
   * @edgeCases
   * - **Query vacío**: Valida antes de request (trim applied)
   * - **Query solo espacios**: Trim aplicado, luego validación
   * - **Caracteres especiales**: No sanitizado (backend maneja)
   * - **Sin resultados**: Retorna array vacío, no error
   */
  async search(query: string, filters?: ProductFilters): Promise<PaginatedProducts> {
    // Validar que query no esté vacío
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Término de búsqueda inválido')
    }

    return apiClient.get<PaginatedProducts>('/api/products/search', {
      params: { q: query.trim(), ...filters },
    })
  },

  /**
   * Gets all available product categories
   * 
   * @returns {Promise<string[]>} Array of category names
   * 
   * @throws {ApiError} When request fails
   * 
   * @example
   * ```typescript
   * // Get all categories
   * const categories = await productService.getCategories()
   * // ['electronics', 'clothing', 'books', ...]
   * 
   * // Use in dropdown
   * const CategoryFilter = () => {
   *   const [categories, setCategories] = useState<string[]>([])
   *   
   *   useEffect(() => {
   *     productService.getCategories().then(setCategories)
   *   }, [])
   *   
   *   return (
   *     <Select>
   *       {categories.map(cat => (
   *         <Option key={cat} value={cat}>{cat}</Option>
   *       ))}
   *     </Select>
   *   )
   * }
   * ```
   * 
   * @remarks
   * - Categories are typically cached by backend
   * - Returns empty array if no categories exist
   * 
   * @edgeCases
   * - **No categories**: Returns empty array
   * - **Network error**: Throws ApiError
   */
  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/api/products/categories')
  },
}

