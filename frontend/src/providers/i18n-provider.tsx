'use client'

import { ReactNode, useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import { useLanguageStore, getUserPreferredLanguage } from '@/stores/language-store'
import commonZh from '../../public/locales/zh/common.json'
import commonEn from '../../public/locales/en/common.json'

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
  defaultNS: 'common',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

interface I18nProviderProps {
  children: ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { language } = useLanguageStore()

  useEffect(() => {
    const detectedLanguage = getUserPreferredLanguage()
    i18next.changeLanguage(detectedLanguage)
  }, [])

  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language)
    }
  }, [language])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
