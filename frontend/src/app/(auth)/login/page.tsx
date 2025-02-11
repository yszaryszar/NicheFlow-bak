'use client'

import { Button, Divider, App } from 'antd'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const { message: antMsg } = App.useApp()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isLoading = status === 'loading'

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isRedirecting) {
      setIsRedirecting(true)
      antMsg.success('登录成功，欢迎回来：' + session.user.name)
      setTimeout(() => {
        router.push('/')
      }, 1000) // 延迟 1 秒后跳转，确保用户能看到成功提示
    }
  }, [session, router, antMsg, status, isRedirecting])

  useEffect(() => {
    // 检查URL中是否有错误信息
    const error = searchParams.get('error')
    if (error) {
      console.error('Login Error:', error)
      switch (error) {
        case 'OAuthSignin':
          antMsg.error('登录请求失败，请稍后重试')
          break
        case 'OAuthCallback':
          antMsg.error('OAuth回调失败，请检查配置')
          break
        case 'OAuthCreateAccount':
          antMsg.error('无法创建OAuth账户')
          break
        case 'EmailCreateAccount':
          antMsg.error('无法创建邮箱账户')
          break
        case 'Callback':
          antMsg.error('回调处理失败')
          break
        default:
          antMsg.error('登录失败：' + error)
      }
    }
  }, [searchParams, antMsg])

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      console.log('Starting OAuth sign in with:', provider)
      await signIn(provider, {
        callbackUrl: '/login', // 先回到登录页，让状态更新后再跳转
        redirect: true,
      })
    } catch (error) {
      console.error('OAuth sign in error:', error)
      antMsg.error('登录过程中发生错误，请稍后重试')
    }
  }

  // 如果正在加载会话，显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Button type="text" loading>
          正在加载...
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">登录到 NicheFlow</h1>
        <p className="text-sm text-gray-500 mt-2">
          还没有账号？{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            免费注册
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        {/* OAuth Buttons */}
        <Button
          size="large"
          className="w-full flex items-center justify-center space-x-2"
          icon={<FcGoogle className="text-xl" />}
          onClick={() => handleOAuthSignIn('google')}
          loading={isLoading}
        >
          使用 Google 账号登录
        </Button>
        <Button
          size="large"
          className="w-full flex items-center justify-center space-x-2"
          icon={<FaGithub className="text-xl" />}
          onClick={() => handleOAuthSignIn('github')}
          loading={isLoading}
        >
          使用 GitHub 账号登录
        </Button>

        <div className="relative">
          <Divider>或</Divider>
        </div>

        {/* Email Form */}
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>

            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              忘记密码？
            </Link>
          </div>

          <Button type="primary" size="large" className="w-full">
            登录
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <App>
      <LoginContent />
    </App>
  )
}
