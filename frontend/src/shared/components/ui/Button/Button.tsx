import React from 'react'
import { Button as AntButton } from 'antd'
import type { ButtonProps as AntButtonProps } from 'antd'

/**
 * Componente Button wrapper con estilos personalizados
 * Puede extenderse con props adicionales si es necesario
 */
export interface ButtonProps extends AntButtonProps {}

export const Button: React.FC<ButtonProps> = (props) => {
  return <AntButton {...props} />
}

