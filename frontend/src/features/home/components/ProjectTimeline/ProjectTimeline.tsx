import React from 'react'
import { Row, Col, Tag, Typography } from 'antd'
import type { TimelineItem } from '../../types'
import styles from './ProjectTimeline.module.css'

const { Title } = Typography

interface ProjectTimelineProps {
  items?: TimelineItem[]
  title?: string
}

const defaultItems: TimelineItem[] = [
  {
    id: 'day-1',
    label: 'Day 1: Clean Architecture (Backend)',
    status: 'completed',
  },
  {
    id: 'day-2',
    label: 'Day 2: Products Feature (Frontend)',
    status: 'current',
  },
  {
    id: 'day-3',
    label: 'Day 3: Orders & Cart',
    status: 'upcoming',
  },
  {
    id: 'day-4',
    label: 'Day 4: Authentication',
    status: 'upcoming',
  },
]

const getTagColor = (status: TimelineItem['status']): string => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'current':
      return 'processing'
    case 'upcoming':
    default:
      return 'default'
  }
}

/**
 * Componente para mostrar la línea de tiempo del proyecto
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  items = defaultItems,
  title = 'Project Evolution Timeline',
}) => {
  return (
    <div className={styles.timeline}>
      <Title level={3} className={styles.title}>
        {title}
      </Title>
      <Row gutter={[24, 16]} className={styles.items}>
        {items.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={6}>
            <Tag
              color={getTagColor(item.status)}
              className={styles.tag}
            >
              {item.label}
            </Tag>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export type { ProjectTimelineProps }

