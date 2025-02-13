'use client'

import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
import { RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from 'react-icons/ri'
import { useClerk, useUser, SignInButton } from '@clerk/nextjs'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { useTranslation } from 'react-i18next'
import { useState, useRef } from 'react'

interface UserMenuProps {
  theme?: 'light' | 'dark'
}

export function UserMenu({ theme = 'light' }: UserMenuProps) {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = undefined
    }, 150)
  }

  if (!user) {
    return (
      <div className="flex items-center">
        <SignInButton mode="modal">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('getStarted')}
          </Button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg transition-colors hover:bg-accent cursor-pointer">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || ''} />
              <AvatarFallback className="bg-primary/10">
                <FaUser className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <span
              className={`text-sm font-medium hidden md:block transition-colors ${
                theme === 'dark' ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {user.fullName || user.username}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center py-2 px-3 cursor-pointer"
          >
            <RiUser3Line className="mr-2 h-4 w-4" />
            {t('userMenu.profile')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/settings')}
            className="flex items-center py-2 px-3 cursor-pointer"
          >
            <RiSettings4Line className="mr-2 h-4 w-4" />
            {t('userMenu.settings')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut(() => router.push('/'))}
            className="flex items-center py-2 px-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
          >
            <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
            {t('userMenu.signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
