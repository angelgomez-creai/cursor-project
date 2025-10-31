import React from 'react'
import { useParams } from 'react-router-dom'

/**
 * Página de detalle de orden
 */
export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Detalle de Orden #{id}</h1>
      {/* Detalles de la orden */}
    </div>
  )
}

