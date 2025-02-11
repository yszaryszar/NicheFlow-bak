'use client'

import { Button, Result } from 'antd'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return '访问被拒绝，请确保您有权限访问此资源。'
      case 'Verification':
        return '验证失败，请重新尝试。'
      case 'Configuration':
        return '系统配置错误，请联系管理员。'
      case 'OAuthSignin':
        return '第三方登录初始化失败，请重试。'
      case 'OAuthCallback':
        return '第三方登录回调失败，请重试。'
      case 'OAuthCreateAccount':
        return '创建账号失败，请重试。'
      case 'EmailCreateAccount':
        return '创建账号失败，该邮箱可能已被使用。'
      case 'Callback':
        return '回调处理失败，请重试。'
      case 'OAuthAccountNotLinked':
        return '此邮箱已关联其他账号，请使用原有登录方式。'
      case 'EmailSignin':
        return '邮箱登录失败，请检查邮箱地址是否正确。'
      case 'CredentialsSignin':
        return '登录凭证无效，请检查输入是否正确。'
      case 'SessionRequired':
        return '请先登录后再访问此页面。'
      default:
        return '登录过程中发生错误，请重试。'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="error"
        title="登录失败"
        subTitle={getErrorMessage()}
        extra={[
          <Button type="primary" key="retry" onClick={() => router.push('/auth/login')}>
            重新登录
          </Button>,
          <Button key="home" onClick={() => router.push('/')}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  )
}
