import { MarketingLayout } from '@/components/layout/marketing-layout'
import { ReactNode } from 'react'

interface MarketingLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: MarketingLayoutProps) {
  return <MarketingLayout>{children}</MarketingLayout>
}
