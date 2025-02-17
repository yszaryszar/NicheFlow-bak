'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RiTranslate2, RiGlobalLine } from 'react-icons/ri'
import usePreferencesStore from '@/stores/preferences-store'

export default function LanguagePage() {
  const { t } = useTranslation()
  const { preferences, isLoading, updatePreferences, fetchPreferences } = usePreferencesStore()

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const handleLanguageChange = async (language: string) => {
    await updatePreferences({ language })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.language.title')}</CardTitle>
        <CardDescription>{t('settings.language.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>{t('settings.language.language')}</Label>
          <RadioGroup
            value={preferences.language}
            onValueChange={handleLanguageChange}
            className="grid grid-cols-2 gap-4"
            disabled={isLoading}
          >
            <div>
              <RadioGroupItem value="zh" id="lang-zh" className="peer sr-only" />
              <Label
                htmlFor="lang-zh"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RiTranslate2 className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">{t('settings.language.languages.zh')}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="en" id="lang-en" className="peer sr-only" />
              <Label
                htmlFor="lang-en"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RiGlobalLine className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">{t('settings.language.languages.en')}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
