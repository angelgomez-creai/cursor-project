import { useState, useEffect } from 'react'

/**
 * Hook for managing localStorage in a reactive way
 * 
 * @template T - Type of the value to store
 * @param {string} key - localStorage key
 * @param {T} initialValue - Initial value if key doesn't exist
 * @returns {[T, (value: T | ((val: T) => T)) => void]} Tuple of current value and setter function
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const [token, setToken] = useLocalStorage<string | null>('auth_token', null)
 * 
 * // With function updater
 * const [count, setCount] = useLocalStorage('counter', 0)
 * setCount(prev => prev + 1)
 * 
 * // Complex object
 * interface UserPrefs {
 *   theme: 'light' | 'dark'
 *   language: string
 * }
 * const [prefs, setPrefs] = useLocalStorage<UserPrefs>('user_prefs', {
 *   theme: 'light',
 *   language: 'en'
 * })
 * ```
 * 
 * @remarks
 * - Automatically syncs with localStorage
 * - Handles SSR by returning initialValue during server-side rendering
 * - Throws error on quota exceeded (logged to console)
 * - Values are automatically JSON serialized/deserialized
 * 
 * @edgeCases
 * - **Private/Incognito mode**: localStorage may fail silently, returns initialValue
 * - **Quota exceeded**: Error logged, but hook continues with in-memory value
 * - **Invalid JSON**: Returns initialValue and logs error
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage | localStorage API}
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

