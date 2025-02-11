'use client'

import { Avatar, Button, Dropdown, MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'

export function UserMenu() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  if (isLoading) {
    return <Button type="text" loading />
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Button
          type="link"
          onClick={() => router.push('/login')}
          className="text-gray-600 hover:text-gray-900"
        >
          登录
        </Button>
        <Button
          type="primary"
          onClick={() => router.push('/register')}
          className="text-white hover:text-white/90"
        >
          注册
        </Button>
      </div>
    )
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">个人信息</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">账号设置</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => signOut({ callbackUrl: '/' }),
    },
  ]

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow trigger={['click']}>
      <div className="flex items-center space-x-3 cursor-pointer">
        <Avatar
          src={session.user?.image}
          alt={session.user?.name || '用户头像'}
          icon={!session.user?.image && <UserOutlined />}
        />
        <span className="text-gray-700">{session.user?.name}</span>
      </div>
    </Dropdown>
  )
}
