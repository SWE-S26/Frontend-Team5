import api from "@/lib/api";
import {
  GetTrackHistoryResponse,
  GetPlaylistHistoryResponse,
  DeleteHistoryResponse,
} from "@/types/history.types";

export const historyService = {
  getTrackHistory: () => api.get<GetTrackHistoryResponse>("/api/playback/v1/history/tracks"),

  getPlaylistHistory: () =>
    api.get<GetPlaylistHistoryResponse>("/api/playback/v1/history/playlists"),

  deleteHistory: () => api.delete<DeleteHistoryResponse>("/api/playback/v1/history/"),
};
