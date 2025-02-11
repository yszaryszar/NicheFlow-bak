'use client'

import { ConfigProvider } from 'antd'
import { theme } from '@/styles/theme'
import { PropsWithChildren } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { messages } from '@/i18n/config'
import { IntlProvider } from 'react-intl'

export function Providers({ children }: PropsWithChildren) {
  const { locale } = useLocale()

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </IntlProvider>
  )
}
