import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { useLoadingStore } from '@/store/loading'
import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

interface LoginParams {
  email: string
  password: string
}

export function useAuth() {
  const { login, logout } = useAuthStore()
  const { startLoading, stopLoading } = useLoadingStore()

  const loginMutation = useMutation({
    mutationFn: async (params: LoginParams) => {
      startLoading('登录中...')
      try {
        const { data } = await api.post('/auth/login', params)
        login(data.token, data.user)
        return data
      } catch (error) {
        handleApiError(error)
        throw error
      } finally {
        stopLoading()
      }
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      startLoading('退出中...')
      try {
        await api.post('/auth/logout')
        logout()
      } catch (error) {
        handleApiError(error)
        throw error
      } finally {
        stopLoading()
      }
    },
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
  }
}
