'use client'

import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
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
import { useState } from 'react'

interface UserMenuProps {
  theme?: 'light' | 'dark'
}

export function UserMenu({ theme = 'light' }: UserMenuProps) {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || ''} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
          <span
            className={`text-sm font-medium hidden md:block ${
              theme === 'dark' ? 'text-muted-foreground' : 'text-foreground'
            }`}
          >
            {user.fullName || user.username}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          {t('userMenu.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          {t('userMenu.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>
          {t('userMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
