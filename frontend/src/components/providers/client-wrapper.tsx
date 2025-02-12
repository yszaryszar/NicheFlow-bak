'use client'

import { ReactNode } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { antdTheme } from '@/theme/antd'

// 创建一个新的 QueryClient 实例
const queryClient = new QueryClient()

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <StyleProvider hashPriority="high">
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
      </QueryClientProvider>
    </StyleProvider>
  )
}
