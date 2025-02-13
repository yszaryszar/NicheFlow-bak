'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './navigation-menu'
import { cn } from '@/lib/utils'

interface NavItem {
  key: string
  label: string
  href: string
}

interface NavMenuProps {
  items: NavItem[]
  theme?: 'light' | 'dark'
  className?: string
}

export function NavMenu({ items, theme = 'light', className = '' }: NavMenuProps) {
  const pathname = usePathname()

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {items.map(item => (
          <NavigationMenuItem key={item.key}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'font-medium px-4 py-2 transition-colors',
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-emerald-600',
                  pathname === item.href && 'bg-accent'
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
