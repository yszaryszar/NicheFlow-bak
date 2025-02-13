'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        <h1 className="text-4xl font-bold mb-4">选择适合您的方案</h1>
        <p className="text-xl text-gray-600">我们提供灵活的定价方案，满足不同规模企业的需求</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingPlans.map(plan => (
          <Card
            key={plan.title}
            className={cn('relative overflow-hidden', plan.popular && 'border-emerald-500')}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm">
                推荐
              </div>
            )}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.href.includes('contact') ? (
                <Button className="w-full" asChild>
                  <Link href={plan.href}>{plan.buttonText}</Link>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    className={cn(
                      'w-full',
                      plan.popular && '!bg-emerald-500 hover:!bg-emerald-600'
                    )}
                  >
                    {plan.buttonText}
                  </Button>
                </SignInButton>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">需要更多信息？</h2>
        <p className="text-xl text-gray-600 mb-8">我们的团队随时为您提供帮助，解答您的疑问</p>
        <Button variant="outline" asChild>
          <Link href="/contact">联系我们</Link>
        </Button>
      </div>
    </div>
  )
}
