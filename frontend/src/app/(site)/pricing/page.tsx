'use client'

import { Button, Card, Col, Row, Typography, List } from 'antd'
import Link from 'next/link'

const { Title, Paragraph, Text } = Typography

const pricingPlans = [
  {
    title: '基础版',
    price: '￥99',
    period: '/月',
    features: ['每月生成50篇文章', '基础AI内容优化', '2个社交媒体账号', '基础数据分析', '邮件支持'],
    buttonText: '选择基础版',
    href: '/auth/register?plan=basic',
  },
  {
    title: '专业版',
    price: '￥199',
    period: '/月',
    features: [
      '每月生成200篇文章',
      '高级AI内容优化',
      '5个社交媒体账号',
      '详细数据分析',
      '优先邮件支持',
      '在线客服支持',
    ],
    buttonText: '选择专业版',
    href: '/auth/register?plan=pro',
    popular: true,
  },
  {
    title: '企业版',
    price: '￥499',
    period: '/月',
    features: [
      '无限生成文章',
      '企业级AI内容优化',
      '无限社交媒体账号',
      '高级数据分析和报告',
      '24/7专属客服支持',
      '定制化功能开发',
    ],
    buttonText: '联系销售',
    href: '/contact',
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <Title level={1}>选择适合您的方案</Title>
        <Paragraph className="text-lg">我们提供灵活的定价方案，满足不同规模企业的需求</Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {pricingPlans.map(plan => (
          <Col xs={24} sm={12} lg={8} key={plan.title}>
            <Card
              className={`h-full ${plan.popular ? 'border-primary' : ''}`}
              title={
                <div className="text-center">
                  <Title level={3}>{plan.title}</Title>
                  <div className="mt-4">
                    <Text className="text-3xl font-bold">{plan.price}</Text>
                    <Text className="text-gray-500">{plan.period}</Text>
                  </div>
                </div>
              }
            >
              <List
                dataSource={plan.features}
                renderItem={item => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
                className="mb-8"
              />
              <div className="text-center">
                <Link href={plan.href}>
                  <Button type={plan.popular ? 'primary' : 'default'} size="large">
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-16">
        <Title level={2}>需要更多信息？</Title>
        <Paragraph className="text-lg mb-8">我们的团队随时为您提供帮助，解答您的疑问</Paragraph>
        <Link href="/contact">
          <Button size="large">联系我们</Button>
        </Link>
      </div>
    </div>
  )
}
