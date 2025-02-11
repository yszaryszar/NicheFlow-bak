import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // 如果用户已登录但访问登录页面，重定向到仪表盘
    if (req.nextUrl.pathname.startsWith('/auth/login') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 检查用户角色和订阅状态
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 需要特定角色的路由
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 需要订阅的路由
    if (path.startsWith('/premium') && token?.subscription !== 'premium') {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 公开路由
        const publicPaths = [
          '/',
          '/auth/login',
          '/auth/error',
          '/api/auth',
          '/pricing',
          '/_next',
          '/favicon.ico',
        ]
        const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))

        // 如果是公开路由，允许访问
        if (isPublicPath) {
          return true
        }

        // 其他路由需要登录
        return !!token
      },
    },
  }
)

// 配置需要匹配的路由
export const config = {
  matcher: [
    // 需要保护的路由
    '/dashboard/:path*',
    '/admin/:path*',
    '/premium/:path*',
    '/settings/:path*',
    '/api/:path*',
    // 登录相关路由
    '/auth/login',
  ],
}
