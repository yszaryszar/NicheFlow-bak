'use client'

import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from '@clerk/nextjs'
import { LayoutSwitcher } from '@/components/layout/layout-switcher'

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth()

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return null
  }

  return (
    <LayoutSwitcher>
      {isAuthenticated ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">欢迎回来</h1>
          {/* 仪表板内容 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 快速操作卡片 */}
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">快速操作</h2>
              {/* 添加快速操作按钮 */}
            </div>
            {/* 使用统计卡片 */}
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">使用统计</h2>
              {/* 添加统计信息 */}
            </div>
            {/* 最近活动卡片 */}
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">最近活动</h2>
              {/* 添加活动列表 */}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-custom">
          {/* Hero Section */}
          <div className="container mx-auto px-4 pt-20 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-6">
                NicheFlow - 智能内容创作平台
              </h1>
              <p className="hero-subtitle text-xl mb-8">利用AI技术，轻松创建、管理和优化您的内容</p>
              <SignInButton mode="modal">
                <button className="button-hover bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-3 rounded-xl">
                  免费开始使用
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="glass card-hover rounded-xl p-8">
                <div className="icon-container">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                    <path
                      d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-4">智能内容生成</h3>
                <p className="card-description">
                  基于先进的AI模型，自动生成高质量、原创的内容，满足不同平台的需求
                </p>
              </div>
              <div className="glass card-hover rounded-xl p-8">
                <div className="icon-container">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                    <path
                      d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-4">多平台管理</h3>
                <p className="card-description">
                  一站式管理多个社交媒体平台，提高内容发布效率，实现统一管理
                </p>
              </div>
              <div className="glass card-hover rounded-xl p-8">
                <div className="icon-container">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                    <path
                      d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-4">数据分析</h3>
                <p className="card-description">深入分析内容表现，获取关键指标，优化内容策略</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="glass card-hover p-8 rounded-xl text-center">
                <div className="stats-number text-4xl mb-2">10K+</div>
                <div className="stats-label">活跃用户</div>
              </div>
              <div className="glass card-hover p-8 rounded-xl text-center">
                <div className="stats-number text-4xl mb-2">100M+</div>
                <div className="stats-label">生成内容</div>
              </div>
              <div className="glass card-hover p-8 rounded-xl text-center">
                <div className="stats-number text-4xl mb-2">5+</div>
                <div className="stats-label">平台支持</div>
              </div>
              <div className="glass card-hover p-8 rounded-xl text-center">
                <div className="stats-number text-4xl mb-2">99%</div>
                <div className="stats-label">用户好评</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="glass max-w-4xl mx-auto text-center p-12 rounded-2xl">
              <h2 className="hero-title text-3xl mb-4">准备好开始了吗？</h2>
              <p className="hero-subtitle text-xl mb-8">立即加入 NicheFlow，开启您的智能创作之旅</p>
              <SignInButton mode="modal">
                <button className="button-hover bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-3 rounded-xl">
                  免费开始使用
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}
    </LayoutSwitcher>
  )
}
