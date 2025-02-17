import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.getnicheflow.com'

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
          const response = await fetch(`${API_BASE_URL}/v1/user/preferences`)
          if (!response.ok) {
            throw new Error('获取偏好设置失败')
          }
          const data = await response.json()
          if (data.code === 200) {
            set({ preferences: { ...get().preferences, ...data.data } })
          } else {
            throw new Error(data.message || '获取偏好设置失败')
          }
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
          const response = await fetch(`${API_BASE_URL}/v1/user/preferences`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPreferences),
          })
          if (!response.ok) {
            throw new Error('更新偏好设置失败')
          }
          const data = await response.json()
          if (data.code === 200) {
            set({ preferences: { ...get().preferences, ...newPreferences } })
            toast.success('偏好设置已更新')
          } else {
            throw new Error(data.message || '更新偏好设置失败')
          }
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
