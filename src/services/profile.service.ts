import api from "@/lib/api"
import { GetProfileResponse } from "@/types/profile.types"

export const profileService = {
  /* (1) */
  getProfile: (userId: string) =>
    api.get<GetProfileResponse>(`/api/profile/v1/${userId}`),
}