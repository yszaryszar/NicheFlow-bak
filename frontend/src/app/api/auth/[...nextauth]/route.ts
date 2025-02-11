import NextAuth from 'next-auth'
import type { AuthOptions, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import type { Account } from 'next-auth'

// 扩展 JWT 类型
interface ExtendedToken extends JWT {
  accessToken?: string
  provider?: string
  role?: string
  subscription?: string
}

// 扩展 User 类型
interface ExtendedUser extends User {
  accessToken?: string
  provider?: string
  role?: string
  subscription?: string
}

// 扩展 Session 类型
interface ExtendedSession {
  user: ExtendedUser
  expires: string
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false
      }
      return true
    },
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user?: User }) {
      if (account && user) {
        const extendedToken = token as ExtendedToken
        extendedToken.accessToken = account.access_token
        extendedToken.provider = account.provider
        extendedToken.role = 'user' // 默认角色
        extendedToken.subscription = 'free' // 默认订阅状态
      }
      return token
    },
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      if (session.user) {
        const extendedUser = session.user
        const extendedToken = token as ExtendedToken
        extendedUser.accessToken = extendedToken.accessToken
        extendedUser.provider = extendedToken.provider
        extendedUser.role = extendedToken.role
        extendedUser.subscription = extendedToken.subscription
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
