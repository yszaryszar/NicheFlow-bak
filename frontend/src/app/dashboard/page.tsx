'use client'

import { Card, Typography, Avatar, Button } from 'antd'
import { useSession, signOut } from 'next-auth/react'
import type { ExtendedUser } from '@/types/next-auth'

const { Title, Text } = Typography

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = session?.user as ExtendedUser | undefined

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar size={64} src={user?.image} alt={user?.name || '用户头像'} />
            <div>
              <Title level={4} className="mb-0">
                {user?.name}
              </Title>
              <Text type="secondary">{user?.email}</Text>
            </div>
          </div>
          <Button onClick={handleSignOut}>退出登录</Button>
        </div>

        <div className="space-y-4">
          <div>
            <Text type="secondary">登录方式：</Text>
            <Text strong>{user?.provider === 'google' ? 'Google' : 'GitHub'}</Text>
          </div>
          <div>
            <Text type="secondary">账号状态：</Text>
            <Text strong>正常</Text>
          </div>
          <div>
            <Text type="secondary">剩余使用次数：</Text>
            <Text strong>5 次</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}
