'use client'

import { useAuth } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function RootPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { t } = useTranslation('common')

  // 如果正在加载，显示加载状态
  if (!isLoaded) {
    return null
  }

  return isSignedIn ? (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('welcomeBack')}</h1>
      {/* 仪表板内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 快速操作卡片 */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('quickActions')}</h2>
          {/* 添加快速操作按钮 */}
        </div>
        {/* 使用统计卡片 */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('usageStatistics')}</h2>
          {/* 添加统计信息 */}
        </div>
        {/* 最近活动卡片 */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('recentActivities')}</h2>
          {/* 添加活动列表 */}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-custom">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-6">{t('hero.title')}</h1>
          <p className="hero-subtitle text-xl mb-8">{t('hero.subtitle')}</p>
          <p className="hero-description text-xl mb-8">{t('hero.description')}</p>
          <SignInButton mode="modal">
            <Button className="button-hover bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-3 rounded-xl">
              {t('getStarted')}
            </Button>
          </SignInButton>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass card-hover rounded-xl p-8">
            <div className="icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                <path
                  d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title text-xl mb-4">{t('features.contentGeneration.title')}</h3>
            <p className="card-description">{t('features.contentGeneration.description')}</p>
          </div>
          <div className="glass card-hover rounded-xl p-8">
            <div className="icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                <path
                  d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title text-xl mb-4">{t('features.platformManagement.title')}</h3>
            <p className="card-description">{t('features.platformManagement.description')}</p>
          </div>
          <div className="glass card-hover rounded-xl p-8">
            <div className="icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary">
                <path
                  d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z M12,7 C14.7614,7 17,9.23858 17,12 C17,14.7614 14.7614,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.23858 9.23858,7 12,7 Z M12,9 C10.3431,9 9,10.3431 9,12 C9,13.6569 10.3431,15 12,15 C13.6569,15 15,13.6569 15,12 C15,10.3431 13.6569,9 12,9 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title text-xl mb-4">{t('features.dataAnalysis.title')}</h3>
            <p className="card-description">{t('features.dataAnalysis.description')}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="glass card-hover p-8 rounded-xl text-center">
            <div className="stats-number text-4xl mb-2">{t('stats.users.value')}</div>
            <div className="stats-label">{t('stats.users.label')}</div>
          </div>
          <div className="glass card-hover p-8 rounded-xl text-center">
            <div className="stats-number text-4xl mb-2">{t('stats.articles.value')}</div>
            <div className="stats-label">{t('stats.articles.label')}</div>
          </div>
          <div className="glass card-hover p-8 rounded-xl text-center">
            <div className="stats-number text-4xl mb-2">{t('stats.platforms.value')}</div>
            <div className="stats-label">{t('stats.platforms.label')}</div>
          </div>
          <div className="glass card-hover p-8 rounded-xl text-center">
            <div className="stats-number text-4xl mb-2">99%</div>
            <div className="stats-label">{t('stats.userSatisfaction')}</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="glass max-w-4xl mx-auto text-center p-12 rounded-2xl">
          <h2 className="hero-title text-3xl mb-4">{t('readyToStart')}</h2>
          <p className="hero-subtitle text-xl mb-8">{t('joinNicheFlow')}</p>
          <SignInButton mode="modal">
            <Button className="button-hover bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-3 rounded-xl">
              {t('getStarted')}
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  )
}
