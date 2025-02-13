'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  key: string
  label: string
  href: string
}

interface NavMenuProps {
  items: NavItem[]
  className?: string
}

export function NavMenu({ items, className }: NavMenuProps) {
  const pathname = usePathname()

  return (
    <nav className={`flex items-center space-x-6 ${className}`}>
      {items.map(item => (
        <Link
          key={item.key}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
