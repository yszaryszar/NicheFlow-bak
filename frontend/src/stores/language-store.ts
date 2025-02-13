import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

export type Language = 'en' | 'zh'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

// 获取用户首选语言
export const getUserPreferredLanguage = (): Language => {
  // 1. 首先检查 cookie
  const cookieLang = Cookies.get('language') as Language
  if (cookieLang && ['en', 'zh'].includes(cookieLang)) {
    return cookieLang
  }

  // 2. 检查浏览器语言
  if (typeof navigator !== 'undefined') {
    const browserLangs = navigator.languages || [navigator.language]
    for (const lang of browserLangs) {
      const normalizedLang = lang.toLowerCase()
      if (normalizedLang.startsWith('zh')) {
        return 'zh'
      }
    }
  }

  // 3. 默认返回英文
  return 'en'
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      language: getUserPreferredLanguage(),
      setLanguage: (lang: Language) => {
        set({ language: lang })
        // 同时更新 cookie，设置 path 为根路径确保整个站点可用
        Cookies.set('language', lang, { expires: 365, path: '/' })
        // 更新 html 标签的 lang 属性
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang
        }
      },
    }),
    {
      name: 'language-store',
    }
  )
)
