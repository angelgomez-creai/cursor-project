import React from 'react'
import { Alert } from 'antd'

interface ErrorMessageProps {
  message: string
  description?: string
  onClose?: () => void
}

/**
 * Component for displaying error messages
 * 
 * @component
 * @description Displays error messages in a user-friendly Alert component.
 * Used for API errors, validation errors, and other error states.
 * 
 * @param {ErrorMessageProps} props - Component props
 * @param {string} props.message - Main error message (required)
 * @param {string} [props.description] - Detailed error description
 * @param {Function} [props.onClose] - Callback when error is dismissed
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const ProductsPage = () => {
 *   const { error } = useProducts()
 *   
 *   if (error) {
 *     return <ErrorMessage message="Error al cargar productos" />
 *   }
 *   return <ProductsList />
 * }
 * 
 * // With description
 * <ErrorMessage
 *   message="Error de conexión"
 *   description="No se pudo conectar con el servidor. Por favor, intenta nuevamente."
 * />
 * 
 * // With close handler
 * <ErrorMessage
 *   message="Error al guardar"
 *   description="Los cambios no se pudieron guardar"
 *   onClose={() => setError(null)}
 * />
 * 
 * // From API error
 * <ErrorMessage
 *   message={apiError.message}
 *   description={apiError.details?.reason}
 * />
 * ```
 * 
 * @remarks
 * - Uses Ant Design Alert component
 * - Shows error icon by default
 * - Closable only if onClose is provided
 * - Accessible with proper ARIA attributes
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  onClose,
}) => {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      closable={!!onClose}
      onClose={onClose}
      showIcon
    />
  )
}

