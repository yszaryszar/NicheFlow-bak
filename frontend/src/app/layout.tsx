'use client'

import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { antdTheme, setThemeMode } from '@/lib/theme'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 初始化主题
  useEffect(() => {
    setThemeMode('system')
  }, [])

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
