import React, { useCallback } from 'react'
import { Row, Col, Typography, Empty, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks'
import { ProductCard } from '../components'
import { LoadingSpinner, ErrorMessage } from '@shared/components'
import { useCart } from '@features/cart/hooks'
import { message } from 'antd'

const { Title } = Typography

/**
 * Página principal de productos
 */
export const ProductsPage: React.FC = () => {
  const navigate = useNavigate()
  const { data, isLoading, error } = useProducts()
  const { addToCart } = useCart()

  const handleAddToCart = useCallback(
    async (productId: number) => {
      try {
        await addToCart(productId, 1)
        message.success('Producto agregado al carrito')
      } catch (err) {
        message.error('Error al agregar producto al carrito')
      }
    },
    [addToCart]
  )

  if (isLoading) {
    return <LoadingSpinner tip="Cargando productos..." />
  }

  if (error) {
    return (
      <ErrorMessage
        message="Error al cargar productos"
        description={error.message || 'No se pudieron cargar los productos. Por favor, intenta nuevamente.'}
      />
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <Empty
        description="No se encontraron productos"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Empty>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={1} style={{ margin: 0 }}>
          Productos
        </Title>
        {data.total > 0 && (
          <Typography.Text type="secondary">
            Mostrando {data.data.length} de {data.total} productos
          </Typography.Text>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {data.data.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

