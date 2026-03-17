import { useState } from "react"
import { authService } from "@/services/auth.service"

export function useFindEmail() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [exists,  setExists]  = useState<boolean | null>(null)

  const findEmail = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.findEmail({ email })
      setExists(res.data.exists)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { findEmail, loading, error, exists }
}


export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login({ email, password })
      setSuccess(res.data.success)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error, success }
}


export function useSignup() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const signup = async (email: string, password: string, displayName: string, dateOfBirth: string, gender: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.signup({ email, password, displayName, dateOfBirth, gender })
      setSuccess(res.data.success)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return { signup, loading, error, success }
}

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const verifyEmail = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.verifyEmail({ token })
      setSuccess(res.data.success ?? true)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return { verifyEmail, loading, error, success }
}