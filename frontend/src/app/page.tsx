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
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">快速操作</h2>
              {/* 添加快速操作按钮 */}
            </div>
            {/* 使用统计卡片 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">使用统计</h2>
              {/* 添加统计信息 */}
            </div>
            {/* 最近活动卡片 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">最近活动</h2>
              {/* 添加活动列表 */}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* 营销页面内容 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">NicheFlow - 智能内容创作平台</h1>
            <p className="text-xl text-gray-600 mb-8">利用AI技术，轻松创建、管理和优化您的内容</p>
            <SignInButton mode="modal">
              <button className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-600 transition-colors">
                免费开始使用
              </button>
            </SignInButton>
          </div>

          {/* 功能特性 */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">智能内容生成</h3>
              <p className="text-gray-600">
                基于先进的AI模型，自动生成高质量、原创的内容，满足不同平台的需求
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">多平台管理</h3>
              <p className="text-gray-600">
                一站式管理多个社交媒体平台，提高内容发布效率，实现统一管理
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">数据分析</h3>
              <p className="text-gray-600">深入分析内容表现，获取关键指标，优化内容策略</p>
            </div>
          </div>
        </div>
      )}
    </LayoutSwitcher>
  )
}
