import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="NicheFlow Logo" width={32} height={32} />
              <span className="text-xl font-bold">NicheFlow</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-opacity-75 flex flex-col justify-center items-center text-white p-12">
            <h2 className="text-4xl font-bold mb-4">AI驱动的内容创作助手</h2>
            <p className="text-xl text-blue-100 text-center max-w-lg">
              让TikTok、亚马逊、YouTube的内容创作更简单、更高效，帮助创作者和卖家快速生成优质内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
