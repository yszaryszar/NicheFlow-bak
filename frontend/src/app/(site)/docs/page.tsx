'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边导航 */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-2 bg-white p-4 rounded-lg">
            {docSections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block py-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* 主要内容 */}
        <div className="lg:col-span-3">
          {docSections.map(section => (
            <div key={section.id} id={section.id} className="mb-16">
              <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.content.map(item => (
                  <Card key={item.title} className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">需要帮助？</h2>
        <p className="text-xl text-gray-600 mb-8">
          如果您在使用过程中遇到任何问题，请随时联系我们的支持团队
        </p>
        <Button asChild>
          <Link href="/help">获取支持</Link>
        </Button>
      </div>
    </div>
  )
}
