/**
 * Tipos relacionados con API y comunicación con el backend
 */

/**
 * Respuesta estándar de API con datos
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
  timestamp?: string
}

/**
 * Respuesta de API con paginación
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  message?: string
  success?: boolean
}

/**
 * Error de API estructurado
 */
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, unknown>
  timestamp?: string
  trackingId?: string
  field?: string // Para errores de validación de campos
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Parámetros de ordenamiento
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Estado de carga genérico
 */
export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

/**
 * Estado de operación asíncrona
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

