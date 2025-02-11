'use client'

import { Layout } from 'antd'
import { PropsWithChildren } from 'react'
import { MainHeader } from './MainHeader'
import { MainSider } from './MainSider'
import { MainFooter } from './MainFooter'
import { GlobalLoading } from '../common/GlobalLoading'

const { Content } = Layout

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <Layout className="min-h-screen">
      <GlobalLoading />
      <MainHeader />
      <Layout>
        <MainSider />
        <Layout className="p-6">
          <Content className="bg-white rounded-lg p-6 min-h-[280px]">{children}</Content>
          <MainFooter />
        </Layout>
      </Layout>
    </Layout>
  )
}
