'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { zhCN, enUS } from '@clerk/localizations'
import { ReactNode, useEffect, useState } from 'react'
import { dark } from '@clerk/themes'

interface AuthProviderProps {
  children: ReactNode
}

// Clerk 主题配置
export const clerkAppearance = {
  layout: {
    helpPageUrl: '/help',
    privacyPageUrl: '/privacy',
    termsPageUrl: '/terms',
    shimmer: true,
    socialButtonsPlacement: 'bottom' as const,
    socialButtonsVariant: 'iconButton' as const,
  },
  variables: {
    colorPrimary: '#10b981',
    colorText: '#000000',
    colorBackground: '#ffffff',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    borderRadius: '0.5rem',
    fontFamily: 'var(--font-inter)',
    fontSize: '16px',
  },
  elements: {
    card: 'shadow-xl rounded-xl border border-gray-100',
    headerTitle: 'text-xl font-semibold',
    headerSubtitle: 'text-gray-500',
    socialButtons: 'gap-2',
    formButtonPrimary: '!bg-emerald-500 hover:!bg-emerald-600 !text-white rounded-lg px-4 py-2',
    footerActionLink: 'text-emerald-600 hover:text-emerald-700',
    modalBackdrop: 'backdrop-blur-sm bg-black/50',
    modalContent: 'shadow-xl rounded-xl border-gray-100 max-w-md mx-auto',
    form: 'space-y-4',
    formField: 'space-y-1',
    formFieldLabel: 'text-sm font-medium text-gray-700',
    formFieldInput:
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
    formFieldError: 'text-sm text-red-500',
    dividerLine: 'bg-gray-200',
    dividerText: 'text-gray-500 bg-white px-2',
    navbar: 'hidden',
    navbarButtons: 'hidden',
  },
  baseTheme: dark,
}

// 语言配置
export const supportedLanguages = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
  'ja-JP': '日本語',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'es-ES': 'Español',
  'pt-BR': 'Português',
  'nl-NL': 'Nederlands',
} as const

// 获取浏览器语言并匹配支持的语言
export function getBrowserLanguage(): string {
  const browserLang = navigator.language.toLowerCase()

  // 检查完整匹配
  if (browserLang in supportedLanguages) {
    return browserLang
  }

  // 检查语言代码匹配（例如 'zh' 匹配 'zh-CN'）
  const langCode = browserLang.split('-')[0]
  const match = Object.keys(supportedLanguages).find(key => key.startsWith(langCode))

  return match || 'en-US'
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [localization, setLocalization] = useState(enUS)

  useEffect(() => {
    const userLanguage = navigator.language.toLowerCase()
    setLocalization(userLanguage.startsWith('zh') ? zhCN : enUS)
  }, [])

  return (
    <ClerkProvider
      localization={localization}
      appearance={clerkAppearance}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/"
      signUpUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
