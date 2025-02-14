'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ClientWrapper } from '@/components/providers/client-wrapper'
import AuthProvider from '@/providers/auth-provider'
import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useLanguageStore, getUserPreferredLanguage } from '@/stores/language-store'
import commonZh from '../../public/locales/zh/common.json'
import commonEn from '../../public/locales/en/common.json'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

// 获取初始语言
const initialLanguage = getUserPreferredLanguage()

// 初始化 i18next
i18next.use(initReactI18next).init({
  resources: {
    zh: {
      common: commonZh,
    },
    en: {
      common: commonEn,
    },
  },
  lng: initialLanguage, // 使用检测到的初始语言
  fallbackLng: 'en', // 找不到翻译时回退到英文
  interpolation: {
    escapeValue: false,
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguageStore()

  // 在组件挂载时进行一次性初始化
  useEffect(() => {
    const detectedLanguage = getUserPreferredLanguage()
    if (detectedLanguage !== language) {
      setLanguage(detectedLanguage)
    }
  }, [])

  // 语言变化时更新
  useEffect(() => {
    document.documentElement.lang = language
    i18next.changeLanguage(language)
  }, [language])

  return (
    <AuthProvider>
      <html lang={initialLanguage} suppressHydrationWarning>
        <head>
          <meta name="language" content={language} />
          <link rel="alternate" hrefLang="zh" href="https://nicheflow.com" />
          <link rel="alternate" hrefLang="en" href="https://nicheflow.com" />
          <link rel="alternate" hrefLang="x-default" href="https://nicheflow.com" />
        </head>
        <body className={inter.className}>
          <ClientWrapper>
            {children}
            <SpeedInsights />
          </ClientWrapper>
        </body>
      </html>
    </AuthProvider>
  )
}
