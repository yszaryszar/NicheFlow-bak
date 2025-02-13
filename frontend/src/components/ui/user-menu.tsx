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

interface UserMenuProps {
  theme?: 'light' | 'dark'
}

export function UserMenu({ theme = 'light' }: UserMenuProps) {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  if (!user) {
    return (
      <div className="flex items-center">
        <SignInButton mode="modal">
          <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600">
            开始使用
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
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {user.fullName || user.username}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          账号设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
