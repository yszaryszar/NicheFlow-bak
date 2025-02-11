import 'next-auth'

export interface ExtendedUser {
  id?: string | number
  name?: string | null
  email?: string | null
  image?: string | null
  provider?: string
  role?: string
  subscription?: string
  accessToken?: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
