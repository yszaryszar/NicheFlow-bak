'use client'

import { Anchor, Card, Col, Row, Typography, Button } from 'antd'
import Link from 'next/link'

const { Title, Paragraph } = Typography

const docSections = [
  {
    id: 'getting-started',
    title: '快速开始',
    content: [
      {
        title: '注册账号',
        text: '访问注册页面，填写必要信息创建您的账号。选择适合您需求的订阅方案。',
      },
      {
        title: '配置项目',
        text: '登录后，进入控制台创建您的第一个项目。设置项目基本信息和目标平台。',
      },
      {
        title: '创建内容',
        text: '使用我们的AI助手生成内容，您可以指定主题、风格和长度等参数。',
      },
    ],
  },
  {
    id: 'features',
    title: '功能指南',
    content: [
      {
        title: 'AI内容生成',
        text: '了解如何使用AI模型生成高质量内容，包括文章、标题和描述等。',
      },
      {
        title: '内容优化',
        text: '使用内置的SEO工具和内容分析功能优化您的内容，提高传播效果。',
      },
      {
        title: '数据分析',
        text: '通过数据面板查看内容表现，获取详细的分析报告和优化建议。',
      },
    ],
  },
  {
    id: 'api',
    title: 'API文档',
    content: [
      {
        title: 'API概述',
        text: '了解API的基本概念、认证方式和使用限制。',
      },
      {
        title: '接口列表',
        text: '查看完整的API接口文档，包括请求参数和响应示例。',
      },
      {
        title: 'SDK使用',
        text: '获取各种编程语言的SDK使用指南和示例代码。',
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Row gutter={24}>
        <Col xs={24} lg={6}>
          <Anchor
            items={docSections.map(section => ({
              key: section.id,
              href: `#${section.id}`,
              title: section.title,
            }))}
            className="bg-white p-4 rounded-lg"
          />
        </Col>
        <Col xs={24} lg={18}>
          {docSections.map(section => (
            <div key={section.id} id={section.id} className="mb-16">
              <Title level={2} className="mb-8">
                {section.title}
              </Title>
              <Row gutter={[16, 16]}>
                {section.content.map(item => (
                  <Col xs={24} md={12} key={item.title}>
                    <Card title={item.title}>
                      <Paragraph>{item.text}</Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Col>
      </Row>

      <div className="text-center mt-16">
        <Title level={2}>需要帮助？</Title>
        <Paragraph className="text-lg mb-8">
          如果您在使用过程中遇到任何问题，请随时联系我们的支持团队
        </Paragraph>
        <Link href="/help">
          <Button type="primary" size="large">
            获取支持
          </Button>
        </Link>
      </div>
    </div>
  )
}
