import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

interface Preferences {
  language: string
  theme: string
  timeZone: string
  dateFormat: string
  timeFormat: string
  notificationEmail: boolean
  notificationMobile: boolean
  notificationWeb: boolean
}

interface PreferencesState {
  preferences: Preferences
  isLoading: boolean
  error: string | null
  fetchPreferences: () => Promise<void>
  updatePreferences: (preferences: Partial<Preferences>) => Promise<void>
}

const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: {
        language: 'zh',
        theme: 'light',
        timeZone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        notificationEmail: true,
        notificationMobile: true,
        notificationWeb: true,
      },
      isLoading: false,
      error: null,

      fetchPreferences: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/v1/user/preferences')
          if (!response.ok) {
            throw new Error('获取偏好设置失败')
          }
          const data = await response.json()
          set({ preferences: data.data })
        } catch (error) {
          set({ error: (error as Error).message })
          toast.error('获取偏好设置失败')
        } finally {
          set({ isLoading: false })
        }
      },

      updatePreferences: async (newPreferences: Partial<Preferences>) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/v1/user/preferences', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPreferences),
          })
          if (!response.ok) {
            throw new Error('更新偏好设置失败')
          }
          set({ preferences: { ...get().preferences, ...newPreferences } })
          toast.success('偏好设置已更新')
        } catch (error) {
          set({ error: (error as Error).message })
          toast.error('更新偏好设置失败')
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'user-preferences',
    }
  )
)

export default usePreferencesStore
