import React from 'react'
import { Spin } from 'antd'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
}

/**
 * Reusable loading spinner component
 * 
 * @component
 * @description Displays a loading spinner with optional text. Used throughout
 * the application to indicate loading states.
 * 
 * @param {LoadingSpinnerProps} props - Component props
 * @param {'small' | 'default' | 'large'} [props.size='large'] - Size of the spinner
 * @param {string} [props.tip='Cargando...'] - Loading message to display
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const ProductsPage = () => {
 *   const { isLoading } = useProducts()
 *   
 *   if (isLoading) return <LoadingSpinner />
 *   return <ProductsList />
 * }
 * 
 * // With custom message
 * <LoadingSpinner tip="Cargando productos..." />
 * 
 * // Small spinner
 * <LoadingSpinner size="small" tip="Guardando..." />
 * 
 * // In modal
 * <Modal open={loading}>
 *   <LoadingSpinner size="large" tip="Procesando pago..." />
 * </Modal>
 * ```
 * 
 * @remarks
 * - Centered by default with padding
 * - Uses Ant Design Spin component
 * - Accessible (screen reader friendly)
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  tip = 'Cargando...',
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size={size} tip={tip} />
    </div>
  )
}

