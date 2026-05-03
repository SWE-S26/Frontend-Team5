import api from "@/lib/api";
import {
  GetTrackRepostStatusResponse,
  RepostTrackResponse,
  UpdateTrackRepostResponse,
  RepostPlaylistResponse,
  TrackRepostsResponse,
  PlaylistRepostsResponse,
} from "@/types/reposts.types";

export const repostService = {
  /* (1) Toggle repost on a track */
  repostTrack: (trackId: string, caption?: string) =>
    api.post<RepostTrackResponse>(`/api/engagement/tracks/v1/${trackId}/repost`, { caption }),

  /* (2) Get repost status for a track */
  getTrackRepostStatus: (trackId: string) =>
    api.get<GetTrackRepostStatusResponse>(`/api/engagement/tracks/v1/${trackId}/repost`),

  /* (3) Update repost caption for a track */
  updateTrackRepost: (trackId: string, caption: string) =>
    api.patch<UpdateTrackRepostResponse>(`/api/engagement/tracks/v1/${trackId}/repost`, {
      caption,
    }),

  /* (4) Toggle repost on a playlist */
  repostPlaylist: (playlistId: string, caption?: string) =>
    api.post<RepostPlaylistResponse>(`/api/engagement/playlists/v1/${playlistId}/repost`, {
      caption,
    }),
};

export const fetchTrackReposts = async (
  trackId: string,
  offset = 1,
  limit = 20
): Promise<TrackRepostsResponse> => {
  const res = await api.get(`/api/public/engagement/tracks/v1/${trackId}/reposts`, {
    params: { offset, limit },
  });
  return res.data;
};

export const fetchPlaylistReposts = async (
  playlistId: string,
  offset = 1,
  limit = 20
): Promise<PlaylistRepostsResponse> => {
  const res = await api.get(`/api/public/engagement/playlists/v1/${playlistId}/reposts`, {
    params: { offset, limit },
  });
  return res.data;
};
