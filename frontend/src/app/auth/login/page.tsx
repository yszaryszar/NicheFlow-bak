'use client'

import { Button, Card, Divider, Typography, message } from 'antd'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { authService, Provider } from '@/services/auth'
import { ApiResponse } from '@/lib/api-client'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 获取认证提供商列表
    authService
      .getProviders()
      .then((res: ApiResponse<{ providers: Provider[] }>) => {
        // 保存提供商列表，但目前未使用
        console.log('Available providers:', res.data?.providers)
      })
      .catch((error: Error) => {
        message.error(error.message)
      })
  }, [])

  const handleLogin = async (providerId: string) => {
    try {
      setLoading(true)
      const res = await authService.getAuthUrl(providerId)
      if (res.data?.url) {
        window.location.assign(res.data.url)
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <Title level={2}>欢迎使用 NicheFlow</Title>
          <Text className="text-gray-600">AI 驱动的垂直平台内容创作助手</Text>
        </div>

        <div className="space-y-4">
          <Button
            type="default"
            size="large"
            block
            icon={<FaGoogle className="mr-2" />}
            onClick={() => handleLogin('google')}
            loading={loading}
            className="flex items-center justify-center"
          >
            使用 Google 账号登录
          </Button>

          <Button
            type="default"
            size="large"
            block
            icon={<FaGithub className="mr-2" />}
            onClick={() => handleLogin('github')}
            loading={loading}
            className="flex items-center justify-center"
          >
            使用 GitHub 账号登录
          </Button>
        </div>

        <Divider>
          <Text type="secondary">安全登录 · 高效创作</Text>
        </Divider>

        <div className="text-center text-sm text-gray-500">
          <Text>登录即表示您同意我们的</Text>
          <Button type="link" className="px-1">
            服务条款
          </Button>
          <Text>和</Text>
          <Button type="link" className="px-1">
            隐私政策
          </Button>
        </div>
      </Card>
    </div>
  )
}
