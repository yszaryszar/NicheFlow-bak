import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import type { ThemeState } from '@/types/store'

interface ThemeStore extends ThemeState {
  toggleDarkMode: () => void
  setPrimaryColor: (color: string) => void
}

type ThemePersist = (
  config: StateCreator<ThemeStore>,
  options: PersistOptions<ThemeStore>
) => StateCreator<ThemeStore>

const initialState: ThemeState = {
  isDarkMode: false,
  primaryColor: '#1677ff',
}

export const useThemeStore = create<ThemeStore>()(
  (persist as ThemePersist)(
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
