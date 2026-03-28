import { useState, useCallback } from "react"
import { profileService } from "@/services/profile.service"
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile.types"

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [profile, setProfile] = useState<UpdateProfileResponse | null>(null)

  const updateProfile = useCallback(async (data: UpdateProfileRequest | FormData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await profileService.updateProfile(data)
      setProfile(res.data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProfile, loading, error, profile }
}