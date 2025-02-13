'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { zhCN, enUS, zhTW, jaJP, frFR, deDE, itIT, esES, ptBR, nlNL } from '@clerk/localizations'
import { ReactNode, useEffect, useState } from 'react'
import { dark } from '@clerk/themes'

interface AuthProviderProps {
  children: ReactNode
}

// Clerk 主题配置
export const clerkAppearance = {
  variables: {
    colorPrimary: '#10b981',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
  },
  elements: {
    logoImage: {
      filter: 'none',
    },
    formButtonPrimary: {
      backgroundColor: '#10b981',
      '&:hover': {
        backgroundColor: '#059669',
      },
    },
    card: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
    },
    socialButtonsIconButton: {
      border: '1px solid #e5e7eb',
      '&:hover': {
        backgroundColor: '#f9fafb',
      },
    },
    footer: {
      '& + div': {
        display: 'none',
      },
    },
  },
  layout: {
    logoPlacement: 'inside' as const,
    logoImageUrl: '/logo.svg',
    socialButtonsVariant: 'iconButton' as const,
  },
} as const

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
  if (typeof window === 'undefined') return zhCN

  const userLang = navigator.language
  const langCode = userLang.split('-')[0].toLowerCase()

  // 完整匹配
  if (userLang in localizationMap) {
    return localizationMap[userLang as keyof typeof localizationMap]
  }

  // 语言代码匹配
  switch (langCode) {
    case 'zh':
      return zhCN
    case 'ja':
      return jaJP
    case 'fr':
      return frFR
    case 'de':
      return deDE
    case 'it':
      return itIT
    case 'es':
      return esES
    case 'pt':
      return ptBR
    case 'nl':
      return nlNL
    default:
      return enUS
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [localization, setLocalization] = useState(enUS)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      const html = document.documentElement
      const isDarkMode = html.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    // 创建观察器监听 HTML 类名变化
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // 初始检查
    checkTheme()

    // 设置语言
    setLocalization(getUserLocale())

    return () => observer.disconnect()
  }, [])

  return (
    <ClerkProvider
      localization={localization}
      appearance={{
        ...clerkAppearance,
        baseTheme: isDark ? dark : undefined,
      }}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/"
      signUpUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
