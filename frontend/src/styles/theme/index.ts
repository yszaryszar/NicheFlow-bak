import type { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    // 品牌主色
    colorPrimary: '#1677ff',
    // 成功色
    colorSuccess: '#52c41a',
    // 警告色
    colorWarning: '#faad14',
    // 错误色
    colorError: '#ff4d4f',
    // 信息色
    colorInfo: '#1677ff',
    // 字体
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // 圆角
    borderRadius: 6,
  },
  components: {
    Button: {
      primaryColor: '#1677ff',
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
} 