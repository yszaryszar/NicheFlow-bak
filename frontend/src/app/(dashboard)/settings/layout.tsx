'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  // 获取当前设置页面的标题和描述
  const getSettingInfo = () => {
    const path = pathname?.split('/').pop() || 'profile' // 获取最后一个路径段，如果 pathname 为 null 则使用默认值
    return {
      title: t(`settings.${path}.title`),
      description: t(`settings.${path}.description`),
    }
  }

  const { title, description } = getSettingInfo()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      {children}
    </div>
  )
}
