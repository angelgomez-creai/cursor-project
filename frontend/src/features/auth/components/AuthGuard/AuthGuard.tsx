import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Componente que protege rutas requiriendo autenticación
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

