'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SignInButton } from '@clerk/nextjs'

export default function MarketingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          NicheFlow - 智能内容创作平台
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          利用AI技术，轻松创建、管理和优化您的内容
        </p>
        <SignInButton mode="modal">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            立即开始
          </Button>
        </SignInButton>
      </div>

      {/* Features Section */}
      <div id="features" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">主要功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">智能内容生成</h3>
            <p className="text-muted-foreground">
              基于先进的AI模型，自动生成高质量、原创的内容，满足不同平台的需求
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">多平台管理</h3>
            <p className="text-muted-foreground">
              一站式管理多个社交媒体平台，提高内容发布效率，实现统一管理
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">数据分析</h3>
            <p className="text-muted-foreground">深入分析内容表现，获取关键指标，优化内容策略</p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">开始您的内容创作之旅</h2>
        <p className="text-xl text-muted-foreground mb-8">
          加入NicheFlow，体验智能化的内容创作和管理
        </p>
        <SignInButton mode="modal">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            免费注册
          </Button>
        </SignInButton>
      </div>
    </div>
  )
}
