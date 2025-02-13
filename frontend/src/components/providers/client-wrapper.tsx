'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 创建一个新的 QueryClient 实例
const queryClient = new QueryClient()

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
