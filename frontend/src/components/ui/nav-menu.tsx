'use client'

import { Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  key: string
  label: string
  href: string
}

interface NavMenuProps {
  items: NavItem[]
  mode?: 'horizontal' | 'vertical'
  className?: string
}

export function NavMenu({ items, mode = 'horizontal', className = '' }: NavMenuProps) {
  const pathname = usePathname()

  return (
    <Menu
      mode={mode}
      selectedKeys={[pathname]}
      className={`border-none bg-transparent ${className}`}
      items={items.map(item => ({
        key: item.key,
        label: (
          <Link href={item.href} className="text-gray-600 hover:text-gray-900">
            {item.label}
          </Link>
        ),
      }))}
    />
  )
}
