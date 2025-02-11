'use client'

import { Layout } from 'antd'
import { GithubOutlined } from '@ant-design/icons'

const { Footer } = Layout

export function MainFooter() {
  return (
    <Footer className="text-center text-gray-500 bg-transparent">
      <div className="flex items-center justify-center gap-2">
        <span>© 2024 NicheFlow</span>
        <a
          href="https://github.com/yszaryszar/NicheFlow"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          <GithubOutlined />
        </a>
      </div>
    </Footer>
  )
}
