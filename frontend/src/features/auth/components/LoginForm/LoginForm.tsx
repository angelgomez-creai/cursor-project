import React from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  loading?: boolean
}

/**
 * Formulario de login
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading = false,
}) => {
  const [form] = Form.useForm()

  const handleSubmit = (values: { email: string; password: string }) => {
    onLogin(values.email, values.password)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Por favor ingresa tu email' },
          { type: 'email', message: 'Email inválido' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Contraseña"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  )
}

