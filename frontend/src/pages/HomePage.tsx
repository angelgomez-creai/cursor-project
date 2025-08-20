import React from 'react'
import { Card, Col, Row, Typography, Button, Tag } from 'antd'
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Meta } = Card

// ❌ PROBLEMA: Datos hardcodeados en componente - should come from API
// ❌ PROBLEMA: No type safety para los datos mock
// ❌ PROBLEMA: URLs de imágenes placeholder - no real image management
// ❌ PROBLEMA: No loading states para cuando vengan datos reales
const mockProducts = [
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    price: 899.99, // ❌ PROBLEMA: Number sin formateo de moneda apropiado
    category: 'Electronics',
    description: 'High performance laptop perfect for work and entertainment',
    image: 'https://via.placeholder.com/300x200/1890ff/white?text=Laptop'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 999.99,
    category: 'Electronics', 
    description: 'Latest iPhone model with advanced camera system',
    image: 'https://via.placeholder.com/300x200/52c41a/white?text=iPhone'
  },
  {
    id: 3,
    name: 'Coffee Maker Deluxe',
    price: 159.99,
    category: 'Home',
    description: 'Premium coffee maker for the perfect morning brew',
    image: 'https://via.placeholder.com/300x200/f5222d/white?text=Coffee'
  },
  {
    id: 4,
    name: 'Running Shoes Pro',
    price: 129.99,
    category: 'Sports',
    description: 'Comfortable running shoes for professional athletes',
    image: 'https://via.placeholder.com/300x200/722ed1/white?text=Shoes'
  },
  {
    id: 5,
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    description: 'Premium sound quality with noise cancellation',
    image: 'https://via.placeholder.com/300x200/fa8c16/white?text=Headphones'
  },
  {
    id: 6,
    name: 'Smart Watch',
    price: 249.99,
    category: 'Electronics',
    description: 'Track your fitness and stay connected',
    image: 'https://via.placeholder.com/300x200/13c2c2/white?text=Watch'
  }
]

// ❌ PROBLEMA: Componente muy grande - should be split into smaller components
// ❌ PROBLEMA: No separation of concerns - UI, data, and business logic mixed
// ❌ PROBLEMA: No custom hooks para lógica reutilizable
const HomePage: React.FC = () => {
  // ❌ PROBLEMA: Funciones inline sin optimization - should use useCallback
  // ❌ PROBLEMA: No error handling en las funciones
  // ❌ PROBLEMA: Console.log en vez de proper logging
  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId)
    // ❌ PROBLEMA: No feedback al usuario
    // ❌ PROBLEMA: No validación si el producto existe
    // TODO: Implement cart functionality in Day 3
  }

  const handleAddToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId)
    // ❌ PROBLEMA: No persistencia de wishlist
    // ❌ PROBLEMA: No limit de items en wishlist
    // TODO: Implement wishlist functionality
  }

  // ❌ PROBLEMA: No loading state
  // ❌ PROBLEMA: No error state
  // ❌ PROBLEMA: No empty state cuando no hay productos
  return (
    <div>
      {/* ❌ PROBLEMA: Hero Section con estilos inline - should use CSS-in-JS or classes */}
      {/* ❌ PROBLEMA: No responsive design apropiado */}
      {/* ❌ PROBLEMA: No A/B testing capability */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
        padding: '60px 0',
        borderRadius: '8px',
        marginBottom: '40px',
        color: 'white',
        textAlign: 'center'
      }}>
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          Welcome to E-commerce Evolution
        </Title>
        <Paragraph style={{ fontSize: '18px', color: 'white', margin: '16px 0' }}>
          This is the base project that will evolve into a full-featured e-commerce platform
        </Paragraph>
        {/* ❌ PROBLEMA: Text hardcodeado - should be configurable */}
        <Text style={{ color: 'white', opacity: 0.9 }}>
          🚀 Day 2: We'll connect these products with the real API
        </Text>
      </div>

      {/* ❌ PROBLEMA: Products Section sin filtros, búsqueda, o paginación */}
      <Title level={2} style={{ marginBottom: '24px' }}>
        Featured Products
        {/* ❌ PROBLEMA: No "View All" link */}
        {/* ❌ PROBLEMA: No filter/sort options */}
      </Title>
      
      {/* ❌ PROBLEMA: Grid hardcodeado sin responsive breakpoints apropiados */}
      <Row gutter={[24, 24]}>
        {mockProducts.map(product => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            {/* ❌ PROBLEMA: ProductCard inline - should be separate component */}
            {/* ❌ PROBLEMA: No skeleton loading para imágenes */}
            {/* ❌ PROBLEMA: No lazy loading de imágenes */}
            <Card
              hoverable
              style={{ height: '100%' }}
              cover={
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  {/* ❌ PROBLEMA: No alt text descriptivo */}
                  {/* ❌ PROBLEMA: No error handling si imagen falla */}
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              }
              actions={[
                // ❌ PROBLEMA: Actions inline - should be separate components
                // ❌ PROBLEMA: No loading state en buttons
                // ❌ PROBLEMA: No disabled state management
                <Button 
                  key="cart"
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(product.id)}
                  size="small"
                >
                  Add to Cart
                </Button>,
                <Button
                  key="wishlist"
                  icon={<HeartOutlined />}
                  onClick={() => handleAddToWishlist(product.id)}
                  size="small"
                >
                  Wishlist
                </Button>
              ]}
            >
              <Meta
                title={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      {product.name}
                    </div>
                    {/* ❌ PROBLEMA: Category tag color hardcodeado */}
                    <Tag color="blue">{product.category}</Tag>
                  </div>
                }
                description={
                  <div>
                    {/* ❌ PROBLEMA: Description sin control de longitud dinámica */}
                    <Paragraph 
                      ellipsis={{ rows: 2 }} 
                      style={{ margin: '8px 0', color: '#666' }}
                    >
                      {product.description}
                    </Paragraph>
                    {/* ❌ PROBLEMA: Price sin formateo internacional de moneda */}
                    {/* ❌ PROBLEMA: No muestra precio anterior/descuento */}
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      ${product.price}
                    </Title>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ❌ PROBLEMA: Info Section estática - should be dynamic/configurable */}
      {/* ❌ PROBLEMA: No analytics tracking en esta sección */}
      <div style={{ 
        marginTop: '60px', 
        padding: '40px',
        background: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Title level={3}>Project Evolution Timeline</Title>
        {/* ❌ PROBLEMA: Timeline hardcodeada - should be component */}
        <Row gutter={[24, 16]} style={{ marginTop: '32px' }}>
          <Col span={6}>
            {/* ❌ PROBLEMA: Status hardcodeado - should be dynamic */}
            <Tag color="processing" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Day 1: Clean Architecture (Backend)
            </Tag>
          </Col>
          <Col span={6}>
            <Tag color="default" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Day 2: Products Feature (Frontend)
            </Tag>
          </Col>
          <Col span={6}>
            <Tag color="default" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Day 3: Orders & Cart
            </Tag>
          </Col>
          <Col span={6}>
            <Tag color="default" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Day 4: Authentication
            </Tag>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default HomePage