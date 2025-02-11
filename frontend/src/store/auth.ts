import { create } from 'zustand'
import { Session } from 'next-auth'

interface User {
  id: number
  email: string
  name: string
  image: string
  provider: string
  role: string
  status: string
  subscription_status: string
  usage_limit: number
  usage_count: number
  monthly_limit: number
  monthly_count: number
}

interface AuthStore {
  session: Session | null
  setSession: (session: Session | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
  session: null,
  setSession: session => set({ session }),
  isLoading: true,
  setIsLoading: isLoading => set({ isLoading }),
  login: (token, user) =>
    set({
      session: {
        user,
        accessToken: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }),
  logout: () => set({ session: null }),
}))
