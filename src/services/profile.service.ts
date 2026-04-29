import api from "@/lib/api"
import { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse, UpdateProfileImagesRequest, UpdateProfileImagesResponse } from "@/types/profile.types";

export const profileService = {
  getProfile: (userId: string) =>
    api.get<GetProfileResponse>(`/api/public/profile/v1/${userId}`),

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