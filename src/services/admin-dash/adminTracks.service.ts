// src/services/admin/adminTracksService.ts

import api from "@/lib/api";
import {
  AdminTracksParams,
  AdminTracksResponse,
  AdminTrack,
  BanTrackPayload,
} from "@/types/admin-dash/adminTracks.types";

export const adminTracksService = {
  listTracks: async (params?: AdminTracksParams): Promise<AdminTracksResponse> => {
    const response = await api.get("/api/admin/v1/media", { params });
    return response.data;
  },

  banTrack: async (trackId: string, payload: BanTrackPayload): Promise<AdminTrack> => {
    const response = await api.patch(`/api/admin/v1/tracks/${trackId}/ban`, payload);
    return response.data;
  },

  unbanTrack: async (trackId: string): Promise<AdminTrack> => {
    const response = await api.patch(`/api/admin/v1/tracks/${trackId}/unban`);
    return response.data;
  },

  deleteTrack: async (trackId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/admin/v1/tracks/${trackId}`);
    return response.data;
  },
};