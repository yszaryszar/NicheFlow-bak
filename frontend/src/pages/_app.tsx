import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useLanguageStore } from '@/stores/language-store'
import commonZh from '../../public/locales/zh/common.json'
import commonEn from '../../public/locales/en/common.json'
import '../app/globals.css'

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
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

function App({ Component, pageProps }: AppProps) {
  const { language } = useLanguageStore()

  useEffect(() => {
    // 根据 store 中的语言设置更新 i18next
    i18next.changeLanguage(language)
  }, [language])

  return (
    <>
      <head>
        {/* 添加 hreflang 标签用于 SEO */}
        <link rel="alternate" hrefLang="en" href="https://nicheflow.com" />
        <link rel="alternate" hrefLang="zh" href="https://nicheflow.com" />
        <link rel="alternate" hrefLang="x-default" href="https://nicheflow.com" />
      </head>
      <Component {...pageProps} />
    </>
  )
}

export default App
