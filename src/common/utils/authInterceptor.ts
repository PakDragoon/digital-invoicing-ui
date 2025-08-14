import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { getAccessToken, getRefreshToken, setAccessToken } from "./auth"
import { getUserTimezone } from "@/common/utils/getUserTimezone"

export const BASE_URL = import.meta.env.VITE_PRODUCTION_API_URL

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (err: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

const handleLogout = () => {
  useAuthStore.getState().logout()
  localStorage.removeItem("auth-storage")
  window.location.href = "/"
}

const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    const timezone = getUserTimezone()

    if (config.headers) {
      if (token) config.headers["Authorization"] = `Bearer ${token}`
      config.headers["UserTimezone"] = timezone
    }

    return config
  })

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/login")
      ) {
        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch(() => {
              handleLogout()
              return Promise.reject(err)
            })
        }

        isRefreshing = true

        try {
          const refreshToken = getRefreshToken()

          // Check if refresh token exists before making the request
          if (!refreshToken) {
            console.warn("Refresh token not found, logging out user")
            processQueue(new Error("No refresh token available"), null)
            handleLogout()
            return Promise.reject(new Error("No refresh token available"))
          }

          const { data } = await axios.post(`${BASE_URL}/employee/auth/refresh`, { refreshToken })

          const newAccessToken = data?.data?.accessToken
          if (!newAccessToken) {
            throw new Error("Access token missing from refresh response")
          }

          setAccessToken(newAccessToken)

          const { setTokens } = useAuthStore.getState()
          setTokens(newAccessToken, refreshToken)

          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          handleLogout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(err)
    }
  )
}

export default setupInterceptors
