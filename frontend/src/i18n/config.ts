import type { MessageFormatElement } from 'react-intl'
import zhCN from './locales/zh.json'
import enUS from './locales/en.json'

export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

export const messages: Record<Locale, Record<string, string | MessageFormatElement[]>> = {
  zh: zhCN,
  en: enUS,
}

export const defaultLocale: Locale = 'zh'

export const localeNames: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
}
