'use client'

import { useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'

// 定义表单验证模式
const profileSchema = z.object({
  firstName: z.string().min(1, '请输入名字'),
  lastName: z.string().min(1, '请输入姓氏'),
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user } = useUser()
  const { t } = useTranslation('common')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
    },
  })

  if (!user) return null

  // 处理头像上传
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片大小不能超过2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件')
      return
    }

    try {
      setIsUploading(true)
      await user.setProfileImage({ file })
      toast.success('头像更新成功')
    } catch (error) {
      toast.error('头像上传失败')
      console.error('Avatar upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // 处理表单提交
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true)
      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      })
      toast.success('个人资料更新成功')
    } catch (error) {
      toast.error('更新失败，请重试')
      console.error('Profile update error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.profile.basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像上传 */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              <AvatarFallback className="bg-primary/10">
                <FaUser className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('avatar')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? '上传中...' : t('settings.profile.changeAvatar')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{t('settings.profile.avatarHint')}</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 姓名 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                <Input
                  id="firstName"
                  {...form.register('firstName')}
                  placeholder={t('settings.profile.firstNamePlaceholder')}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder={t('settings.profile.lastNamePlaceholder')}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* 用户名和邮箱 */}
            <div className="space-y-2">
              <Label htmlFor="username">{t('settings.profile.username')}</Label>
              <Input
                id="username"
                {...form.register('username')}
                placeholder={t('settings.profile.usernamePlaceholder')}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={user.primaryEmailAddress?.emailAddress || ''}
                disabled
              />
              {user.primaryEmailAddress?.verification.status === 'verified' && (
                <p className="text-sm text-muted-foreground">
                  {t('settings.profile.emailVerified')}
                </p>
              )}
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end">
              <Button type="submit" disabled={!form.formState.isDirty || isSaving}>
                {isSaving ? '保存中...' : t('settings.profile.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
