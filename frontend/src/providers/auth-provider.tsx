'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { zhCN, enUS } from '@clerk/localizations'
import { ReactNode, useEffect, useState } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [localization, setLocalization] = useState(enUS)

  useEffect(() => {
    const userLanguage = navigator.language.toLowerCase()
    setLocalization(userLanguage.startsWith('zh') ? zhCN : enUS)
  }, [])

  return (
    <ClerkProvider
      localization={localization}
      appearance={{
        layout: {
          helpPageUrl: '/help',
          privacyPageUrl: '/privacy',
          termsPageUrl: '/terms',
          shimmer: true,
        },
        variables: {
          colorPrimary: '#0ea5e9',
          borderRadius: '0.5rem',
        },
        elements: {
          card: 'shadow-xl rounded-xl border border-gray-100',
          headerTitle: 'text-xl font-semibold',
          headerSubtitle: 'text-gray-500',
          socialButtons: 'gap-2',
          formButtonPrimary: 'bg-primary hover:bg-primary-600 text-white rounded-lg px-4 py-2',
          footerActionLink: 'text-primary hover:text-primary-600',
          modalBackdrop: 'backdrop-blur-sm',
          modalContent: 'shadow-xl rounded-xl border-gray-100',
        },
      }}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/"
      signUpUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
