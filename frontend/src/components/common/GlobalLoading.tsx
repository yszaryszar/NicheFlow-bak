'use client'

import { Spin } from 'antd'
import { useLoadingStore } from '@/store/loading'

export function GlobalLoading() {
  const { isLoading, loadingText } = useLoadingStore()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <Spin tip={loadingText} size="large" />
      </div>
    </div>
  )
}
