import api from "@/lib/api"
import { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse, UpdateProfileImagesRequest, UpdateProfileImagesResponse } from "@/types/profile.types";

export const profileService = {
  getProfile: (userId: string) =>
    api.get<GetProfileResponse>(`/api/profile/v1/${userId}`),

  updateProfile: (data: UpdateProfileRequest | FormData) =>
    api.patch<UpdateProfileResponse>(`/api/profile/v1`, data),

  updateProfileImages: (data: UpdateProfileImagesRequest) => {
    const formData = new FormData()

    if (data.profileImage)     formData.append("profileImage",    data.profileImage)
    if (data.bannerImage)      formData.append("bannerImage",     data.bannerImage)
    if (data.removeProfileImg) formData.append("removeProfileImg","true")
    if (data.removeBannerImg)  formData.append("removeBannerImg", "true")

    return api.patch<UpdateProfileImagesResponse>(`/api/profile/v1/images`, formData)
  },
}