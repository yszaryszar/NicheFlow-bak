'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import usePreferencesStore from '@/stores/preferences-store'

export default function NotificationsPage() {
  const { t } = useTranslation()
  const { preferences, isLoading, updatePreferences, fetchPreferences } = usePreferencesStore()

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const handleNotificationChange = async (type: string, value: boolean) => {
    const update = {
      [`notification${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
    }
    await updatePreferences(update)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notifications.title')}</CardTitle>
        <CardDescription>{t('settings.notifications.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notification-email" className="flex flex-col space-y-1">
              <span>{t('settings.notifications.email.title')}</span>
              <span className="text-sm text-muted-foreground">
                {t('settings.notifications.email.description')}
              </span>
            </Label>
            <Switch
              id="notification-email"
              checked={preferences.notificationEmail}
              onCheckedChange={checked => handleNotificationChange('email', checked)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notification-mobile" className="flex flex-col space-y-1">
              <span>{t('settings.notifications.mobile.title')}</span>
              <span className="text-sm text-muted-foreground">
                {t('settings.notifications.mobile.description')}
              </span>
            </Label>
            <Switch
              id="notification-mobile"
              checked={preferences.notificationMobile}
              onCheckedChange={checked => handleNotificationChange('mobile', checked)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notification-web" className="flex flex-col space-y-1">
              <span>{t('settings.notifications.web.title')}</span>
              <span className="text-sm text-muted-foreground">
                {t('settings.notifications.web.description')}
              </span>
            </Label>
            <Switch
              id="notification-web"
              checked={preferences.notificationWeb}
              onCheckedChange={checked => handleNotificationChange('web', checked)}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
