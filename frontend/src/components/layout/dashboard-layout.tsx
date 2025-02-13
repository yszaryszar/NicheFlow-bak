'use client'

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
import { LanguageSwitch } from '@/components/ui/language-switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type SidebarItem =
  | {
      key: string
      icon: JSX.Element
      labelKey: string
      disabled?: boolean
    }
  | {
      type: 'divider'
    }

const sidebarItems: SidebarItem[] = [
  {
    key: '/',
    icon: <RiDashboardLine className="text-lg" />,
    labelKey: 'dashboard.menu.workspace',
  },
  {
    key: '/dashboard/scripts',
    icon: <RiFileTextLine className="text-lg" />,
    labelKey: 'dashboard.menu.scripts',
  },
  {
    key: '/dashboard/videos',
    icon: <RiVideoLine className="text-lg" />,
    labelKey: 'dashboard.menu.videos',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '/dashboard/settings',
    icon: <RiSettings4Line className="text-lg" />,
    labelKey: 'dashboard.menu.settings',
  },
  {
    key: '/dashboard/support',
    icon: <RiCustomerServiceLine className="text-lg" />,
    labelKey: 'dashboard.menu.support',
  },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 border-r border-border bg-background/80 backdrop-blur-md">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            <Logo />
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {sidebarItems.map(item =>
                'type' in item ? (
                  <hr key="divider" className="my-4 border-border" />
                ) : (
                  <Button
                    key={item.key}
                    variant={pathname === item.key ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 font-normal',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !item.disabled && router.push(item.key)}
                  >
                    {item.icon}
                    {t(item.labelKey)}
                  </Button>
                )
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* 主要内容区域 */}
      <div className="ml-60">
        {/* 顶部栏 */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-end space-x-4">
          <LanguageSwitch />
          <ThemeSwitch />
          <UserMenu />
        </header>

        {/* 内容区域 */}
        <main className="p-6 min-h-[calc(100vh-theme(spacing.32))]">{children}</main>
      </div>
    </div>
  )
}
