'use client'

import { Button, Menu } from 'antd'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const menuItems = [
  {
    key: 'features',
    label: '功能',
    href: '/#features',
  },
  {
    key: 'pricing',
    label: '定价',
    href: '/pricing',
  },
  {
    key: 'about',
    label: '关于',
    href: '/about',
  },
]

export function MarketingHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.svg" alt="NicheFlow Logo" width={32} height={32} />
        <span className="text-xl font-bold">NicheFlow</span>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Menu
          mode="horizontal"
          className="border-none bg-transparent"
          items={menuItems.map(item => ({
            key: item.key,
            label: <Link href={item.href}>{item.label}</Link>,
          }))}
        />
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-4">
        <Button type="link" onClick={() => router.push('/login')}>
          登录
        </Button>
        <Button type="primary" onClick={() => router.push('/register')}>
          注册
        </Button>
      </div>
    </div>
  )
}
