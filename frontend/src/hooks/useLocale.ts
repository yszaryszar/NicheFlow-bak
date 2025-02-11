import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

type Locale = 'zh' | 'en'

export function useLocale() {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>('zh')

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
      router.refresh()
    },
    [router]
  )

  return {
    locale,
    setLocale,
  }
}
