'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  RiDashboardLine,
  RiFileTextLine,
  RiVideoLine,
  RiSettings4Line,
  RiCustomerServiceLine,
  RiArrowRightSLine,
  RiUser3Line,
  RiShieldKeyholeLine,
  RiBellLine,
  RiPaletteLine,
  RiGlobalLine,
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
      children?: {
        key: string
        icon: JSX.Element
        labelKey: string
      }[]
    }
  | {
      type: 'divider'
    }

const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    icon: <RiDashboardLine className="h-5 w-5" />,
    labelKey: 'dashboard.menu.workspace',
  },
  {
    key: 'scripts',
    icon: <RiFileTextLine className="h-5 w-5" />,
    labelKey: 'dashboard.menu.scripts',
  },
  {
    key: 'videos',
    icon: <RiVideoLine className="h-5 w-5" />,
    labelKey: 'dashboard.menu.videos',
  },
  {
    key: 'settings',
    icon: <RiSettings4Line className="h-5 w-5" />,
    labelKey: 'dashboard.menu.settings',
    children: [
      {
        key: 'profile',
        icon: <RiUser3Line className="h-5 w-5" />,
        labelKey: 'settings.menu.profile',
      },
      {
        key: 'appearance',
        icon: <RiPaletteLine className="h-5 w-5" />,
        labelKey: 'settings.menu.appearance',
      },
      {
        key: 'language',
        icon: <RiGlobalLine className="h-5 w-5" />,
        labelKey: 'settings.menu.language',
      },
      {
        key: 'security',
        icon: <RiShieldKeyholeLine className="h-5 w-5" />,
        labelKey: 'settings.menu.security',
      },
      {
        key: 'notifications',
        icon: <RiBellLine className="h-5 w-5" />,
        labelKey: 'settings.menu.notifications',
      },
    ],
  },
  {
    key: 'support',
    icon: <RiCustomerServiceLine className="h-5 w-5" />,
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // 处理初始展开状态
  useEffect(() => {
    if (pathname?.startsWith('/settings')) {
      setExpandedItem('/settings')
    }
  }, [pathname])

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
                ) : item.children ? (
                  <div key={item.key}>
                    <Button
                      variant={pathname?.startsWith(item.key) ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 font-normal',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        pathname?.startsWith(item.key) && item.children
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : pathname?.startsWith(item.key)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : ''
                      )}
                      onClick={() => {
                        if (item.children) {
                          setExpandedItem(expandedItem === item.key ? null : item.key)
                          if (item.key === '/settings') {
                            router.push(item.children[0].key)
                          }
                        } else if (!item.disabled) {
                          router.push(item.key)
                          setExpandedItem(null)
                        }
                      }}
                    >
                      {item.icon}
                      {t(item.labelKey)}
                      {item.children && (
                        <RiArrowRightSLine
                          className={cn(
                            'ml-auto text-lg transition-transform',
                            expandedItem === item.key && 'rotate-90'
                          )}
                        />
                      )}
                    </Button>
                    {expandedItem === item.key && item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map(child => (
                          <Button
                            key={child.key}
                            variant={pathname === child.key ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-3 font-normal text-sm',
                              pathname === child.key
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:bg-accent'
                            )}
                            onClick={() => router.push(child.key)}
                          >
                            {child.icon}
                            {t(child.labelKey)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    key={item.key}
                    variant={pathname === item.key ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 font-normal',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      pathname === item.key &&
                        'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                    onClick={() => {
                      if (!item.disabled) {
                        router.push(item.key)
                        setExpandedItem(null)
                      }
                    }}
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
