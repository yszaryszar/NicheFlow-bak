import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NicheFlow',
  description: '一个专注于垂直领域的内容生成平台',
  alternates: {
    languages: {
      en: 'https://nicheflow.com',
      zh: 'https://nicheflow.com',
      'x-default': 'https://nicheflow.com',
    },
  },
  openGraph: {
    title: 'NicheFlow',
    description: '一个专注于垂直领域的内容生成平台',
    url: 'https://nicheflow.com',
    siteName: 'NicheFlow',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NicheFlow',
    description: '一个专注于垂直领域的内容生成平台',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}
