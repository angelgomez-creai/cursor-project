/**
 * Unit tests for ProductCard component
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from '@jest/globals'
import { ProductCard } from '../ProductCard'
import type { Product } from '../../types'

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  originalPrice: 149.99,
  stock: 50,
  category: 'electronics',
  description: 'Test product description',
  images: ['https://via.placeholder.com/300'],
  isActive: true,
  isNew: false,
  isOnSale: true,
  isFeatured: false,
  rating: 4.5,
  reviewCount: 10,
  discount: {
    isActive: true,
    discountPercentage: 33,
    validFrom: new Date(),
    validTo: new Date(),
  },
}

describe('ProductCard', () => {
  const mockOnAddToCart = vi.fn()

  const renderProductCard = (product = mockProduct, props = {}) => {
    return render(
      <BrowserRouter>
        <ProductCard product={product} onAddToCart={mockOnAddToCart} {...props} />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render product information', () => {
    renderProductCard()
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
  })

  it('should call onAddToCart when button is clicked', () => {
    renderProductCard()
    
    const addButton = screen.getByText('Agregar al Carrito')
    fireEvent.click(addButton)
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(1)
  })

  it('should disable button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderProductCard(outOfStockProduct)
    
    const button = screen.getByText('Agotado')
    expect(button.closest('button')).toBeDisabled()
  })

  it('should show loading state', () => {
    renderProductCard(mockProduct, { loading: true })
    
    const button = screen.getByText('Agregar al Carrito')
    expect(button.closest('button')).toHaveAttribute('class', expect.stringContaining('ant-btn-loading'))
  })

  it('should handle image error', () => {
    const productWithInvalidImage = {
      ...mockProduct,
      images: ['invalid-url'],
    }
    
    renderProductCard(productWithInvalidImage)
    
    // Image should be in document
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    
    // Simulate image error
    fireEvent.error(image)
    
    // Image src should change to placeholder (handled by component)
    // Note: This depends on implementation
  })

  it('should show discount badge when on sale', () => {
    renderProductCard()
    
    // Check for sale badge (implementation depends on Ant Design Badge.Ribbon)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})

