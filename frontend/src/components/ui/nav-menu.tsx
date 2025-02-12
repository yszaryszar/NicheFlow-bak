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
  theme?: 'light' | 'dark'
  className?: string
}

export function NavMenu({
  items,
  mode = 'horizontal',
  theme = 'light',
  className = '',
}: NavMenuProps) {
  const pathname = usePathname()

  return (
    <Menu
      mode={mode}
      theme={theme}
      selectedKeys={[pathname]}
      className={`border-none bg-transparent ${className}`}
      items={items.map(item => ({
        key: item.key,
        label: (
          <Link
            href={item.href}
            className={`font-medium px-4 py-2 transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            {item.label}
          </Link>
        ),
      }))}
      style={{
        backgroundColor: 'transparent',
      }}
    />
  )
}
