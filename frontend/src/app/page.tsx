'use client'

import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from '@clerk/nextjs'
import { LayoutSwitcher } from '@/components/layout/layout-switcher'
import Image from 'next/image'

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
        <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
          {/* Hero Section */}
          <div className="container mx-auto px-4 pt-20 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                NicheFlow - 智能内容创作平台
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                利用AI技术，轻松创建、管理和优化您的内容
              </p>
              <SignInButton mode="modal">
                <button className="!bg-emerald-500 hover:!bg-emerald-600 !text-white text-lg font-medium px-8 py-3 rounded-lg transform transition-all hover:scale-105 hover:shadow-lg">
                  免费开始使用
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 !bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/icons/ai.svg"
                    alt="AI"
                    width={24}
                    height={24}
                    className="!text-emerald-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">智能内容生成</h3>
                <p className="text-gray-600">
                  基于先进的AI模型，自动生成高质量、原创的内容，满足不同平台的需求
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 !bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/icons/platform.svg"
                    alt="Platform"
                    width={24}
                    height={24}
                    className="!text-emerald-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">多平台管理</h3>
                <p className="text-gray-600">
                  一站式管理多个社交媒体平台，提高内容发布效率，实现统一管理
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 !bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/icons/analytics.svg"
                    alt="Analytics"
                    width={24}
                    height={24}
                    className="!text-emerald-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">数据分析</h3>
                <p className="text-gray-600">深入分析内容表现，获取关键指标，优化内容策略</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold !text-emerald-500 mb-2">10K+</div>
                <div className="text-gray-600">活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold !text-emerald-500 mb-2">100M+</div>
                <div className="text-gray-600">生成内容</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold !text-emerald-500 mb-2">5+</div>
                <div className="text-gray-600">平台支持</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold !text-emerald-500 mb-2">99%</div>
                <div className="text-gray-600">用户好评</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
              <p className="text-xl text-gray-600 mb-8">立即加入 NicheFlow，开启您的智能创作之旅</p>
              <SignInButton mode="modal">
                <button className="!bg-emerald-500 hover:!bg-emerald-600 !text-white text-lg font-medium px-8 py-3 rounded-lg transform transition-all hover:scale-105 hover:shadow-lg">
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
