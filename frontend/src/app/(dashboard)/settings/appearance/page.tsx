'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RiSunLine, RiMoonLine, RiComputerLine } from 'react-icons/ri'
import usePreferencesStore from '@/stores/preferences-store'

export default function AppearancePage() {
  const { t } = useTranslation()
  const { preferences, isLoading, updatePreferences, fetchPreferences } = usePreferencesStore()

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const handleThemeChange = async (theme: string) => {
    await updatePreferences({ theme })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.appearance.title')}</CardTitle>
        <CardDescription>{t('settings.appearance.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>{t('settings.appearance.theme')}</Label>
          <RadioGroup
            value={preferences.theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-3 gap-4"
            disabled={isLoading}
          >
            <div>
              <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RiSunLine className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">{t('settings.appearance.themes.light')}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RiMoonLine className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">{t('settings.appearance.themes.dark')}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RiComputerLine className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">
                  {t('settings.appearance.themes.system')}
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
