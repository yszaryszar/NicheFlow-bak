'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { NavMenu } from '@/components/ui/nav-menu'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { UserMenu } from '@/components/ui/user-menu'

const marketingNavItems = [
  {
    key: 'features',
    label: '功能',
    href: '/#features',
  },
  {
    key: 'pricing',
    label: '定价',
    href: '/pricing',
  },
  {
    key: 'about',
    label: '关于',
    href: '/about',
  },
]

interface MarketingLayoutProps {
  children: ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <header className="fixed z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <div className="flex items-center">
            <Logo className="text-gray-900" />
            <div className="hidden md:flex items-center ml-8">
              <NavMenu items={marketingNavItems} theme="light" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeSwitch />
            <UserMenu theme="light" />
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main>{children}</main>

      {/* 页脚 */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-4 text-gray-500">
                AI驱动的垂直平台内容创作助手，让创作更简单、更高效。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <div className="space-y-3">
                <Link href="/#features" className="block text-gray-500 hover:text-emerald-600">
                  功能介绍
                </Link>
                <Link href="/pricing" className="block text-gray-500 hover:text-emerald-600">
                  定价方案
                </Link>
                <Link href="/docs" className="block text-gray-500 hover:text-emerald-600">
                  使用教程
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">资源</h3>
              <div className="space-y-3">
                <Link href="/help" className="block text-gray-500 hover:text-emerald-600">
                  帮助中心
                </Link>
                <Link href="/api" className="block text-gray-500 hover:text-emerald-600">
                  开发文档
                </Link>
                <Link href="/changelog" className="block text-gray-500 hover:text-emerald-600">
                  更新日志
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">关于</h3>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-500 hover:text-emerald-600">
                  关于我们
                </Link>
                <Link href="/contact" className="block text-gray-500 hover:text-emerald-600">
                  联系我们
                </Link>
                <Link href="/terms" className="block text-gray-500 hover:text-emerald-600">
                  使用条款
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} NicheFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
