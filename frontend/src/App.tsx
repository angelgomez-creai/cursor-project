import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from '@shared/components/layout'
import { Footer } from '@shared/components/layout'
import { ErrorBoundary } from '@shared/components/feedback'
import { HomePage } from '@features/home/pages'

const { Content } = Layout

/**
 * Componente principal de la aplicación
 * Maneja el routing y layout global
 */
const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          
          <Content style={{ padding: '24px 50px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* TODO: Agregar más rutas */}
              {/* /products, /products/:id */}
              {/* /cart, /checkout, /orders */}
              {/* /login, /register, /profile */}
              {/* /admin/* (protected routes) */}
            </Routes>
          </Content>
          
          <Footer />
        </Layout>
      </ErrorBoundary>
    </Router>
  )
}

export default App
