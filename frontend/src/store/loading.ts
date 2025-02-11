import { create } from 'zustand'
import type { LoadingState } from '@/types/store'

interface LoadingStore extends LoadingState {
  startLoading: (text?: string) => void
  stopLoading: () => void
}

export const useLoadingStore = create<LoadingStore>(set => ({
  isLoading: false,
  loadingText: undefined,

  startLoading: text =>
    set({
      isLoading: true,
      loadingText: text,
    }),

  stopLoading: () =>
    set({
      isLoading: false,
      loadingText: undefined,
    }),
}))
