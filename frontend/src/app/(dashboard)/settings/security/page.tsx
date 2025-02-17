'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TwoFactorAuth } from '@/components/settings/two-factor-auth'

export default function SecurityPage() {
  const { t } = useTranslation()
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.security.title')}</CardTitle>
        <CardDescription>{t('settings.security.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TwoFactorAuth is2FAEnabled={is2FAEnabled} setIs2FAEnabled={setIs2FAEnabled} />
      </CardContent>
    </Card>
  )
}
