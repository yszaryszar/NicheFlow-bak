'use client'

import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { antdTheme, setThemeMode } from '@/lib/theme'
import { usePathname } from 'next/navigation'
import { MarketingLayout } from '@/components/layout/marketing-layout'
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
  const pathname = usePathname()

  // 初始化主题
  useEffect(() => {
    setThemeMode('system')
  }, [])

  // 判断是否使用营销布局
  const isMarketingPage = !pathname?.startsWith('/dashboard') && !pathname?.startsWith('/auth')

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antdTheme}>
            {isMarketingPage ? <MarketingLayout>{children}</MarketingLayout> : children}
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
