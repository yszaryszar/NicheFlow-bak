'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { zhCN, enUS, zhTW, jaJP, frFR, deDE, itIT, esES, ptBR, nlNL } from '@clerk/localizations'
import { ReactNode, useEffect, useState } from 'react'
import { dark } from '@clerk/themes'
import { useLanguageStore } from '@/stores/language-store'

interface AuthProviderProps {
  children: ReactNode
}

// Clerk 主题配置
export const clerkAppearance = {
  variables: {
    colorPrimary: 'hsl(230 84% 54%)',
    colorDanger: 'hsl(0 84.2% 60.2%)',
    colorSuccess: 'hsl(142 71% 45%)',
  },
  elements: {
    logoImage: {
      filter:
        'brightness(0) saturate(100%) invert(27%) sepia(91%) saturate(1920%) hue-rotate(227deg) brightness(98%) contrast(96%)',
    },
    formButtonPrimary: {
      backgroundColor: 'hsl(230 84% 54%)',
      '&:hover': {
        backgroundColor: 'hsl(230 84% 48%)',
      },
    },
    card: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
    },
    socialButtonsIconButton: {
      border: '1px solid var(--border)',
      backgroundColor: 'var(--background)',
      '&:hover': {
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        borderColor: 'hsl(var(--primary))',
      },
      '& svg': {
        filter: 'var(--foreground-filter)',
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

// 暗色主题配置
export const darkAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    logoImage: {
      filter:
        'brightness(0) saturate(100%) invert(46%) sepia(98%) saturate(1932%) hue-rotate(218deg) brightness(95%) contrast(93%)',
    },
  },
}

// 语言映射
const localizationMap = {
  // 当前支持的语言
  zh: zhCN,
  en: enUS,
  // 预留的语言支持
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

// 获取本地化设置
const getLocalization = (language: string) => {
  // 优先使用当前支持的简单语言代码
  if (language === 'zh' || language === 'en') {
    return localizationMap[language]
  }

  // 如果是完整的语言代码，尝试匹配
  if (language in localizationMap) {
    return localizationMap[language as keyof typeof localizationMap]
  }

  // 提取语言代码前缀
  const langPrefix = language.split('-')[0].toLowerCase()

  // 根据语言前缀返回对应的本地化
  switch (langPrefix) {
    case 'zh':
      return zhCN
    case 'en':
      return enUS
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
  const [isDark, setIsDark] = useState(false)
  const { language } = useLanguageStore()

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

    return () => observer.disconnect()
  }, [])

  return (
    <ClerkProvider
      localization={getLocalization(language)}
      appearance={{
        ...(isDark ? darkAppearance : clerkAppearance),
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
