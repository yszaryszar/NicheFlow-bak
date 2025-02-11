import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '@/types/store'

interface AuthStore extends AuthState {
  login: (token: string, user: AuthState['user']) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...initialState,

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          ...initialState,
        }),

      setLoading: isLoading =>
        set({
          isLoading,
        }),

      setError: error =>
        set({
          error,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
