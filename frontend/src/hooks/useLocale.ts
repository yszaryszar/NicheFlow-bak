import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Locale } from '@/i18n/config'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

// 创建语言状态管理
export const useLocaleStore = create<LocaleState>()(
  persist(
    set => ({
      locale: 'zh', // 默认使用中文
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    }
  )
)

export function useLocale() {
  const { locale, setLocale } = useLocaleStore()

  // 初始化语言设置
  useEffect(() => {
    // 从 localStorage 获取语言设置
    const savedLocale = localStorage.getItem('locale-storage')
    if (savedLocale) {
      try {
        const { state } = JSON.parse(savedLocale)
        if (state.locale && (state.locale === 'zh' || state.locale === 'en')) {
          setLocale(state.locale)
        }
      } catch (e) {
        console.error('解析语言设置失败:', e)
      }
    }
  }, [setLocale])

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      setLocale(newLocale)
      localStorage.setItem('locale-storage', JSON.stringify({ state: { locale: newLocale } }))
    },
    [setLocale]
  )

  return {
    locale,
    setLocale: handleLocaleChange,
  }
}
