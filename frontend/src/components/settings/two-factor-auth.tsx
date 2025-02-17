'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

interface TwoFactorAuthProps {
  is2FAEnabled: boolean
  setIs2FAEnabled: (enabled: boolean) => void
}

export function TwoFactorAuth({ is2FAEnabled, setIs2FAEnabled }: TwoFactorAuthProps) {
  const { t } = useTranslation()
  const [verificationCode, setVerificationCode] = useState('')
  const qrCodeUrl =
    'otpauth://totp/NicheFlow:user@example.com?secret=ABCDEFGHIJKLMNOP&issuer=NicheFlow'
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    try {
      setIsLoading(true)
      // TODO: 实现验证逻辑
      setIs2FAEnabled(true)
      toast.success(t('settings.security.2fa.enabled'))
    } catch {
      toast.error(t('settings.security.2fa.enableFailed'))
    } finally {
      setIsLoading(false)
      setVerificationCode('')
    }
  }

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true)
      // TODO: 实现禁用逻辑
      setIs2FAEnabled(false)
      toast.success(t('settings.security.2fa.disabled'))
    } catch {
      toast.error(t('settings.security.2fa.disableFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (is2FAEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.security.2fa.title')}</CardTitle>
          <CardDescription>{t('settings.security.2fa.enabled')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
            {t('settings.security.2fa.disable')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.security.2fa.title')}</CardTitle>
        <CardDescription>{t('settings.security.2fa.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrCodeUrl && (
          <div className="flex justify-center">
            <QRCodeSVG value={qrCodeUrl} size={200} />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="verification-code">{t('settings.security.2fa.code')}</Label>
          <Input
            id="verification-code"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            placeholder={t('settings.security.2fa.codePlaceholder')}
          />
        </div>
        <Button onClick={handleVerify} disabled={!verificationCode || isLoading}>
          {t('settings.security.2fa.verify')}
        </Button>
      </CardContent>
    </Card>
  )
}
