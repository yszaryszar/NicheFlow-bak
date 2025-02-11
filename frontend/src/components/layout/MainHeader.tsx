'use client'

import { Layout, Button, Space } from 'antd'
import { LocaleSwitch } from '../LocaleSwitch'
import { useIntl } from 'react-intl'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

interface MainHeaderProps {
  collapsed?: boolean
  onCollapse?: () => void
}

export function MainHeader({ collapsed, onCollapse }: MainHeaderProps) {
  const intl = useIntl()

  return (
    <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
        />
        <h1 className="ml-4 text-lg font-semibold">{intl.formatMessage({ id: 'app.name' })}</h1>
      </div>
      <Space>
        <LocaleSwitch />
        <Button type="text" icon={<UserOutlined />} />
      </Space>
    </Header>
  )
}
