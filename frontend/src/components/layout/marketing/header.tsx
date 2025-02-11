'use client'

import { Menu } from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import { UserMenu } from '../UserMenu'

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
            label: (
              <Link href={item.href} className="text-gray-600 hover:text-gray-900">
                {item.label}
              </Link>
            ),
          }))}
        />
      </div>

      {/* Auth Menu */}
      <UserMenu />
    </div>
  )
}
