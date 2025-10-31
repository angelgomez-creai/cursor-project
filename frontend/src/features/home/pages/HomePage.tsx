import React from 'react'
import { Row, Col, Typography, Empty, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@features/products/components'
import { LoadingSpinner, ErrorMessage } from '@shared/components'
import { HeroSection, ProjectTimeline } from '../components'
import { useHomePage } from '../hooks'

const { Title } = Typography

/**
 * Página principal del e-commerce
 * Muestra productos destacados, hero section y timeline del proyecto
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const {
    products,
    isLoading,
    error,
    handleAddToCart,
    handleAddToWishlist,
    isEmpty,
  } = useHomePage()

  if (isLoading) {
    return <LoadingSpinner tip="Cargando productos destacados..." />
  }

  if (error) {
    return (
      <ErrorMessage
        message="Error al cargar productos"
        description={error.message || 'No se pudieron cargar los productos destacados'}
      />
    )
  }

  return (
    <div>
      <HeroSection />

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            Productos Destacados
          </Title>
          <Button type="link" onClick={() => navigate('/products')}>
            Ver todos →
          </Button>
        </div>

        {isEmpty ? (
          <Empty
            description="No hay productos disponibles"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/products')}>
              Explorar productos
            </Button>
          </Empty>
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  loading={isLoading}
                />
              </Col>
            ))}
          </Row>
        )}
      </section>

      <ProjectTimeline />
    </div>
  )
}

