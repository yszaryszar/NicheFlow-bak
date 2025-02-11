import { message } from 'antd'
import { AxiosError } from 'axios'

export function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.message || error.message
    message.error(errorMessage)
    return errorMessage
  }

  const errorMessage = error instanceof Error ? error.message : '未知错误'
  message.error(errorMessage)
  return errorMessage
}
