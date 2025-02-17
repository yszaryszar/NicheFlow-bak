'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ClientWrapper } from '@/components/providers/client-wrapper'
import AuthProvider from '@/providers/auth-provider'
import I18nProvider from '@/providers/i18n-provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LayoutSwitcher } from '@/components/layout/layout-switcher'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="zh" suppressHydrationWarning>
        <head>
          <link rel="alternate" hrefLang="zh" href="https://nicheflow.com" />
          <link rel="alternate" hrefLang="en" href="https://nicheflow.com" />
          <link rel="alternate" hrefLang="x-default" href="https://nicheflow.com" />
        </head>
        <body className={inter.className}>
          <ClientWrapper>
            <I18nProvider>
              <LayoutSwitcher>{children}</LayoutSwitcher>
              <Toaster richColors position="top-right" />
              <SpeedInsights />
            </I18nProvider>
          </ClientWrapper>
        </body>
      </html>
    </AuthProvider>
  )
}
