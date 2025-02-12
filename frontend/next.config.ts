import type { NextConfig } from 'next'

const config: NextConfig = {
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
  // 禁用 i18n 路由
  i18n: null,
  // 启用实验性功能
  experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
  },
  // 配置 webpack
  webpack(config) {
    // 处理 SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default config
