import api from "@/lib/api";
import {
  GetTrackLikeStatusResponse,
  LikeTrackResponse,
  TrackLikesResponse,
} from "@/types/likes.types";

export const likeService = {
  likeTrack: (trackId: string) =>
    api.post<LikeTrackResponse>(`/api/engagement/tracks/v1/${trackId}/like`),

  getLikeStatus: (trackId: string) =>
    api.get<GetTrackLikeStatusResponse>(
      `/api/engagement/tracks/v1/${trackId}/like`,
    ),

  likePlaylist: (playlistId: string) =>
    api.post(`/api/engagement/playlists/v1/${playlistId}/like`),
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

// NEW — playlist likes list (different endpoint from track likes)
export const fetchPlaylistLikes = async (
  playlistId: string,
  offset = 1,
  limit = 20,
): Promise<TrackLikesResponse> => {
  const res = await api.get(
    `/api/public/engagement/playlists/v1/${playlistId}/likes`,
    { params: { offset, limit } },
  );
  return res.data;
};