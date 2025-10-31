import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError } from '@shared/types'

/**
 * API Client for making HTTP requests to the backend
 * 
 * @class ApiClient
 * @description Centralized HTTP client with interceptors for authentication,
 * error handling, and request/response transformation.
 * 
 * @example
 * ```typescript
 * import { apiClient } from '@shared/services/apiClient'
 * 
 * // GET request
 * const products = await apiClient.get<Product[]>('/api/products')
 * 
 * // POST request with data
 * const newProduct = await apiClient.post<Product>('/api/products', {
 *   name: 'New Product',
 *   price: 99.99
 * })
 * 
 * // With custom config
 * const result = await apiClient.get('/api/products', {
 *   params: { page: 1, limit: 10 }
 * })
 * ```
 * 
 * @see {@link https://github.com/axios/axios | Axios Documentation}
 * 
 * @todo Implement retry logic for failed requests
 * @todo Add request caching mechanism
 * @todo Implement request deduplication
 * @todo Add request cancellation support
 */
class ApiClient {
  private client: AxiosInstance

  /**
   * Creates an instance of ApiClient
   * 
   * @param {string} baseURL - Base URL for API requests. Defaults to 'http://localhost:8000'
   *                           Can be overridden via VITE_API_URL environment variable
   * 
   * @example
   * ```typescript
   * // Default configuration
   * const client = new ApiClient()
   * 
   * // Custom base URL
   * const client = new ApiClient('https://api.example.com')
   * ```
   * 
   * @todo Load baseURL from environment variables
   * @todo Support multiple API endpoints
   */
  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      // ❌ PROBLEMA: No configuración de:
      // - withCredentials
      // - maxRedirects
      // - validateStatus
      // - transformRequest/transformResponse
    })

    this.setupInterceptors()
  }

  // ❌ PROBLEMA: Interceptors básicos sin features avanzadas
  private setupInterceptors(): void {
    // ❌ PROBLEMA: Request interceptor muy simple
    this.client.interceptors.request.use(
      (config) => {
        // ❌ PROBLEMA: Token management muy básico
        // ❌ PROBLEMA: No token refresh logic
        // ❌ PROBLEMA: No token expiry check
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // ❌ PROBLEMA: No request ID generation para tracing
        // ❌ PROBLEMA: No request timing
        // ❌ PROBLEMA: No request logging
        
        return config
      },
      (error) => {
        // ❌ PROBLEMA: No error logging en request interceptor
        return Promise.reject(error)
      }
    )

    // ❌ PROBLEMA: Response interceptor sin features avanzadas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // ❌ PROBLEMA: No response transformation
        // ❌ PROBLEMA: No response caching
        // ❌ PROBLEMA: No response validation
        return response
      },
      (error) => {
        // ❌ PROBLEMA: Error handling muy básico
        const apiError: ApiError = {
          message: error.response?.data?.detail || error.message || 'Unknown error',
          status: error.response?.status || 500,
          details: error.response?.data
        }

        // ❌ PROBLEMA: Error handling muy simple
        if (apiError.status === 401) {
          // ❌ PROBLEMA: Token cleanup muy básico
          localStorage.removeItem('auth_token')
          // ❌ PROBLEMA: Hard redirect - should use router
          // window.location.href = '/login'
          console.log('Unauthorized - token cleared')
        }

        // ❌ PROBLEMA: No retry logic para network errors
        // ❌ PROBLEMA: No exponential backoff
        // ❌ PROBLEMA: No error reporting to service (Sentry, etc.)
        
        return Promise.reject(apiError)
      }
    )
  }

  /**
   * Performs a GET request
   * 
   * @template T - Response data type
   * @param {string} url - Request URL (relative to baseURL)
   * @param {AxiosRequestConfig} [config] - Optional axios request configuration
   * @returns {Promise<T>} Promise resolving to response data
   * 
   * @throws {ApiError} When request fails
   * 
   * @example
   * ```typescript
   * // Simple GET
   * const products = await apiClient.get<Product[]>('/api/products')
   * 
   * // GET with query parameters
   * const filtered = await apiClient.get<Product[]>('/api/products', {
   *   params: { category: 'electronics', page: 1 }
   * })
   * ```
   * 
   * @see {@link https://axios-http.com/docs/api_intro | Axios GET}
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * Performs a POST request
   * 
   * @template T - Response data type
   * @param {string} url - Request URL (relative to baseURL)
   * @param {any} [data] - Request body data
   * @param {AxiosRequestConfig} [config] - Optional axios request configuration
   * @returns {Promise<T>} Promise resolving to response data
   * 
   * @throws {ApiError} When request fails (400, 401, 500, etc.)
   * 
   * @example
   * ```typescript
   * // Create new product
   * const product = await apiClient.post<Product>('/api/products', {
   *   name: 'New Product',
   *   price: 99.99,
   *   category: 'electronics'
   * })
   * 
   * // Login
   * const auth = await apiClient.post<AuthResponse>('/api/auth/login', {
   *   email: 'user@example.com',
   *   password: 'password123'
   * })
   * ```
   * 
   * @see {@link https://axios-http.com/docs/api_intro | Axios POST}
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  /**
   * Performs a PUT request (full update)
   * 
   * @template T - Response data type
   * @param {string} url - Request URL (relative to baseURL)
   * @param {any} [data] - Request body data
   * @param {AxiosRequestConfig} [config] - Optional axios request configuration
   * @returns {Promise<T>} Promise resolving to response data
   * 
   * @example
   * ```typescript
   * // Update entire product
   * const updated = await apiClient.put<Product>('/api/products/123', {
   *   name: 'Updated Product',
   *   price: 149.99
   * })
   * ```
   * 
   * @see {@link https://axios-http.com/docs/api_intro | Axios PUT}
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  /**
   * Performs a DELETE request
   * 
   * @template T - Response data type
   * @param {string} url - Request URL (relative to baseURL)
   * @param {AxiosRequestConfig} [config] - Optional axios request configuration
   * @returns {Promise<T>} Promise resolving to response data
   * 
   * @example
   * ```typescript
   * // Delete product
   * await apiClient.delete('/api/products/123')
   * 
   * // Delete with confirmation
   * await apiClient.delete('/api/products/123', {
   *   headers: { 'X-Confirm-Delete': 'true' }
   * })
   * ```
   * 
   * @see {@link https://axios-http.com/docs/api_intro | Axios DELETE}
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  /**
   * Sets authentication token for subsequent requests
   * 
   * @param {string} token - JWT token to be used for authentication
   * 
   * @example
   * ```typescript
   * // After successful login
   * const { token } = await apiClient.post('/api/auth/login', credentials)
   * apiClient.setAuthToken(token)
   * 
   * // All subsequent requests will include: Authorization: Bearer {token}
   * ```
   * 
   * @see {@link removeAuthToken} To remove token
   * @see {@link getAuthToken} To get current token
   * 
   * @todo Implement token expiry management
   * @todo Use httpOnly cookies for secure token storage
   * @todo Add automatic token refresh mechanism
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  /**
   * Removes authentication token
   * 
   * Use this method when logging out or when token is invalid.
   * 
   * @example
   * ```typescript
   * // On logout
   * apiClient.removeAuthToken()
   * 
   * // After token expiration
   * if (isTokenExpired(token)) {
   *   apiClient.removeAuthToken()
   *   redirectToLogin()
   * }
   * ```
   * 
   * @see {@link setAuthToken} To set token
   */
  removeAuthToken(): void {
    localStorage.removeItem('auth_token')
  }

  /**
   * Gets current authentication token
   * 
   * @returns {string | null} Current JWT token or null if not set
   * 
   * @example
   * ```typescript
   * const token = apiClient.getAuthToken()
   * if (token) {
   *   console.log('User is authenticated')
   * }
   * ```
   * 
   * @see {@link setAuthToken} To set token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  // ❌ PROBLEMA: No métodos para:
  // - File uploads con progress
  // - Request cancellation
  // - Batch requests
  // - Request caching
  // - Request retry con exponential backoff
  // - Network status detection
  // - Request/response logging
  // - Request metrics collection
}

// ❌ PROBLEMA: Singleton pattern sin lazy loading
// ❌ PROBLEMA: No configuración per-environment
// ❌ PROBLEMA: No múltiples instancias para diferentes APIs
export const apiClient = new ApiClient()
export default apiClient
