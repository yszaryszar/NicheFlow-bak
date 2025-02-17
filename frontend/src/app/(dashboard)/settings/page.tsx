'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  RiUser3Line,
  RiPaletteLine,
  RiGlobalLine,
  RiShieldKeyholeLine,
  RiNotification3Line,
} from 'react-icons/ri'

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    router.replace('/settings/profile')
  }, [router])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-4 h-auto p-1">
          <TabsTrigger value="profile" className="flex items-center space-x-2 py-2">
            <RiUser3Line className="h-4 w-4" />
            <span>{t('settings.menu.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2 py-2">
            <RiPaletteLine className="h-4 w-4" />
            <span>{t('settings.menu.appearance')}</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center space-x-2 py-2">
            <RiGlobalLine className="h-4 w-4" />
            <span>{t('settings.menu.language')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2 py-2">
            <RiShieldKeyholeLine className="h-4 w-4" />
            <span>{t('settings.menu.security')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 py-2">
            <RiNotification3Line className="h-4 w-4" />
            <span>{t('settings.menu.notifications')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profile.title')}</CardTitle>
              <CardDescription>{t('settings.profile.description')}</CardDescription>
            </CardHeader>
            <CardContent>{/* 个人资料设置内容 */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearance.title')}</CardTitle>
              <CardDescription>{t('settings.appearance.description')}</CardDescription>
            </CardHeader>
            <CardContent>{/* 外观设置内容 */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.language.title')}</CardTitle>
              <CardDescription>{t('settings.language.description')}</CardDescription>
            </CardHeader>
            <CardContent>{/* 语言设置内容 */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.security.title')}</CardTitle>
              <CardDescription>{t('settings.security.description')}</CardDescription>
            </CardHeader>
            <CardContent>{/* 安全设置内容 */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications.title')}</CardTitle>
              <CardDescription>{t('settings.notifications.description')}</CardDescription>
            </CardHeader>
            <CardContent>{/* 通知设置内容 */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
