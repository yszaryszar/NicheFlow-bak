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

  return <ClerkProvider localization={localization}>{children}</ClerkProvider>
}
