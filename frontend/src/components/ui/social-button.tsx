'use client'

import { Button } from './button'
import { cn } from '@/lib/utils'
import { useSignIn } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/types'
import Image from 'next/image'
import { useState } from 'react'

interface SocialButtonConfig {
  provider: OAuthStrategy
  label: string
  icon: string
  bgColor: string
  textColor: string
  borderColor: string
}

const socialConfigs: Record<string, SocialButtonConfig> = {
  google: {
    provider: 'oauth_google',
    label: '使用 Google 账号登录',
    icon: '/icons/google.svg',
    bgColor: 'bg-white',
    textColor: 'text-gray-600',
    borderColor: 'border border-gray-300',
  },
  github: {
    provider: 'oauth_github',
    label: '使用 GitHub 账号登录',
    icon: '/icons/github.svg',
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    borderColor: 'border border-gray-700',
  },
}

interface SocialButtonProps {
  type: keyof typeof socialConfigs
  className?: string
}

export function SocialButton({ type, className = '' }: SocialButtonProps) {
  const { signIn, isLoaded } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)
  const config = socialConfigs[type]

  const handleSignIn = async () => {
    if (!isLoaded || !signIn) return
    try {
      setIsLoading(true)
      await signIn.authenticateWithRedirect({
        strategy: config.provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err) {
      console.error('第三方登录错误:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      className={cn(
        'w-full flex items-center justify-center gap-2',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className,
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      disabled={isLoading}
    >
      <Image src={config.icon} alt={config.label} width={20} height={20} />
      {config.label}
    </Button>
  )
}
