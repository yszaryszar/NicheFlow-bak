import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

export function Nav() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { locale } = router

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <nav className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              NicheFlow
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="nav-link">
                {t('nav.home')}
              </Link>
              <Link href="/features" className="nav-link">
                {t('nav.features')}
              </Link>
              <Link href="/pricing" className="nav-link">
                {t('nav.pricing')}
              </Link>
              <Link href="/about" className="nav-link">
                {t('nav.about')}
              </Link>

              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => changeLanguage('zh')}
                  className={`px-3 py-1 rounded ${
                    locale === 'zh' ? 'bg-primary text-white' : 'text-foreground/80'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded ${
                    locale === 'en' ? 'bg-primary text-white' : 'text-foreground/80'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
