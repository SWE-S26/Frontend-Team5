import { incrementPlayCountRequest } from './../types/tracks.types';
import api from "@/lib/api";
import {
  GetPostedTracksResponse,
  GetTrackPlaylistsResponse,
  GetTracksResponse,
  GetTrackStatsResponse,
} from "@/types/tracks.types";

import {
	CreateTrackRequest,
	CreateTrackResponse,
	GetTrackByIdResponse,
  GetTrackPermalinkResponse,
  GetTrackDetailedResponse,
	CheckTrackPermalinkResponse,
	UpdateTrackRequest,
	UpdateTrackResponse,
	incrementPlayCountResponse,
	deleteTrackResponse,
	GetUploadQuotaResponse,
  GetLikedTracksResponse,
  AddTrackToHistoryResponse,
  GetRepostedTracksResponse
} from "@/types/tracks.types";

const appendTrackMetadata = (
  formData: FormData,
  data: {
    basicInfo: CreateTrackRequest["basicInfo"] | UpdateTrackRequest["basicInfo"];
    permissions?: CreateTrackRequest["permissions"] | UpdateTrackRequest["permissions"];
    license?: CreateTrackRequest["license"] | UpdateTrackRequest["license"];
    advanced?: CreateTrackRequest["advanced"] | UpdateTrackRequest["advanced"];
    geoBlocking?: CreateTrackRequest["geoBlocking"] | UpdateTrackRequest["geoBlocking"];
  },
) => {
  formData.append("basicInfo", JSON.stringify(data.basicInfo));
  if (data.permissions) {
    formData.append("permissions", JSON.stringify(data.permissions));
  }
  if (data.license) {
    formData.append("license", JSON.stringify(data.license));
  }
  if (data.geoBlocking) {
      formData.append("geoBlocking", JSON.stringify({
        mode: data.geoBlocking.mode,
        regions: data.geoBlocking.regions || [],
        countries: data.geoBlocking.countries || [],
      }));
  }
  if (data.advanced) {
    formData.append("advanced", JSON.stringify(data.advanced));
  }
};

const buildQuery = (page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page !== undefined) params.append("page", String(page));
  if (limit !== undefined) params.append("limit", String(limit));
  const query = params.toString();
  return query ? `?${query}` : "";
};

const submitCreateTrack = (
  data: CreateTrackRequest,
  onUploadProgress?: (progress: number) => void,
) => {
  const formData = new FormData();

  formData.append("audio", data.audio);
  if (data.image) {
    formData.append("image", data.image);
  }

  appendTrackMetadata(formData, data);

  return api.post<CreateTrackResponse>("/api/tracks/v2", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress
      ? (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded / event.total) * 100);
          onUploadProgress(percent);
        }
      : undefined,
  });
};

const submitUpdateTrack = (data: UpdateTrackRequest) => {
  const formData = new FormData();

  formData.append("id", data.id);
  if (data.image) {
    formData.append("image", data.image);
  }

  appendTrackMetadata(formData, data);

  return api.patch<UpdateTrackResponse>("/api/tracks/v2", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const tracksService = {
  createTrack: (
    data: CreateTrackRequest,
    onUploadProgress?: (progress: number) => void,
  ) => {
    return submitCreateTrack(data, onUploadProgress);
  },
  getTracks: (page: number, limit: number) =>
    api.get<GetTracksResponse>(`/api/tracks/v2/${buildQuery(page, limit)}`),
  getPublicTracks: (page: number, limit: number) =>
    api.get<GetTracksResponse>(`/api/public/tracks/v2/${buildQuery(page, limit)}`),
  getPostedTracks: (userId: string) =>
    api.get<GetPostedTracksResponse>(`/api/tracks/v2/posted/${userId}`),
  getPublicPostedTracks: (userId: string) =>
    api.get<GetPostedTracksResponse>(`/api/public/tracks/v2/posted/${userId}`),
  getTrackById: (id: string) =>
    api.get<GetTrackByIdResponse>(`/api/tracks/v2/${id}`),
  getPublicTrackById: (id: string) =>
    api.get<GetTrackByIdResponse>(`/api/public/tracks/v2/${id}`),
  getTrackByPermalink: (profileLink: string, permalink: string) =>
    api.get<GetTrackPermalinkResponse>(`/api/tracks/v2/permalink/${profileLink}/${permalink}`),
  getPublicTrackByPermalink: (profileLink: string, permalink: string) =>
    api.get<GetTrackPermalinkResponse>(`/api/public/tracks/v2/permalink/${profileLink}/${permalink}`),
  getTrackDetailed: (id: string) =>
    api.get<GetTrackDetailedResponse>(`/api/tracks/v2/detailed/${id}`),
  getPublicLikedTracks: (userId: string) =>
    api.get<GetLikedTracksResponse>(`/api/public/tracks/v2/liked/${userId}`),
  getLikedTracks: (userId: string) =>
    api.get<GetLikedTracksResponse>(`/api/tracks/v2/liked/${userId}`),

  UpdateTrack: (data: UpdateTrackRequest) => {
    return submitUpdateTrack(data);
  },
  updateTrack: (data: UpdateTrackRequest) => submitUpdateTrack(data),

  incrementPlayCount: (data: incrementPlayCountRequest) =>
    api.patch<incrementPlayCountResponse>(`/api/tracks/v2/listen`, data),
  incrementDownloadCount: (data: { trackId: string; sessionIdDownload: string }) =>
    api.patch<{ message: string }>(`/api/tracks/v2/download`, data),
  addTrackToHistory: (id: string) =>
    api.post<AddTrackToHistoryResponse>(`/api/tracks/v1/played/${id}`),

	deleteTrack: (id: string) =>
		api.delete<deleteTrackResponse>(`/api/tracks/v1/${id}`),
	getUploadQuota: () =>
		api.get<GetUploadQuotaResponse>("/api/tracks/v1/quota"),
  checkTrackPermalinkValidity: (permalink: string) =>
    api.get<CheckTrackPermalinkResponse>(`/api/tracks/v1/permalink/valid/${permalink}`),

  getTrackPlaylists: (trackId: string) =>
  api.get<GetTrackPlaylistsResponse>(`/api/tracks/v1/playlists/${trackId}`),
  
  getPublicTrackPlaylists: (trackId: string) =>
  api.get<GetTrackPlaylistsResponse>(`/api/public/tracks/v1/playlists/${trackId}`),

  getTrackAlbums: (trackId: string) =>
    api.get<GetTrackPlaylistsResponse>(`/api/tracks/v2/albums/${trackId}`),

  getPublicTrackAlbums: (trackId: string) =>
    api.get<GetTrackPlaylistsResponse>(`/api/public/tracks/v1/albums/${trackId}`),

  getTrackStats: (trackId: string) =>
  api.get<GetTrackStatsResponse>(`/api/tracks/v2/stats/${trackId}`),

  getPublicTrackStats: (trackId: string) =>
    api.get<GetTrackStatsResponse>(`/api/public/tracks/v2/stats/${trackId}`),

  getRepostedTracks: (userId: string, offset = 1, limit = 20) =>
    api.get<GetRepostedTracksResponse>(
      `/api/public/engagement/tracks/v1/users/${userId}/reposted`,
      { params: { offset, limit } },
    ),

};
