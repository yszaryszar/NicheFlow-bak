'use client'

import { Button, Card, Col, Row, Typography, Collapse, Form, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { TextArea } = Input

const faqs = [
  {
    question: '如何开始使用NicheFlow？',
    answer:
      '注册账号后，您可以选择适合的订阅方案开始使用。我们提供详细的新手指南和视频教程，帮助您快速上手。',
  },
  {
    question: '支持哪些内容平台？',
    answer:
      '目前我们支持主流社交媒体平台，包括微信公众号、抖音、小红书、知乎等。我们会持续增加更多平台的支持。',
  },
  {
    question: 'AI生成的内容是否原创？',
    answer:
      '是的，我们的AI模型经过专门训练，能够生成原创、独特的内容。每篇内容都会经过查重和优化，确保原创性。',
  },
  {
    question: '如何确保内容质量？',
    answer:
      '我们的AI模型会根据您的需求和目标受众生成内容，并提供人工审核和编辑功能，让您可以进一步优化内容质量。',
  },
  {
    question: '订阅方案可以更改吗？',
    answer:
      '是的，您可以随时升级或降级您的订阅方案。升级后即可立即使用新方案的功能，降级将在下个计费周期生效。',
  },
  {
    question: '提供企业定制服务吗？',
    answer:
      '是的，我们为企业用户提供定制化服务，包括专属功能开发、API集成、培训支持等。请联系我们的销售团队了解详情。',
  },
]

interface ContactFormValues {
  name: string
  email: string
  message: string
}

export default function HelpPage() {
  const [form] = Form.useForm<ContactFormValues>()

  const handleSubmit = (values: ContactFormValues) => {
    console.log('提交的表单数据:', values)
    // TODO: 实现表单提交逻辑
    form.resetFields()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <Title level={1}>帮助中心</Title>
        <Paragraph className="text-lg">查找常见问题的解答，或直接联系我们获取支持</Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Title level={2} className="mb-8">
            常见问题
          </Title>
          <Collapse
            items={faqs.map((faq, index) => ({
              key: index,
              label: faq.question,
              children: <Paragraph>{faq.answer}</Paragraph>,
            }))}
            className="mb-8"
          />
          <Paragraph className="text-center mt-8">
            没有找到您需要的答案？
            <Button type="link" href="#contact-form">
              联系我们获取帮助
            </Button>
          </Paragraph>
        </Col>

        <Col xs={24} lg={8}>
          <Card id="contact-form">
            <Title level={2} className="mb-8">
              联系我们
            </Title>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入您的姓名' }]}
              >
                <Input placeholder="请输入您的姓名" />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入您的邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="请输入您的邮箱" />
              </Form.Item>
              <Form.Item
                name="message"
                label="问题描述"
                rules={[{ required: true, message: '请描述您的问题' }]}
              >
                <TextArea placeholder="请详细描述您遇到的问题" rows={4} showCount maxLength={500} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} block>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
