'use client'

import { Button } from 'antd'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI驱动的垂直平台
            <br />
            <span className="text-blue-600">内容创作助手</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            让TikTok、亚马逊、YouTube的内容创作更简单、更高效，
            <br />
            帮助创作者和卖家快速生成优质内容。
          </p>
          <div className="flex justify-center gap-4">
            <Button type="primary" size="large" className="text-white hover:text-white/90">
              <Link href="/register">免费开始使用</Link>
            </Button>
            <Button size="large" className="text-gray-600 hover:text-gray-800">
              <Link href="/#features">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* TikTok */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Image src="/icons/tiktok.svg" alt="TikTok" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">TikTok脚本生成</h3>
              <p className="text-gray-600">
                基于AI的TikTok视频脚本生成器，帮助创作者快速生成吸引人的内容。
              </p>
            </div>

            {/* Amazon */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Image src="/icons/amazon.svg" alt="Amazon" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">亚马逊文案生成</h3>
              <p className="text-gray-600">
                智能生成优化的亚马逊产品描述和营销文案，提高转化率。
                <span className="text-blue-600">即将推出</span>
              </p>
            </div>

            {/* YouTube */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">YouTube内容生成</h3>
              <p className="text-gray-600">
                自动生成YouTube视频标题、描述和脚本，让内容创作更轻松。
                <span className="text-blue-600">即将推出</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">准备好开始了吗？</h2>
          <p className="text-xl text-gray-600 mb-8">立即注册，体验AI驱动的内容创作新方式。</p>
          <Button type="primary" size="large" className="text-white hover:text-white/90">
            <Link href="/register">免费开始使用</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
