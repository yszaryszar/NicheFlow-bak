'use client'

import { Select } from 'antd'
import { useLocale } from '@/hooks/useLocale'
import { localeNames, locales } from '@/i18n/config'
import { GlobalOutlined } from '@ant-design/icons'

export function LocaleSwitch() {
  const { locale, setLocale } = useLocale()

  return (
    <Select
      value={locale}
      onChange={setLocale}
      options={locales.map(locale => ({
        label: localeNames[locale],
        value: locale,
      }))}
      prefix={<GlobalOutlined />}
      style={{ width: 120 }}
    />
  )
}
