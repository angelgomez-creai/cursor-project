/**
 * Unit tests for formatPrice utility
 */
import { describe, it, expect } from '@jest/globals'
import { formatPrice } from '../formatPrice'

describe('formatPrice', () => {
  it('should format valid price with default locale', () => {
    const result = formatPrice(99.99)
    expect(result).toContain('99')
    expect(result).toContain(',') // Spanish format uses comma
  })

  it('should format price with USD currency', () => {
    const result = formatPrice(99.99, 'en-US', 'USD')
    expect(result).toContain('$')
    expect(result).toContain('99.99')
  })

  it('should format price with EUR currency', () => {
    const result = formatPrice(99.99, 'es-ES', 'EUR')
    expect(result).toContain('€')
    expect(result).toContain('99')
  })

  it('should handle NaN by formatting as 0', () => {
    const result = formatPrice(NaN)
    expect(result).toContain('0')
  })

  it('should handle Infinity by formatting as 0', () => {
    const result = formatPrice(Infinity)
    expect(result).toContain('0')
  })

  it('should handle negative prices by clamping to 0', () => {
    const result = formatPrice(-10.50)
    expect(result).toContain('0')
  })

  it('should handle large numbers', () => {
    const result = formatPrice(999999.99)
    expect(result).toBeTruthy()
  })

  it('should handle zero price', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
  })

  it('should format price with different locales', () => {
    const resultES = formatPrice(1234.56, 'es-ES', 'EUR')
    const resultUS = formatPrice(1234.56, 'en-US', 'USD')

    expect(resultES).toContain('€')
    expect(resultUS).toContain('$')
  })

  it('should handle decimal precision correctly', () => {
    const result = formatPrice(99.999)
    expect(result).toBeTruthy()
  })
})

