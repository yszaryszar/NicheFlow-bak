'use client'

import { Button } from 'antd'
import { useSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useState } from 'react'

interface SocialButtonProps {
  provider: 'google' | 'github'
  className?: string
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: '/icons/google.svg',
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border border-gray-300',
  },
  github: {
    name: 'GitHub',
    icon: '/icons/github.svg',
    bgColor: 'bg-[#24292F] hover:bg-[#24292F]/90',
    textColor: 'text-white',
    borderColor: 'border-transparent',
  },
}

export function SocialButton({ provider, className = '' }: SocialButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signIn, isLoaded } = useSignIn()
  const config = providerConfig[provider]

  const handleSignIn = async () => {
    if (!isLoaded) return
    try {
      setLoading(true)
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      })
    } catch (error) {
      console.error('登录错误:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="large"
      className={`w-full flex items-center justify-center space-x-2 ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      onClick={handleSignIn}
      loading={loading}
    >
      <Image
        src={config.icon}
        alt={`${config.name} logo`}
        width={20}
        height={20}
        className="mr-2"
      />
      <span>使用 {config.name} 账号登录</span>
    </Button>
  )
}
