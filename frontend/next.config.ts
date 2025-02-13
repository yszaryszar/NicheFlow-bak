import type { NextConfig } from 'next'
import { i18n } from './next-i18next.config'

const config: NextConfig = {
  reactStrictMode: true,
  // 配置图片域名白名单
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  // 启用实验性功能
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
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
  // 环境变量
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
  // 启用 i18n 配置
  i18n,
}

export default config
