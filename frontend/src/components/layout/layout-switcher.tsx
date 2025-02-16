'use client'

import { ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DashboardLayout } from './dashboard-layout'
import { MarketingLayout } from './marketing-layout'
import { usePathname } from 'next/navigation'

interface LayoutSwitcherProps {
  children: ReactNode
}

export function LayoutSwitcher({ children }: LayoutSwitcherProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const pathname = usePathname()

  // 如果认证状态还未加载完成，不显示任何内容
  if (!isLoaded) return null

  // 特定路径使用特定布局
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return <>{children}</>
  }

  // 根据认证状态选择布局
  const LayoutComponent = isSignedIn ? DashboardLayout : MarketingLayout

  return <LayoutComponent>{children}</LayoutComponent>
}
