import { clerkMiddleware } from '@clerk/nextjs/server'

// 这个配置指定了哪些路由需要认证
export default clerkMiddleware()

// 配置需要应用中间件的路由
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
