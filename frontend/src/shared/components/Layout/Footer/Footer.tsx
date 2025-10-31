import React from 'react'
import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

/**
 * Componente Footer de la aplicación
 */
export const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#f0f2f5' }}>
      E-commerce Evolution ©2024 - Learning Project
    </AntFooter>
  )
}

