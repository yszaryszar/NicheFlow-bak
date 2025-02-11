import { Button, Divider } from 'antd'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
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
        >
          使用 Google 账号登录
        </Button>
        <Button
          size="large"
          className="w-full flex items-center justify-center space-x-2"
          icon={<FaGithub className="text-xl" />}
        >
          使用 GitHub 账号登录
        </Button>

        <div className="relative">
          <Divider>或</Divider>
        </div>

        {/* Email Form */}
        <form className="space-y-4">
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
