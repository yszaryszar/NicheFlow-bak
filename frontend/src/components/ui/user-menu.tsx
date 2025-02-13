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

interface UserMenuProps {
  theme?: 'light' | 'dark'
}

export function UserMenu({ theme = 'light' }: UserMenuProps) {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { t } = useTranslation('common')

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      <DropdownMenuContent align="end">
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
