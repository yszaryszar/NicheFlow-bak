import type { NextConfig } from 'next'
import { i18n } from './next-i18next.config'
import { withAxiom } from 'next-axiom'

const config: NextConfig = {
  reactStrictMode: true,
  // 配置图片域名白名单
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'nicheflow.com'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
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
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Accept-CH',
          value: 'DPR, Viewport-Width, Width',
        },
        {
          key: 'Vary',
          value: 'Accept-Encoding',
        },
      ],
    },
  ],
}

export default withAxiom(config)
