import api from "@/lib/api"
import { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse, UpdateProfileImagesRequest, UpdateProfileImagesResponse } from "@/types/profile.types";

const PROFILE_CACHE_TTL_MS = 30_000

const profileCache = new Map<string, { data: GetProfileResponse; expiresAt: number }>()
const profileInFlight = new Map<string, Promise<GetProfileResponse>>()

const getCacheKey = (scope: "public" | "auth", userId: string) => `${scope}:${userId}`

function invalidateProfileCache(userId: string) {
  profileCache.delete(getCacheKey("public", userId))
  profileCache.delete(getCacheKey("auth", userId))
  profileInFlight.delete(getCacheKey("public", userId))
  profileInFlight.delete(getCacheKey("auth", userId))
}

async function fetchProfileCached(scope: "public" | "auth", userId: string) {
  const key = getCacheKey(scope, userId)
  const cached = profileCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  const inFlight = profileInFlight.get(key)
  if (inFlight) return inFlight

  const request = api
    .get<GetProfileResponse>(
      scope === "auth"
        ? `/api/profile/v1/${userId}`
        : `/api/public/profile/v1/${userId}`,
    )
    .then((res) => {
      profileCache.set(key, {
        data: res.data,
        expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
      })
      return res.data
    })
    .finally(() => {
      profileInFlight.delete(key)
    })

  profileInFlight.set(key, request)
  return request
}

export const profileService = {
  getProfile: (userId: string) =>
    api.get<GetProfileResponse>(`/api/public/profile/v1/${userId}`),

  getProfileAuth: (userId: string) =>
    api.get<GetProfileResponse>(`/api/profile/v1/${userId}`),

  getProfileCached: (userId: string) =>
    fetchProfileCached("public", userId),

  getProfileAuthCached: (userId: string) =>
    fetchProfileCached("auth", userId),

  invalidateProfileCache,

  updateProfile: (data: UpdateProfileRequest) =>
    api.patch<UpdateProfileResponse>(`/api/profile/v1`, data),

  updateProfileImages: (data: UpdateProfileImagesRequest) => {
    const formData = new FormData()

    if (data.profileImg) formData.append("profileImg", data.profileImg)
    if (data.bannerImg)  formData.append("bannerImg",  data.bannerImg)

    formData.append("removeProfileImg", data.removeProfileImg ? "true" : "false")
    formData.append("removeBannerImg",  data.removeBannerImg  ? "true" : "false")

    return api.patch<UpdateProfileImagesResponse>(`/api/profile/v1/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}