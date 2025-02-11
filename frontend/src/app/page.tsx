'use client'

import { useIntl } from 'react-intl'
import { Typography, Card, Row, Col } from 'antd'
import {
  RocketOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const features = [
  {
    icon: <RocketOutlined className="text-4xl text-blue-500" />,
    title: 'TikTok 爆款脚本',
    description: '智能生成吸引人的短视频脚本，提高内容传播效果',
  },
  {
    icon: <GlobalOutlined className="text-4xl text-green-500" />,
    title: '多语言支持',
    description: '支持多语言内容创作，拓展全球市场',
  },
  {
    icon: <ThunderboltOutlined className="text-4xl text-yellow-500" />,
    title: 'AI 驱动',
    description: '使用先进的 AI 技术，提供个性化的内容建议',
  },
  {
    icon: <BarChartOutlined className="text-4xl text-purple-500" />,
    title: '数据分析',
    description: '深入的数据分析，优化内容策略',
  },
]

export default function HomePage() {
  const intl = useIntl()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Title level={1}>{intl.formatMessage({ id: 'app.name' })}</Title>
        <Paragraph className="text-lg text-gray-600">
          {intl.formatMessage({ id: 'app.description' })}
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph className="text-gray-600">{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
