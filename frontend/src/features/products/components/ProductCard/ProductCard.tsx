import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Typography, Badge } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { formatPrice } from '../../utils/formatPrice'
import type { Product } from '../../types'

const { Title, Paragraph, Text } = Typography

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number) => void
  loading?: boolean
}

/**
 * Product card component for displaying product information
 * 
 * @component
 * @description Displays product information in a card format with image, price, stock status,
 * and actions. Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {ProductCardProps} props - Component props
 * @param {Product} props.product - Product data to display
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 * @param {boolean} [props.loading] - Loading state for add to cart button
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ProductCard
 *   product={product}
 *   onAddToCart={(id) => handleAddToCart(id)}
 * />
 * 
 * // With loading state
 * <ProductCard
 *   product={product}
 *   onAddToCart={handleAddToCart}
 *   loading={isAddingToCart}
 * />
 * 
 * // In a list
 * {products.map(product => (
 *   <ProductCard
 *     key={product.id}
 *     product={product}
 *     onAddToCart={addToCart}
 *   />
 * ))}
 * ```
 * 
 * @remarks
 * - Memoized to prevent re-renders when parent re-renders
 * - Navigates to product detail on card click
 * - Handles image loading errors with fallback
 * - Shows badges for new, sale, featured products
 * - Disables add to cart when out of stock
 * 
 * @edgeCases
 * - **Sin imagen**: Muestra placeholder automáticamente
 * - **Precio inválido**: Formateado a "0"
 * - **Stock 0**: Botón deshabilitado, muestra "Agotado"
 * - **Stock bajo (<=10)**: Muestra badge "Últimas unidades"
 * - **Imagen falla**: Fallback a placeholder URL
 * 
 * @see {@link Product} Product type definition
 */
const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  loading = false,
}) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleCardClick = useCallback(() => {
    navigate(`/products/${product.id}`)
  }, [navigate, product.id])

  const handleAddToCartClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onAddToCart(product.id)
    },
    [onAddToCart, product.id]
  )

  // Determinar imagen a mostrar
  const imageUrl =
    imageError || !product.images || product.images.length === 0
      ? 'https://via.placeholder.com/300x200?text=No+Image'
      : product.images[0]

  // Precio con descuento
  const hasDiscount = product.discount?.isActive && product.originalPrice
  const displayPrice = product.price
  const originalPrice = hasDiscount ? product.originalPrice : undefined

  // Stock disponible
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 10

  return (
    <Card
      hoverable
      style={{ height: '100%', cursor: 'pointer' }}
      onClick={handleCardClick}
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <Badge.Ribbon
            text={
              product.isNew
                ? 'Nuevo'
                : product.isOnSale || hasDiscount
                ? 'Oferta'
                : product.isFeatured
                ? 'Destacado'
                : null
            }
            color={
              product.isNew
                ? 'green'
                : product.isOnSale || hasDiscount
                ? 'red'
                : product.isFeatured
                ? 'blue'
                : undefined
            }
          >
            <img
              alt={product.name}
              src={imageUrl}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoading ? 'none' : 'block',
              }}
            />
            {imageLoading && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                }}
              >
                Cargando...
              </div>
            )}
          </Badge.Ribbon>
        </div>
      }
      actions={[
        <Button
          key="cart"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCartClick}
          loading={loading}
          disabled={isOutOfStock}
          block
        >
          {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <div>
            <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
              {product.name}
            </Title>
            <Tag>{product.category}</Tag>
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '8px', color: '#666' }}>
              {product.description}
            </Paragraph>

            {/* Precio */}
            <div style={{ marginBottom: '8px' }}>
              {hasDiscount && originalPrice && (
                <Text
                  delete
                  type="secondary"
                  style={{ marginRight: '8px', fontSize: '14px' }}
                >
                  {formatPrice(originalPrice)}
                </Text>
              )}
              <Title level={4} style={{ margin: 0, color: '#1890ff', display: 'inline' }}>
                {formatPrice(displayPrice)}
              </Title>
              {hasDiscount && product.discount && (
                <Tag color="red" style={{ marginLeft: '8px' }}>
                  -{product.discount.discountPercentage}%
                </Tag>
              )}
            </div>

            {/* Stock */}
            {isOutOfStock && (
              <Tag color="error">Agotado</Tag>
            )}
            {isLowStock && !isOutOfStock && (
              <Tag color="warning">Últimas unidades</Tag>
            )}
            {product.rating && (
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                ⭐ {product.rating.toFixed(1)} {product.reviewCount ? `(${product.reviewCount})` : ''}
              </Text>
            )}
          </div>
        }
      />
    </Card>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export const ProductCard = React.memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.loading === nextProps.loading
  )
})

ProductCard.displayName = 'ProductCard'

export type { ProductCardProps }
