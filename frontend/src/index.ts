/**
 * @module Frontend
 * @description Main entry point for frontend module exports
 * 
 * This module exports all public APIs from features and shared modules.
 * Import from here to use components, hooks, services, and utilities.
 * 
 * @example
 * ```ts
 * import { ProductCard, useProducts } from '@/index'
 * ```
 */

// Features exports
export * from './features/products'
export * from './features/cart'
export * from './features/auth'
export * from './features/orders'
export * from './features/home'

// Shared exports
export * from './shared/components'
export * from './shared/hooks'
export * from './shared/services'
export * from './shared/types'
export * from './shared/utils'

