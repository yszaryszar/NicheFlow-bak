export interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface ThemeState {
  isDarkMode: boolean
  primaryColor: string
}

export interface LoadingState {
  isLoading: boolean
  loadingText?: string
}
