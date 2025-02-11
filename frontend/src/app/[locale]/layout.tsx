import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '../providers'
import { locales } from '@/i18n/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NicheFlow - AI驱动的垂直平台内容创作助手',
  description: '帮助 TikTok 博主、独立站卖家和短视频创作者生成高质量的内容',
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  let messages
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default
  } catch (error) {
    messages = (await import(`@/i18n/locales/zh.json`)).default
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
