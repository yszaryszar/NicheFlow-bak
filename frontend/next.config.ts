import { withNextIntl } from 'next-intl/plugin'

const config = {
  // 启用 App Router 国际化
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
}

export default withNextIntl()(config)
