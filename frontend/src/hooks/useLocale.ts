import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

type Locale = 'zh' | 'en'

export function useLocale() {
  const router = useRouter()

  const setLocale = useCallback(
    (locale: Locale) => {
      // 设置 cookie
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
      // 刷新页面
      router.refresh()
    },
    [router]
  )

  return {
    setLocale,
  }
}
