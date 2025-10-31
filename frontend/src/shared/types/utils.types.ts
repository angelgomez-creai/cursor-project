/**
 * Utility types para el proyecto
 */

/**
 * Hace que todos los campos opcionales sean requeridos excepto los especificados
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Hace que todos los campos sean opcionales excepto los especificados
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Tipo para actualizaciones parciales (PATCH)
 */
export type PartialUpdate<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Tipo para crear nuevos registros (sin id y timestamps)
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

/**
 * Form state genérico
 */
export type FormState<T> = {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
}

/**
 * Estado de loading con datos
 */
export type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

/**
 * ID tipado (branded type)
 */
export type ID = number & { readonly __brand: 'ID' }

/**
 * Precio (número representando un valor monetario)
 * En producción, considerar usar una librería como dinero.js para mejor type safety
 */
export type Price = number

/**
 * Porcentaje (0-100)
 */
export type Percentage = number

/**
 * Email (string que representa un email válido)
 * En producción, validar con una librería como zod o yup
 */
export type Email = string

/**
 * URL (string que representa una URL válida)
 */
export type URL = string

/**
 * Tipo para objetos con timestamps
 */
export type WithTimestamps<T> = T & {
  createdAt: string
  updatedAt: string
}

/**
 * Tipo para objetos soft-deleteables
 */
export type SoftDeletable<T> = T & {
  deletedAt?: string | null
}

/**
 * Respuesta con paginación
 */
export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

