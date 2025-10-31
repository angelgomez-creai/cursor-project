/**
 * Store para estado global del carrito (Zustand)
 * TODO: Implementar cuando se agregue Zustand
 */

// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { CartItem } from '../types'

// interface CartState {
//   items: CartItem[]
//   addItem: (product: Product, quantity: number) => void
//   removeItem: (productId: number) => void
//   updateQuantity: (productId: number, quantity: number) => void
//   clearCart: () => void
//   getTotal: () => number
//   getItemCount: () => number
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],
//       // ... implementación
//     }),
//     {
//       name: 'cart-storage',
//     }
//   )
// )

