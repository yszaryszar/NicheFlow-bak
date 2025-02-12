'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { DashboardLayout } from './dashboard-layout'
import { MarketingLayout } from './marketing-layout'

interface LayoutSwitcherProps {
  children: ReactNode
}

export function LayoutSwitcher({ children }: LayoutSwitcherProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // 如果正在加载，不显示任何内容
  if (isLoading) return null

  // 根据认证状态选择布局
  const LayoutComponent = isAuthenticated ? DashboardLayout : MarketingLayout

  return <LayoutComponent>{children}</LayoutComponent>
}
