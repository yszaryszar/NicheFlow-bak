'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { message } from 'antd'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/auth'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore(state => state.setAuth)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const provider = searchParams.get('provider')
        const code = searchParams.get('code')

        if (!provider || !code) {
          message.error('认证参数无效')
          router.push('/auth/login')
          return
        }

        const res = await authService.handleCallback(provider, code)
        if (res.data) {
          const { user, access_token } = res.data
          setAuth(user, access_token)
          message.success('登录成功')
          router.push('/dashboard')
        }
      } catch (error) {
        if (error instanceof Error) {
          message.error(error.message)
        }
        router.push('/auth/error')
      }
    }

    handleCallback()
  }, [router, searchParams, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">正在处理认证...</h2>
        <p className="text-gray-600">请稍候，我们正在验证您的身份</p>
      </div>
    </div>
  )
}
