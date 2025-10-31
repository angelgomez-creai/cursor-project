/**
 * Unit tests for useLocalStorage hook
 */
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals'
import { useLocalStorage } from '../useLocalStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('initial-value')
  })

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorageMock.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  it('should handle function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1]((prev: number) => prev + 5)
    })

    expect(result.current[0]).toBe(6)
  })

  it('should handle complex objects', () => {
    const initialValue = { theme: 'light', language: 'en' }
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))

    act(() => {
      result.current[1]({ theme: 'dark', language: 'es' })
    })

    expect(result.current[0]).toEqual({ theme: 'dark', language: 'es' })
  })

  it('should handle errors gracefully and return initial value', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock getItem to throw error
    const originalGetItem = localStorageMock.getItem
    localStorageMock.getItem = vi.fn(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'))

    expect(result.current[0]).toBe('fallback-value')

    // Restore
    localStorageMock.getItem = originalGetItem
    consoleSpy.mockRestore()
  })

  it('should handle setItem errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock setItem to throw error (quota exceeded)
    const originalSetItem = localStorageMock.setItem
    localStorageMock.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    act(() => {
      result.current[1]('new-value')
    })

    // Value should still update in memory even if localStorage fails
    expect(result.current[0]).toBe('new-value')

    // Restore
    localStorageMock.setItem = originalSetItem
    consoleSpy.mockRestore()
  })
})

