import { create } from 'zustand'
import { Session } from 'next-auth'

interface User {
  id: string
  name?: string
  email?: string
  image?: string
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
