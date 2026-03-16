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