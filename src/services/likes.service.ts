import api from "@/lib/api";
import {
  GetTrackLikeStatusResponse,
  LikeTrackResponse,
  TrackLikesResponse,
} from "@/types/likes.types";

export const likeService = {
  /* (1) */
  likeTrack: (trackId: string) =>
    api.post<LikeTrackResponse>(`/api/engagement/tracks/v1/${trackId}/like`),

  getLikeStatus: (trackId: string) =>
    api.get<GetTrackLikeStatusResponse>(
      `/api/engagement/tracks/v1/${trackId}/like`,
    ),
};

export const fetchTrackLikes = async (
  trackId: string,
  offset = 1,
  limit = 20,
): Promise<TrackLikesResponse> => {
  const res = await api.get(
    `/api/public/engagement/tracks/v1/${trackId}/likes`,
    { params: { offset, limit } },
  );
  return res.data;
};
