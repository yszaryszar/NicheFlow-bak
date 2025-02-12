'use client'

import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  RiDashboardLine,
  RiFileTextLine,
  RiVideoLine,
  RiSettings4Line,
  RiCustomerServiceLine,
} from 'react-icons/ri'
import { Logo } from '@/components/ui/logo'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { UserMenu } from '@/components/ui/user-menu'

const { Header, Sider, Content } = Layout

const sidebarItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <RiDashboardLine className="text-lg" />,
    label: '工作台',
  },
  {
    key: '/dashboard/scripts',
    icon: <RiFileTextLine className="text-lg" />,
    label: 'TikTok脚本',
  },
  {
    key: '/dashboard/videos',
    icon: <RiVideoLine className="text-lg" />,
    label: '视频生成',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '/dashboard/settings',
    icon: <RiSettings4Line className="text-lg" />,
    label: '设置',
  },
  {
    key: '/dashboard/support',
    icon: <RiCustomerServiceLine className="text-lg" />,
    label: '帮助支持',
  },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sider
        theme="light"
        width={240}
        className="fixed left-0 top-0 bottom-0 border-r border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            <Logo />
          </div>

          {/* 导航菜单 */}
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={sidebarItems}
            onClick={({ key }) => router.push(key)}
            className="flex-1 border-none"
          />
        </div>
      </Sider>

      {/* 主要内容区域 */}
      <Layout className="ml-60">
        {/* 顶部栏 */}
        <Header className="bg-white border-b border-gray-200 px-6">
          <div className="flex items-center justify-end h-16 space-x-4">
            <ThemeSwitch />
            <UserMenu
              user={{
                name: '演示用户',
                email: 'demo@example.com',
              }}
            />
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="p-6">
          <main className="min-h-[calc(100vh-theme(spacing.32))]">{children}</main>
        </Content>
      </Layout>
    </Layout>
  )
}
