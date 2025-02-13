'use client'

import { useEffect, useState } from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'
import { Button } from './button'
import { ThemeMode, getSystemTheme, setThemeMode, getThemeMode } from '@/lib/theme'

export function ThemeSwitch() {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [mounted, setMounted] = useState(false)

  // 初始化主题
  useEffect(() => {
    const savedMode = getThemeMode()
    setMode(savedMode)
    setMounted(true)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (mode === 'system') {
        setThemeMode('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 处理主题变化
  useEffect(() => {
    if (mounted) {
      setThemeMode(mode)
    }
  }, [mode, mounted])

  if (!mounted) return null

  const isDark = mode === 'dark' || (mode === 'system' && getSystemTheme() === 'dark')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg hover:bg-accent transition-colors"
      title={isDark ? '切换到亮色主题' : '切换到暗色主题'}
    >
      {isDark ? (
        <BsSun className="text-lg text-foreground transition-colors" />
      ) : (
        <BsMoon className="text-lg text-foreground transition-colors" />
      )}
    </Button>
  )
}
