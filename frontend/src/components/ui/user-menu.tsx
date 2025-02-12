'use client'

import { Avatar, Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
import { useClerk, useUser } from '@clerk/nextjs'

export function UserMenu() {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人中心',
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'settings',
      label: '账号设置',
      onClick: () => router.push('/dashboard/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => signOut(() => router.push('/')),
    },
  ]

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button type="link" onClick={() => router.push('/sign-in')}>
          登录
        </Button>
        <Button type="primary" onClick={() => router.push('/sign-up')}>
          注册
        </Button>
      </div>
    )
  }

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <div className="flex items-center space-x-2 cursor-pointer">
        <Avatar
          size={32}
          src={user.imageUrl}
          icon={!user.imageUrl && <FaUser />}
          className="bg-primary-100"
        />
        <span className="text-sm font-medium hidden md:block">
          {user.fullName || user.username}
        </span>
      </div>
    </Dropdown>
  )
}
