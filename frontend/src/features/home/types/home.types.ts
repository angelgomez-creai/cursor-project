/**
 * Tipos específicos del feature Home
 */

export interface HeroSectionConfig {
  title: string
  subtitle: string
  description?: string
  backgroundGradient?: string
}

export interface TimelineItem {
  id: string
  label: string
  status: 'completed' | 'current' | 'upcoming'
}

