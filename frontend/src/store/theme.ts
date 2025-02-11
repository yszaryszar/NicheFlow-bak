import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeState } from '@/types/store'

interface ThemeStore extends ThemeState {
  toggleDarkMode: () => void
  setPrimaryColor: (color: string) => void
}

const initialState: ThemeState = {
  isDarkMode: false,
  primaryColor: '#1677ff',
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      ...initialState,

      toggleDarkMode: () =>
        set(state => ({
          isDarkMode: !state.isDarkMode,
        })),

      setPrimaryColor: primaryColor =>
        set({
          primaryColor,
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
