'use client'

import { ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from '@/styles/theme'
import { PropsWithChildren } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { messages } from '@/i18n/config'
import { IntlProvider } from 'react-intl'
import { queryClient } from '@/lib/query-client'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: PropsWithChildren) {
  const { locale } = useLocale()
  const localeMessages: Record<string, string> = messages[locale] as Record<string, string>

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <IntlProvider messages={localeMessages} locale={locale}>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </IntlProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  )
}
