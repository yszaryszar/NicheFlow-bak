import type { NextConfig } from 'next'

const config: NextConfig = {
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
  // 禁用 i18n 路由
  i18n: null,
}

export default config
