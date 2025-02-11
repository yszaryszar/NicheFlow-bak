const env = process.env.APP_ENV || 'development'

export const config = {
  env,
  isDev: env === 'development',
  isProd: env === 'production',
  isTest: env === 'test',
  
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  },

  auth: {
    cookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'nicheflow_token',
    cookieDomain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || 'localhost',
  },

  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    claudeKey: process.env.CLAUDE_API_KEY,
  },

  tiktok: {
    appId: process.env.NEXT_PUBLIC_TIKTOK_APP_ID,
    appSecret: process.env.NEXT_PUBLIC_TIKTOK_APP_SECRET,
  },
} as const

export type Config = typeof config 