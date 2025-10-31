import { useState, useEffect } from 'react'

/**
 * Hook for debouncing values
 * 
 * Useful for delaying expensive operations until user stops typing/changing values
 * 
 * @template T - Type of the value to debounce
 * @param {T} value - Value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {T} Debounced value
 * 
 * @example
 * ```typescript
 * // Search input with debounce
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     searchProducts(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 * 
 * // Resize handler
 * const [windowWidth, setWindowWidth] = useState(window.innerWidth)
 * const debouncedWidth = useDebounce(windowWidth, 300)
 * 
 * useEffect(() => {
 *   const handleResize = () => setWindowWidth(window.innerWidth)
 *   window.addEventListener('resize', handleResize)
 *   return () => window.removeEventListener('resize', handleResize)
 * }, [])
 * 
 * // Use debouncedWidth for expensive calculations
 * ```
 * 
 * @remarks
 * - Clears timeout on unmount
 * - Resets timer if value changes before delay expires
 * - Useful for search inputs, resize handlers, scroll events
 * 
 * @edgeCases
 * - **Delay 0**: Returns value immediately (no debounce)
 * - **Negative delay**: Treated as 0
 * - **Component unmount**: Cleans up timeout automatically
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

