import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { message } from 'antd'
import LoginPage from '../login/page'
import CallbackPage from '../callback/page'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import type { User } from '@/services/auth'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock antd message and components
jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Typography: {
    Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  },
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Divider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock auth service
jest.mock('@/services/auth', () => ({
  authService: {
    getProviders: jest.fn(),
    getAuthUrl: jest.fn(),
    handleCallback: jest.fn(),
  },
}))

describe('认证流程测试', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('登录页面', () => {
    it('应该显示登录选项', async () => {
      const mockProviders = {
        data: {
          providers: [
            { id: 'google', name: 'Google' },
            { id: 'github', name: 'GitHub' },
          ],
        },
      }

      ;(authService.getProviders as jest.Mock).mockResolvedValue(mockProviders)

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByText('使用 Google 账号登录')).toBeInTheDocument()
        expect(screen.getByText('使用 GitHub 账号登录')).toBeInTheDocument()
      })
    })

    it('点击登录按钮应该获取认证 URL', async () => {
      const mockAuthUrl = {
        data: {
          url: 'https://accounts.google.com/oauth',
        },
      }

      ;(authService.getAuthUrl as jest.Mock).mockResolvedValue(mockAuthUrl)

      // 创建一个 mock 函数来替代 window.location.href
      const mockAssign = jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true,
      })

      render(<LoginPage />)

      const googleButton = screen.getByText('使用 Google 账号登录')
      fireEvent.click(googleButton)

      await waitFor(() => {
        expect(authService.getAuthUrl).toHaveBeenCalledWith('google')
        expect(mockAssign).toHaveBeenCalledWith(mockAuthUrl.data.url)
      })
    })
  })

  describe('回调页面', () => {
    it('处理有效的回调', async () => {
      const mockSearchParams = new URLSearchParams('?provider=google&code=valid_code')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

      const mockCallbackResponse = {
        data: {
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://example.com/avatar.jpg',
            provider: 'google',
            role: 'user',
            status: 'active',
            subscription_status: 'free',
            usage_limit: 5,
            usage_count: 0,
            monthly_limit: 3,
            monthly_count: 0,
          } as User,
          access_token: 'valid_token',
        },
      }

      ;(authService.handleCallback as jest.Mock).mockResolvedValue(mockCallbackResponse)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(authService.handleCallback).toHaveBeenCalledWith('google', 'valid_code')
        expect(message.success).toHaveBeenCalledWith('登录成功')
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('处理无效的回调参数', async () => {
      const mockSearchParams = new URLSearchParams('')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('认证参数无效')
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login')
      })
    })

    it('处理回调错误', async () => {
      const mockSearchParams = new URLSearchParams('?provider=google&code=invalid_code')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

      const mockError = new Error('认证失败')
      ;(authService.handleCallback as jest.Mock).mockRejectedValue(mockError)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('认证失败')
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/error')
      })
    })
  })

  describe('认证状态管理', () => {
    it('应该正确设置和清除认证状态', () => {
      const { setAuth, logout } = useAuthStore.getState()

      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
        provider: 'google',
        role: 'user',
        status: 'active',
        subscription_status: 'free',
        usage_limit: 5,
        usage_count: 0,
        monthly_limit: 3,
        monthly_count: 0,
      }
      const mockToken = 'valid_token'

      setAuth(mockUser, mockToken)
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().token).toBe(mockToken)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      logout()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().token).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
