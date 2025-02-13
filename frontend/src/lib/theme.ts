export type ThemeMode = 'light' | 'dark' | 'system'

// 获取系统主题
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 设置主题模式
export function setThemeMode(mode: ThemeMode) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (mode === 'system') {
    const systemTheme = getSystemTheme()
    root.classList.add(systemTheme)
  } else {
    root.classList.add(mode)
  }

  try {
    localStorage.setItem('theme', mode)
  } catch (e) {
    console.error('Failed to save theme to localStorage:', e)
  }
}

// 获取当前主题模式
export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  try {
    return (localStorage.getItem('theme') as ThemeMode) || 'system'
  } catch (e) {
    console.error('Failed to get theme from localStorage:', e)
    return 'system'
  }
}
