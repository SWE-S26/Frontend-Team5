// This file should not be chnaged and is defined only once
// this is an instance from axios created using axios.create()

import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401: means invalid user data, not authorized to loging
// we get refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken")
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/v1/refresh-token`, { refreshToken })
      localStorage.setItem("accessToken", res.data.accessToken)
      error.config.headers.Authorization = `Bearer ${res.data.accessToken}`
      return axios(error.config) // retry original request
    }
    return Promise.reject(error)
  }
)

export default api