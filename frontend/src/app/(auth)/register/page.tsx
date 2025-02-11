import { Button, Divider } from 'antd'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">创建 NicheFlow 账号</h1>
        <p className="text-sm text-gray-500 mt-2">
          已有账号？{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            立即登录
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
          使用 Google 账号注册
        </Button>
        <Button
          size="large"
          className="w-full flex items-center justify-center space-x-2"
          icon={<FaGithub className="text-xl" />}
        >
          使用 GitHub 账号注册
        </Button>

        <div className="relative">
          <Divider>或</Divider>
        </div>

        {/* Email Form */}
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

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
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              我同意{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                服务条款
              </Link>{' '}
              和{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                隐私政策
              </Link>
            </label>
          </div>

          <Button type="primary" size="large" className="w-full">
            注册
          </Button>
        </form>
      </div>
    </div>
  )
}
