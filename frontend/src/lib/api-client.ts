import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth'

// API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
  error?: string
}

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: Error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 如果响应码不是 200，抛出错误
    if (response.data.code !== 200) {
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
    return {
      ...response,
      data: response.data,
    }
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }

    // 返回错误信息
    const message =
      error.response?.data?.message || error.response?.data?.error || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

// API 方法
export const api = {
  // 通用请求方法
  request: <T = unknown>(config: InternalAxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.request<unknown, ApiResponse<T>>(config)
  },

  // GET 请求
  get: <T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get<unknown, ApiResponse<T>>(url, config)
  },

  // POST 请求
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return apiClient.post<unknown, ApiResponse<T>>(url, data, config)
  },

  // PUT 请求
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return apiClient.put<unknown, ApiResponse<T>>(url, data, config)
  },

  // DELETE 请求
  delete: <T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return apiClient.delete<unknown, ApiResponse<T>>(url, config)
  },
}

export default api
