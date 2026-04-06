import api from "@/lib/api"
import { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse, UpdateProfileImagesRequest, UpdateProfileImagesResponse } from "@/types/profile.types";

export const profileService = {
  getProfile: (userId: string) =>
    api.get<GetProfileResponse>(`/api/profile/v1/${userId}`),

  updateProfile: (data: UpdateProfileRequest | FormData) =>
    api.patch<UpdateProfileResponse>(`/api/profile/v1`, data, {
      headers: {
        // Let the browser set Content-Type automatically for FormData
        // For plain objects it will default to application/json
        ...(data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {}),
      },
    }),

    updateProfileImages: (data: UpdateProfileImagesRequest) => {
    const formData = new FormData()

    if (data.profileImage)     formData.append("profileImage",    data.profileImage)
    if (data.bannerImage)      formData.append("bannerImage",     data.bannerImage)
    if (data.removeProfileImg) formData.append("removeProfileImg","true")  // ← string not boolean
    if (data.removeBannerImg)  formData.append("removeBannerImg", "true")  // ← string not boolean

    return api.patch<UpdateProfileImagesResponse>(`/api/profile/v1/images`, formData)
    // ← no need to manually set Content-Type, axios sets it automatically with the boundary for FormData
  },
}
