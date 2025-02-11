'use client'

import { Select } from 'antd'
import { useLocale } from '@/hooks/useLocale'
import { localeNames } from '@/i18n/config'

export default function LocaleSelect() {
  const { locale, setLocale } = useLocale()

  return (
    <Select
      value={locale}
      onChange={setLocale}
      style={{ width: 120 }}
      options={Object.entries(localeNames).map(([value, label]) => ({
        value,
        label,
      }))}
    />
  )
}
