'use client'

import { ConfigProvider } from 'antd'
import { theme } from '@/styles/theme'
import { PropsWithChildren } from 'react'
import { NextIntlClientProvider } from 'next-intl'

interface ProvidersProps extends PropsWithChildren {
  locale: string
  messages: Record<string, any>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </NextIntlClientProvider>
  )
}
