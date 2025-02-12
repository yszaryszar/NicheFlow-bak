import { clerkMiddleware } from '@clerk/nextjs/server'

// 这个配置指定了哪些路由需要认证
export default clerkMiddleware()

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终为 API 路由运行
    '/(api|trpc)(.*)',
  ],
}
