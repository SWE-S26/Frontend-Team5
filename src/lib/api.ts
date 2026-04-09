// This file should not be changed and is defined only once
// this is an instance from axios created using axios.create()

import axios from "axios"

const PUBLIC_ROUTES = [
  "/api/auth/v1/find-email",
  "/api/auth/v1/login",
  "/api/auth/v1/sign-up",
  "/api/auth/v1/forgot-password",
  "/api/auth/v1/reset-password",
  "/api/auth/v1/logout",
  "/api/auth/v1/refresh-token",
  "/api/auth/v1/google/callback",
  "/api/auth/v1/google/complete",
  "/api/auth/v1/google/verify-code",
  "/api/auth/v1/cross/desktop",
  "/api/auth/v1/cross/desktop/poll",
]

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// FormData: let axios set Content-Type automatically with correct boundary
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }
  return config
})

// 401: token expired, attempt refresh (skip public routes)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isPublic = PUBLIC_ROUTES.some(route => originalRequest?.url?.includes(route))

    if (error.response?.status === 401 && !isPublic && !originalRequest._retry) {
      originalRequest._retry = true

      await axios.get( 
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/v1/refresh-token`,
        { withCredentials: true }
      )
      return api(originalRequest)
    }
    return Promise.reject(error)
  }
)

export default api