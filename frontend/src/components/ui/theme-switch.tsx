'use client'

import { useEffect, useState } from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'
import { Button } from './button'
import { ThemeMode, getSystemTheme, setThemeMode } from '@/lib/theme'

export function ThemeSwitch() {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [mounted, setMounted] = useState(false)

  // 等待客户端挂载，避免服务端渲染不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  // 切换主题
  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
    setThemeMode(newMode)
  }

  if (!mounted) return null

  const isDark = mode === 'dark' || (mode === 'system' && getSystemTheme() === 'dark')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
    >
      {isDark ? (
        <BsMoon className="text-lg text-gray-300 hover:text-white" />
      ) : (
        <BsSun className="text-lg text-gray-300 hover:text-white" />
      )}
    </Button>
  )
}
