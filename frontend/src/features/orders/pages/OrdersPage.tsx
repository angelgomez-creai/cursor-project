import React from 'react'
import { useOrders } from '../hooks'

/**
 * Página de órdenes del usuario
 */
export const OrdersPage: React.FC = () => {
  const { data: orders } = useOrders()

  return (
    <div>
      <h1>Mis Órdenes</h1>
      {/* Lista de órdenes */}
    </div>
  )
}

