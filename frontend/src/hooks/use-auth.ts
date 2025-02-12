import { useAuth as useClerkAuth } from '@clerk/nextjs'

export function useAuth() {
  const { isLoaded, userId, isSignedIn } = useClerkAuth()

  return {
    user: userId,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
  }
}
