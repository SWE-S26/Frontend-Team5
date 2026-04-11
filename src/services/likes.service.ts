import api from "@/lib/api";
import { LikeTrackResponse } from "@/types/likes.types";

export const likeService = {
  /* (1) */
  likeTrack: (trackId: string) =>
    api.post<LikeTrackResponse>(`/api/engagement/tracks/v1/${trackId}/like`),
};
