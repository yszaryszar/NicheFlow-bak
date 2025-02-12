'use client'

import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'
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
      type="text"
      icon={isDark ? <BsMoon className="text-lg" /> : <BsSun className="text-lg" />}
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    />
  )
}
