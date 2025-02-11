'use client'

import { ReactNode } from 'react'
import { Layout } from 'antd'
import { MarketingHeader } from '@/components/layout/marketing/header'
import { MarketingFooter } from '@/components/layout/marketing/footer'

const { Header, Content, Footer } = Layout

interface MarketingLayoutProps {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <Layout className="min-h-screen bg-white">
      <Header className="fixed z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <MarketingHeader />
      </Header>
      <Content className="mt-16">
        <main>{children}</main>
      </Content>
      <Footer className="bg-gray-50">
        <MarketingFooter />
      </Footer>
    </Layout>
  )
}
