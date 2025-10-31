import React from 'react'
import { Card, InputNumber, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { CartItem as CartItemType } from '../../types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

/**
 * Componente para mostrar un item del carrito
 */
export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <Card>
      {/* Implementación del item del carrito */}
    </Card>
  )
}

