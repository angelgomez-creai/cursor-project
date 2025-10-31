import React, { useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Image,
  Space,
  Divider,
  Badge,
  message,
} from 'antd'
import { ShoppingCartOutlined, LeftOutlined } from '@ant-design/icons'
import { useProduct } from '../hooks'
import { LoadingSpinner, ErrorMessage } from '@shared/components'
import { formatPrice } from '../utils/formatPrice'
import { useCart } from '@features/cart/hooks'

const { Title, Paragraph, Text } = Typography

/**
 * Página de detalle de producto
 */
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = id ? parseInt(id, 10) : null
  const { data: product, isLoading, error } = useProduct(productId)
  const { addToCart } = useCart()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = useCallback(async () => {
    if (!product) return

    setAddingToCart(true)
    try {
      await addToCart(product.id, 1)
      message.success('Producto agregado al carrito')
    } catch (err) {
      message.error('Error al agregar producto al carrito')
    } finally {
      setAddingToCart(false)
    }
  }, [product, addToCart])

  if (isLoading) {
    return <LoadingSpinner tip="Cargando producto..." />
  }

  if (error || !product) {
    return (
      <ErrorMessage
        message="Error al cargar el producto"
        description={error?.message || 'El producto solicitado no existe o no está disponible.'}
      />
    )
  }

  const hasDiscount = product.discount?.isActive && product.originalPrice
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 10
  const images = product.images && product.images.length > 0 ? product.images : []

  return (
    <div>
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '24px' }}
      >
        Volver
      </Button>

      <Row gutter={[32, 32]}>
        {/* Galería de imágenes */}
        <Col xs={24} md={12}>
          <div>
            <Image
              src={images[selectedImageIndex] || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
              preview={{ mask: 'Ver imagen completa' }}
            />
            {images.length > 1 && (
              <div style={{ marginTop: '16px' }}>
                <Space wrap>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border:
                          selectedImageIndex === index
                            ? '2px solid #1890ff'
                            : '1px solid #d9d9d9',
                        opacity: selectedImageIndex === index ? 1 : 0.7,
                      }}
                    />
                  ))}
                </Space>
              </div>
            )}
          </div>
        </Col>

        {/* Información del producto */}
        <Col xs={24} md={12}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space wrap>
                <Tag>{product.category}</Tag>
                {product.isNew && <Tag color="green">Nuevo</Tag>}
                {product.isFeatured && <Tag color="blue">Destacado</Tag>}
                {product.isOnSale && <Tag color="red">Oferta</Tag>}
              </Space>
            </div>

            <Title level={1} style={{ marginBottom: '16px' }}>
              {product.name}
            </Title>

            {product.rating && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>
                  ⭐ {product.rating.toFixed(1)}
                  {product.reviewCount && ` (${product.reviewCount} reseñas)`}
                </Text>
              </div>
            )}

            <Divider />

            {/* Precio */}
            <div style={{ marginBottom: '24px' }}>
              {hasDiscount && product.originalPrice && (
                <div style={{ marginBottom: '8px' }}>
                  <Text delete type="secondary" style={{ fontSize: '18px' }}>
                    {formatPrice(product.originalPrice)}
                  </Text>
                  <Tag color="red" style={{ marginLeft: '8px' }}>
                    -{product.discount?.discountPercentage}%
                  </Tag>
                </div>
              )}
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                {formatPrice(product.price)}
              </Title>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: '24px' }}>
              {isOutOfStock ? (
                <Badge status="error" text={<Text type="danger">Agotado</Text>} />
              ) : isLowStock ? (
                <Badge status="warning" text={<Text type="warning">Últimas {product.stock} unidades</Text>} />
              ) : (
                <Badge status="success" text={<Text type="success">En stock ({product.stock} disponibles)</Text>} />
              )}
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Descripción</Title>
              <Paragraph>{product.description}</Paragraph>
              {product.shortDescription && (
                <Paragraph type="secondary">{product.shortDescription}</Paragraph>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">SKU: </Text>
                <Text strong>{product.sku}</Text>
              </div>
            )}

            {/* Acciones */}
            <div>
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={isOutOfStock}
                  style={{ minWidth: '200px' }}
                >
                  {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
                </Button>
              </Space>
            </div>

            {/* Información adicional */}
            {(product.brand || product.warranty) && (
              <div style={{ marginTop: '32px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                {product.brand && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Marca: </Text>
                    <Text>{product.brand}</Text>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <Text strong>Garantía: </Text>
                    <Text>{product.warranty}</Text>
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

