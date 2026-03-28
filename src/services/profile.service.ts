import api from "@/lib/api"
import { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile.types";

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
}
