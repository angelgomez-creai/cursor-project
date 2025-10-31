import React from 'react'
import { Card } from 'antd'
import { LoginForm } from '../components'

/**
 * Página de login
 */
export const LoginPage: React.FC = () => {
  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email, password)
    // TODO: Implementar lógica de login
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <Card title="Iniciar Sesión" style={{ width: 400 }}>
        <LoginForm onLogin={handleLogin} />
      </Card>
    </div>
  )
}

