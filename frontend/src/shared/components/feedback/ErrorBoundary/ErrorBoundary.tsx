import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorMessage } from '../../ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Componente Error Boundary para capturar errores de React
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // TODO: Enviar error a servicio de logging (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorMessage
          message="Algo salió mal"
          description={this.state.error?.message || 'Ha ocurrido un error inesperado'}
        />
      )
    }

    return this.props.children
  }
}

