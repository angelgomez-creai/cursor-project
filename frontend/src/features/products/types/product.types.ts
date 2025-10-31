/**
 * Tipos específicos del feature Products
 */

import type { Timestamps } from '@shared/types'

/**
 * Precio (type alias para claridad)
 */
export type Price = number

/**
 * Categoría de producto
 */
export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'sports'
  | 'books'
  | 'beauty'
  | 'toys'
  | 'food'

/**
 * Dimensiones del producto
 */
export interface ProductDimensions {
  length: number // en cm
  width: number // en cm
  height: number // en cm
  weight: number // en kg
}

/**
 * Información de inventario
 */
export interface InventoryInfo {
  stock: number
  reservedStock?: number
  lowStockThreshold?: number
  isLowStock?: boolean
  warehouse?: string
}

/**
 * Información de descuento
 */
export interface DiscountInfo {
  originalPrice: Price
  discountPrice: Price
  discountPercentage: number
  validFrom?: string
  validUntil?: string
  isActive: boolean
}

/**
 * Especificaciones técnicas (para productos electrónicos, etc.)
 */
export interface ProductSpecs {
  [key: string]: string | number | boolean
}

/**
 * Producto completo
 */
export interface Product extends Timestamps {
  id: number
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: Price
  originalPrice?: Price
  stock: number
  category: ProductCategory
  sku: string
  barcode?: string
  images: string[]
  thumbnail?: string
  rating?: number
  reviewCount?: number
  isActive: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOnSale?: boolean
  tags?: string[]
  dimensions?: ProductDimensions
  inventory?: InventoryInfo
  discount?: DiscountInfo
  specs?: ProductSpecs
  vendorId?: number
  brand?: string
  warranty?: string
  returnPolicy?: string
}

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
  category?: ProductCategory
  minPrice?: Price
  maxPrice?: Price
  search?: string
  tags?: string[]
  inStock?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  brand?: string
  rating?: number
  sortBy?: ProductSortField
  sortOrder?: 'asc' | 'desc'
}

/**
 * Campos disponibles para ordenamiento
 */
export type ProductSortField =
  | 'price'
  | 'name'
  | 'rating'
  | 'date'
  | 'popularity'
  | 'reviews'

/**
 * Producto con paginación
 */
export interface PaginatedProducts {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Producto simplificado (para listas)
 */
export type ProductSummary = Pick<
  Product,
  'id' | 'name' | 'price' | 'thumbnail' | 'rating' | 'category' | 'isOnSale' | 'discount'
>

/**
 * Input para crear producto
 */
export type CreateProductInput = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'
>

/**
 * Input para actualizar producto
 */
export type UpdateProductInput = Partial<CreateProductInput>
