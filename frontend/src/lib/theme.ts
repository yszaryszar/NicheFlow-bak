import { ThemeConfig } from 'antd'

// Ant Design 主题配置
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#10b981', // emerald-500
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#10b981',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      paddingContentHorizontal: 20,
      colorPrimary: '#10b981',
      colorPrimaryHover: '#059669',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 12,
    },
    Layout: {
      headerBg: 'transparent',
      headerHeight: 64,
      headerPadding: 0,
      siderBg: 'transparent',
    },
  },
}

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system'

// 获取系统主题模式
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 设置主题模式
export const setThemeMode = (mode: ThemeMode) => {
  const root = window.document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && getSystemTheme() === 'dark')

  root.classList.remove('light', 'dark')
  root.classList.add(isDark ? 'dark' : 'light')
}
