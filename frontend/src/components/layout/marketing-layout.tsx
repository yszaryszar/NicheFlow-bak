'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { NavMenu } from '@/components/ui/nav-menu'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { UserMenu } from '@/components/ui/user-menu'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { useTranslation } from 'react-i18next'

const marketingNavItems = [
  {
    key: 'features',
    label: 'nav.features',
    href: '/#features',
  },
  {
    key: 'pricing',
    label: 'nav.pricing',
    href: '/pricing',
  },
  {
    key: 'about',
    label: 'nav.about',
    href: '/about',
  },
]

interface MarketingLayoutProps {
  children: ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { t } = useTranslation('common')

  const translatedNavItems = marketingNavItems.map(item => ({
    ...item,
    label: t(item.label),
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="fixed z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:flex items-center ml-8">
              <NavMenu items={translatedNavItems} />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitch />
            <ThemeSwitch />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main>{children}</main>

      {/* 页脚 */}
      <footer className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-4 text-muted-foreground">
                {t('footer.description', 'AI驱动的垂直平台内容创作助手，让创作更简单、更高效。')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product', '产品')}</h3>
              <div className="space-y-3">
                <Link href="/#features" className="block text-muted-foreground hover:text-primary">
                  {t('footer.features', '功能介绍')}
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-primary">
                  {t('footer.pricing', '定价方案')}
                </Link>
                <Link href="/docs" className="block text-muted-foreground hover:text-primary">
                  {t('footer.docs', '使用教程')}
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.resources', '资源')}</h3>
              <div className="space-y-3">
                <Link href="/help" className="block text-muted-foreground hover:text-primary">
                  {t('footer.help', '帮助中心')}
                </Link>
                <Link href="/api" className="block text-muted-foreground hover:text-primary">
                  {t('footer.api', '开发文档')}
                </Link>
                <Link href="/changelog" className="block text-muted-foreground hover:text-primary">
                  {t('footer.changelog', '更新日志')}
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.about', '关于')}</h3>
              <div className="space-y-3">
                <Link href="/about" className="block text-muted-foreground hover:text-primary">
                  {t('footer.aboutUs', '关于我们')}
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-primary">
                  {t('footer.contact', '联系我们')}
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary">
                  {t('footer.terms', '使用条款')}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} NicheFlow. {t('footer.rights', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
