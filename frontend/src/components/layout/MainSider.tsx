'use client'

import { Layout, Menu } from 'antd'
import { useIntl } from 'react-intl'
import {
  HomeOutlined,
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'

const { Sider } = Layout

interface MainSiderProps {
  collapsed?: boolean
}

export function MainSider({ collapsed }: MainSiderProps) {
  const intl = useIntl()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: intl.formatMessage({ id: 'nav.home' }),
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: intl.formatMessage({ id: 'nav.dashboard' }),
    },
    {
      key: '/scripts',
      icon: <FileTextOutlined />,
      label: intl.formatMessage({ id: 'nav.scripts' }),
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: intl.formatMessage({ id: 'nav.analytics' }),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: intl.formatMessage({ id: 'nav.settings' }),
    },
  ]

  return (
    <Sider collapsed={collapsed} className="bg-white" width={220} collapsedWidth={80}>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        className="h-full border-r"
      />
    </Sider>
  )
}
