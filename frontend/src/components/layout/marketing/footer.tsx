'use client'

import Link from 'next/link'
import { Space } from 'antd'

const footerLinks = {
  产品: [
    { label: '功能介绍', href: '/#features' },
    { label: '定价方案', href: '/pricing' },
    { label: '使用教程', href: '/docs' },
  ],
  资源: [
    { label: '帮助中心', href: '/help' },
    { label: '开发文档', href: '/api' },
    { label: '更新日志', href: '/changelog' },
  ],
  关于: [
    { label: '关于我们', href: '/about' },
    { label: '联系我们', href: '/contact' },
    { label: '使用条款', href: '/terms' },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-xl font-bold">
            NicheFlow
          </Link>
          <p className="mt-4 text-gray-500">AI驱动的垂直平台内容创作助手，让创作更简单、更高效。</p>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-semibold mb-4">{title}</h3>
            <Space direction="vertical" size="middle">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-500">
          © {new Date().getFullYear()} NicheFlow. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
