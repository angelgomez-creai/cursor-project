import React from 'react'
import { Typography } from 'antd'
import type { HeroSectionConfig } from '../../types'
import styles from './HeroSection.module.css'

const { Title, Paragraph, Text } = Typography

interface HeroSectionProps {
  config?: Partial<HeroSectionConfig>
}

const defaultConfig: HeroSectionConfig = {
  title: 'Welcome to E-commerce Evolution',
  subtitle: 'This is the base project that will evolve into a full-featured e-commerce platform',
  description: '🚀 Explore our products and discover amazing deals',
  backgroundGradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
}

/**
 * Componente Hero Section para la página de inicio
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  config = {},
}) => {
  const finalConfig = { ...defaultConfig, ...config }

  return (
    <div
      className={styles.hero}
      style={{
        background: finalConfig.backgroundGradient,
      }}
    >
      <div className={styles.content}>
        <Title level={1} className={styles.title}>
          {finalConfig.title}
        </Title>
        {finalConfig.subtitle && (
          <Paragraph className={styles.subtitle}>
            {finalConfig.subtitle}
          </Paragraph>
        )}
        {finalConfig.description && (
          <Text className={styles.description}>
            {finalConfig.description}
          </Text>
        )}
      </div>
    </div>
  )
}

export type { HeroSectionProps }
