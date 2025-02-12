'use client'

import { ReactNode } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from '@/providers/auth-provider'
import { antdTheme } from '@/theme/antd'
import { usePathname } from 'next/navigation'
import { MarketingLayout } from '@/components/layout/marketing-layout'

// 创建一个新的 QueryClient 实例
const queryClient = new QueryClient()

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname()
  const isMarketingPage = pathname === '/' || pathname?.startsWith('/marketing')

  return (
    <AuthProvider>
      <StyleProvider hashPriority="high">
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antdTheme}>
            {isMarketingPage ? <MarketingLayout>{children}</MarketingLayout> : children}
          </ConfigProvider>
        </QueryClientProvider>
      </StyleProvider>
    </AuthProvider>
  )
}
