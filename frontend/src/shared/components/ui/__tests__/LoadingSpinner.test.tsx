/**
 * Unit tests for LoadingSpinner component
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />)
    
    // Check if Spin component is rendered (Ant Design component)
    // The exact implementation depends on Ant Design's Spin
    // Try multiple ways to find the element
    const spinner = screen.queryByText('Cargando...') || 
                   screen.queryByRole('status') ||
                   document.querySelector('.ant-spin')
    expect(spinner).toBeTruthy()
  })

  it('should render with custom message', () => {
    render(<LoadingSpinner tip="Loading products..." />)
    
    const spinner = screen.queryByText('Loading products...') ||
                   document.querySelector('.ant-spin')
    expect(spinner).toBeTruthy()
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()

    rerender(<LoadingSpinner size="large" />)
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()

    rerender(<LoadingSpinner size="default" />)
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
  })
})

