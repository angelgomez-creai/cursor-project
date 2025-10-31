import React from 'react'
import { useCart } from '../hooks'

/**
 * Página del carrito de compras
 */
export const CartPage: React.FC = () => {
  const { items, isEmpty } = useCart()

  if (isEmpty) {
    return <div>Tu carrito está vacío</div>
  }

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {/* Lista de items del carrito */}
    </div>
  )
}

