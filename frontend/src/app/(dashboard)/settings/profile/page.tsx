'use client'

import { useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'

export default function ProfilePage() {
  const { user } = useUser()
  const { t } = useTranslation('common')

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.profile.basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像 */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              <AvatarFallback className="bg-primary/10">
                <FaUser className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">{t('settings.profile.changeAvatar')}</Button>
              <p className="text-sm text-muted-foreground">{t('settings.profile.avatarHint')}</p>
            </div>
          </div>

          {/* 姓名 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
              <Input
                id="firstName"
                defaultValue={user.firstName || ''}
                placeholder={t('settings.profile.firstNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
              <Input
                id="lastName"
                defaultValue={user.lastName || ''}
                placeholder={t('settings.profile.lastNamePlaceholder')}
              />
            </div>
          </div>

          {/* 用户名和邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="username">{t('settings.profile.username')}</Label>
            <Input
              id="username"
              defaultValue={user.username || ''}
              placeholder={t('settings.profile.usernamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings.profile.email')}</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.primaryEmailAddress?.emailAddress || ''}
              disabled
            />
            <p className="text-sm text-muted-foreground">{t('settings.profile.emailVerified')}</p>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <Button>{t('settings.profile.save')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
