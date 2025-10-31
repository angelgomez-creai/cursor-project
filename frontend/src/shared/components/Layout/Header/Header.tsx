/**
 * Header de la aplicación
 * TODO: Refactorizar con el código del Header legacy cuando sea necesario
 */
import React from 'react'
import { Layout } from 'antd'

const { Header: AntHeader } = Layout

/**
 * Componente Header principal de la aplicación
 */
export const Header: React.FC = () => {
  return (
    <AntHeader style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}>
        🛒 E-commerce
      </div>
      {/* TODO: Agregar navegación, carrito, usuario, etc. */}
    </AntHeader>
  )
}

