import { useState, useCallback } from "react"
import { profileService } from "@/services/profile.service"
import { GetProfileResponse } from "@/types/profile.types"

export function useGetProfile() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [profile, setProfile] = useState<GetProfileResponse | null>(null)

  const getProfile = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await profileService.getProfile(userId)
      setProfile(res.data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { getProfile, loading, error, profile }
}