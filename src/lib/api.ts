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
  "/api/tracks/v1",
  "/api/auth/v1/google/resend-code",
  "/api/tracks/v1/listen",
  "/api/tracks/v1/quota",
  "/api/public/playlists/v1",
  "/api/playlists/v1",
  "/api/v1/playlists",
]

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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