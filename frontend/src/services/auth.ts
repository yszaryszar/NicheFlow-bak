import api from '@/lib/api-client'

export interface Provider {
  id: string
  name: string
  type: string
  scopes: string[]
}

export interface User {
  id: number
  email: string
  name: string
  image: string
  provider: string
  role: string
  status: string
  subscription_status: string
  usage_limit: number
  usage_count: number
  monthly_limit: number
  monthly_count: number
}

export interface Session {
  id: string
  user_id: number
  expires_at: string
  session_token: string
}

export interface AuthResponse {
  session: Session
  user: User
  access_token: string
}

// 认证服务
export const authService = {
  // 获取认证提供商列表
  getProviders: () => {
    return api.get<{ providers: Provider[] }>('/auth/providers')
  },

  // 获取认证 URL
  getAuthUrl: (provider: string) => {
    return api.get<{ url: string }>(`/auth/url/${provider}`)
  },

  // 处理认证回调
  handleCallback: (provider: string, code: string) => {
    return api.get<AuthResponse>(`/auth/callback/${provider}?code=${code}`)
  },

  // 获取当前会话
  getSession: () => {
    return api.get<{ user: User }>('/auth/session')
  },

  // 退出登录
  signOut: () => {
    return api.post<{ message: string }>('/auth/signout')
  },

  // 验证邮箱
  verifyEmail: (token: string) => {
    return api.get<{ message: string }>(`/auth/verify-email?token=${token}`)
  },
}

export default authService
