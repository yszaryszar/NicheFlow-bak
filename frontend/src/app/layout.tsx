import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientWrapper } from '@/components/providers/client-wrapper'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkAppearance } from '@/providers/auth-provider'
import { zhCN, enUS, zhTW, jaJP, frFR, deDE, itIT, esES, ptBR, nlNL } from '@clerk/localizations'
import '@ant-design/v5-patch-for-react-19'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NicheFlow',
  description: '一个专注于垂直领域的内容生成平台',
}

// 语言映射
const localizationMap = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
  'ja-JP': jaJP,
  'fr-FR': frFR,
  'de-DE': deDE,
  'it-IT': itIT,
  'es-ES': esES,
  'pt-BR': ptBR,
  'nl-NL': nlNL,
} as const

// 获取用户语言设置
const getUserLocale = () => {
  if (typeof navigator === 'undefined') return zhCN
  const userLang = navigator.language
  return localizationMap[userLang as keyof typeof localizationMap] || zhCN
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={getUserLocale()} appearance={clerkAppearance}>
      <html lang="zh-CN" suppressHydrationWarning>
        <body className={inter.className}>
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  )
}
