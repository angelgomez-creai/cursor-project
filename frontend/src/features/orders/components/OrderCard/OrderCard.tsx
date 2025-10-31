import React from 'react'
import { Card, Tag } from 'antd'
import type { Order } from '../../types'

interface OrderCardProps {
  order: Order
}

/**
 * Componente para mostrar una orden en formato card
 */
export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card>
      {/* Implementación del card de orden */}
    </Card>
  )
}

