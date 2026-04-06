import { useState, useCallback } from "react"
import { profileService } from "@/services/profile.service"
import { UpdateProfileImagesRequest, UpdateProfileImagesResponse } from "@/types/profile.types"

export function useUpdateProfileImages() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const updateProfileImages = useCallback(async (data: UpdateProfileImagesRequest): Promise<UpdateProfileImagesResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await profileService.updateProfileImages(data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProfileImages, loading, error }
}