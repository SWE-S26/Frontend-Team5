import api from "@/lib/api";
import {
  CreatePlaylistRequest,
  CreatePlaylistResponse,
  GetPlaylistsResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  UpdatePlaylistRequest,
  UpdatePlaylistResponse,
  DeletePlaylistResponse,
  AddTrackToPlaylistResponse,
} from "@/types/playlists.types";

export const playlistsService = {
  createPlaylist: (data: CreatePlaylistRequest) =>
    api.post<CreatePlaylistResponse>("/api/playlists/v1", data),

  getPlaylists: (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetPlaylistsResponse>(
      `/api/playlists/v1${query ? `?${query}` : ""}`
    );
  },

  getMyPlaylists: (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    const normalizedOffset =
      offset !== undefined ? Math.max(1, Math.floor(offset)) : undefined;
    if (normalizedOffset !== undefined)
      params.append("offset", String(normalizedOffset));
    const query = params.toString();
    return api.get<GetMyPlaylistsResponse>(
      `/api/playlists/v1/my-playlists${query ? `?${query}` : ""}`
    );
  },

  getPlaylistById: (playlistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetPlaylistByIdResponse>(
      `/api/playlists/v1/${playlistId}${query ? `?${query}` : ""}`
    );
  },

  updatePlaylist: (playlistId: string, data: UpdatePlaylistRequest) => {
    const formData = new FormData();

    if (data.title) formData.append("title", data.title);
    if (data.permalink) formData.append("permalink", data.permalink);
    if (data.additionalTags)
      data.additionalTags.forEach((tag) => formData.append("additionalTags", tag));
    if (data.type) formData.append("type", data.type);
    if (data.playlistType) formData.append("playlistType", data.playlistType);
    if (data.releaseDate) formData.append("releaseDate", data.releaseDate);
    if (data.genre) formData.append("genre", data.genre);
    if (data.tags) data.tags.forEach((tag) => formData.append("tags", tag));
    if (data.description) formData.append("description", data.description);
    if (data.isPrivate !== undefined)
      formData.append("isPrivate", String(data.isPrivate));
    if (data.audioTracks)
      data.audioTracks.forEach((id) => formData.append("audioTracks", id));
    if (data.lengthOfRecievedTracks !== undefined)
      formData.append("lengthOfRecievedTracks", String(data.lengthOfRecievedTracks));
    if (data.licensing)
      formData.append("licensing", JSON.stringify(data.licensing));
    if (data.buyLink) formData.append("buyLink", data.buyLink);
    if (data.recordLabel) formData.append("recordLabel", data.recordLabel);
    if (data.image) formData.append("image", data.image);

    return api.put<UpdatePlaylistResponse>(
      `/api/playlists/v1/${playlistId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  deletePlaylist: (playlistId: string) =>
    api.delete<DeletePlaylistResponse>(`/api/playlists/v1/${playlistId}`),

  addTrackToPlaylist: (playlistId: string, trackId: string) =>
    api.patch<AddTrackToPlaylistResponse>(
      `/api/playlists/v1/${playlistId}/tracks/${trackId}`
    ),
};