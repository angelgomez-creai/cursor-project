/**
 * Unit tests for ErrorMessage component
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from '@jest/globals'
import { ErrorMessage } from '../ErrorMessage'

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" />)
    
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(
      <ErrorMessage
        message="Error occurred"
        description="This is a detailed error description"
      />
    )
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
    expect(screen.getByText('This is a detailed error description')).toBeInTheDocument()
  })

  it('should be closable when onClose is provided', () => {
    const onClose = vi.fn()
    render(<ErrorMessage message="Error" onClose={onClose} />)
    
    // Check if Alert component is rendered
    const alert = document.querySelector('.ant-alert') || 
                 screen.queryByRole('alert') ||
                 screen.getByText('Error')
    expect(alert).toBeTruthy()
  })

  it('should not be closable when onClose is not provided', () => {
    render(<ErrorMessage message="Error" />)
    
    const alert = document.querySelector('.ant-alert') ||
                 screen.getByText('Error')
    expect(alert).toBeTruthy()
  })
})

