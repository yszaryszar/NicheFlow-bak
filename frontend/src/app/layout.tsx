import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientWrapper } from '@/components/providers/client-wrapper'
import AuthProvider from '@/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NicheFlow',
  description: '一个专注于垂直领域的内容生成平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="zh-CN" suppressHydrationWarning>
        <body className={inter.className}>
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </html>
    </AuthProvider>
  )
}
