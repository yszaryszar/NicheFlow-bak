'use client'

import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
import { RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from 'react-icons/ri'
import { useClerk, useUser, SignInButton } from '@clerk/nextjs'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

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
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

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
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex items-center space-x-3 px-2 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
          isOpen ? 'bg-accent' : 'hover:bg-accent'
        }`}
      >
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
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border border-border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1">
            <div
              onClick={() => router.push('/dashboard/profile')}
              className="flex items-center py-2 px-3 cursor-pointer hover:bg-accent"
            >
              <RiUser3Line className="mr-2 h-4 w-4" />
              {t('userMenu.profile')}
            </div>
            <div
              onClick={() => router.push('/dashboard/settings')}
              className="flex items-center py-2 px-3 cursor-pointer hover:bg-accent"
            >
              <RiSettings4Line className="mr-2 h-4 w-4" />
              {t('userMenu.settings')}
            </div>
            <div className="h-px bg-border mx-1 my-1" />
            <div
              onClick={() => signOut(() => router.push('/'))}
              className="flex items-center py-2 px-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
              {t('userMenu.signOut')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
