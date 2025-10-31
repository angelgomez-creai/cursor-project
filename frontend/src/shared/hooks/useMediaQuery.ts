import { useState, useEffect } from 'react'

/**
 * Hook for detecting media query matches
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query currently matches
 * 
 * @example
 * ```typescript
 * // Responsive component
 * const ResponsiveLayout = () => {
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
 *   
 *   if (isMobile) return <MobileLayout />
 *   if (isTablet) return <TabletLayout />
 *   return <DesktopLayout />
 * }
 * 
 * // Conditional rendering
 * const Sidebar = () => {
 *   const isLargeScreen = useMediaQuery('(min-width: 1200px)')
 *   
 *   return isLargeScreen ? <FullSidebar /> : <CollapsedSidebar />
 * }
 * 
 * // Show/hide elements
 * const HideOnMobile = ({ children }) => {
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   return isMobile ? null : children
 * }
 * ```
 * 
 * @remarks
 * - Returns false during SSR (server-side rendering)
 * - Automatically updates when window is resized
 * - Cleans up event listeners on unmount
 * 
 * @edgeCases
 * - **SSR**: Returns false (no window object)
 * - **Invalid query**: matchMedia may throw, hook returns false
 * - **Window resize**: Automatically updates state
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

