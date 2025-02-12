'use client'

import { Button, Card, Col, Row, Typography } from 'antd'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const { Title, Paragraph } = Typography

// TODO: 替换为实际的用户状态管理
const useAuth = () => {
  return {
    isAuthenticated: false, // 这里应该从状态管理中获取实际的登录状态
    isLoading: false,
  }
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title level={1}>NicheFlow - 智能内容创作平台</Title>
        <Paragraph className="text-lg mb-8">利用AI技术，轻松创建、管理和优化您的内容</Paragraph>
        <Link href="/auth/register">
          <Button type="primary" size="large">
            立即开始
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div id="features" className="mb-16">
        <Title level={2} className="text-center mb-8">
          主要功能
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card title="智能内容生成">
              <Paragraph>
                基于先进的AI模型，自动生成高质量、原创的内容，满足不同平台的需求
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card title="多平台管理">
              <Paragraph>一站式管理多个社交媒体平台，提高内容发布效率，实现统一管理</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card title="数据分析">
              <Paragraph>深入分析内容表现，获取关键指标，优化内容策略</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Title level={2} className="mb-8">
          开始您的内容创作之旅
        </Title>
        <Paragraph className="text-lg mb-8">加入NicheFlow，体验智能化的内容创作和管理</Paragraph>
        <Link href="/auth/register">
          <Button type="primary" size="large">
            免费注册
          </Button>
        </Link>
      </div>
    </div>
  )
}
