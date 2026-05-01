import { useState, useCallback } from "react"
import { profileService } from "@/services/profile.service"
import {
  GetProfileResponse,
  UpdateProfileRequest, UpdateProfileResponse,
  UpdateProfileImagesRequest, UpdateProfileImagesResponse,
} from "@/types/profile.types"

export function useGetProfile() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [profile, setProfile] = useState<GetProfileResponse | null>(null)

  const getProfile = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getProfileAuthCached(userId)
      setProfile(data)
      return data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { getProfile, loading, error, profile }
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [profile, setProfile] = useState<UpdateProfileResponse | null>(null)

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    setLoading(true)
    setError(null)
    try {
      const res = await profileService.updateProfile(data)
      setProfile(res.data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProfile, loading, error, profile }
}

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