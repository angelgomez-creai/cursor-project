/**
 * Unit tests for useDebounce hook
 */
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'changed', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time
    vi.advanceTimersByTime(500)

    // Now value should be updated
    await waitFor(() => {
      expect(result.current).toBe('changed')
    })
  })

  it('should reset timer on multiple rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Rapid changes
    rerender({ value: 'value1' })
    vi.advanceTimersByTime(300)

    rerender({ value: 'value2' })
    vi.advanceTimersByTime(300)

    rerender({ value: 'value3' })
    vi.advanceTimersByTime(500)

    expect(result.current).toBe('value3')
  })

  it('should use custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    rerender({ value: 'changed', delay: 1000 })

    // Should not change before delay
    vi.advanceTimersByTime(500)
    expect(result.current).toBe('initial')

    // Should change after delay
    vi.advanceTimersByTime(500)
    expect(result.current).toBe('changed')
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'changed' })
    vi.advanceTimersByTime(0)

    expect(result.current).toBe('changed')
  })

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value', 500))

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 0 } }
    )

    rerender({ value: 100 })
    vi.advanceTimersByTime(500)

    expect(result.current).toBe(100)
  })

  it('should handle object values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: { count: 0 } } }
    )

    rerender({ value: { count: 10 } })
    vi.advanceTimersByTime(500)

    expect(result.current).toEqual({ count: 10 })
  })
})

