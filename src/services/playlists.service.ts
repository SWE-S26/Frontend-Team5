import api from "@/lib/api";
import {
  CreatePlaylistRequest,
  CreatePlaylistWithImageRequest,
  CreatePlaylistResponse,
  GetPlaylistsResponse,
  GetPublicPlaylistsResponse,
  GetPublicPlaylistByIdResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  UpdatePlaylistRequest,
  UpdatePlaylistResponse,
  UpdatePlaylistImageRequest,
  UpdatePlaylistImageResponse,
  DeletePlaylistResponse,
  AddTrackToPlaylistResponse,
  ReorderPlaylistTracksRequest,
  ReorderPlaylistTracksResponse,
  GetPlaylistCreatorResponse,
  GetRecommendedPlaylistsResponse,
  GetArtistPlaylistsResponse,
  GetArtistAlbumsResponse,
  GetPlaylistByPermalinkResponse,
  AddPlaylistToHistoryResponse,
  Playlist,
} from "@/types/playlists.types";

export const playlistsService = {
  createPlaylist: (data: CreatePlaylistRequest) =>
    api.post<CreatePlaylistResponse>("/api/playlists/v1", data),

  createPlaylistWithImage: (data: CreatePlaylistWithImageRequest) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title,
        description: data.description ?? "",
        isPrivate: data.isPrivate,
        listOfTracks: data.listOfTracks,
        buyLink: data.buyLink,
        recordLabel: data.recordLabel,
      }),
    );
    if (data.image) formData.append("image", data.image);

    return api.post<CreatePlaylistResponse>(
      "/api/playlists/v1/with-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

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

  // Public (no auth required)

  getPublicPlaylists: (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetPublicPlaylistsResponse>(
      `/api/public/playlists/v1${query ? `?${query}` : ""}`
    );
  },

  getPublicPlaylistById: (playlistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetPublicPlaylistByIdResponse>(
      `/api/public/playlists/v1/${playlistId}${query ? `?${query}` : ""}`
    );
  },

  getPublicArtistPlaylists: (artistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetArtistPlaylistsResponse>(
      `/api/public/playlists/v1/playlists/${artistId}${query ? `?${query}` : ""}`
    );
  },

  getPublicPlaylistCreator: (artistId: string) =>
    api.get<GetPlaylistCreatorResponse>(
      `/api/public/playlists/v1/creator/${artistId}`
    ),

  getPublicRecommendedPlaylists: (playlistId: string, artistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetRecommendedPlaylistsResponse>(
      `/api/public/playlists/v1/${playlistId}/recommend/${artistId}${query ? `?${query}` : ""}`
    );
  },

  getArtistAlbums: (artistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetArtistAlbumsResponse>(
      `/api/public/playlists/v1/creator/${artistId}/albums${query ? `?${query}` : ""}`
    );
  },

  getPlaylistByPermalink: (permalink: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetPlaylistByPermalinkResponse>(
      `/api/public/playlists/v1/permalink/${permalink}${query ? `?${query}` : ""}`
    );
  },

  // Auth required

  getArtistPlaylists: (artistId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetArtistPlaylistsResponse>(
      `/api/playlists/v1/playlists/${artistId}${query ? `?${query}` : ""}`
    );
  },

  getPlaylistCreator: (creatorId: string) =>
    api.get<GetPlaylistCreatorResponse>(
      `/api/playlists/v1/creator/${creatorId}`
    ),

  getRecommendedPlaylists: (playlistId: string, creatorId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", String(limit));
    if (offset !== undefined) params.append("offset", String(offset));
    const query = params.toString();
    return api.get<GetRecommendedPlaylistsResponse>(
      `/api/playlists/v1/${playlistId}/recommend/${creatorId}${query ? `?${query}` : ""}`
    );
  },

  updatePlaylistImage: (playlistId: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    return api.patch<UpdatePlaylistImageResponse>(
      `/api/playlists/v1/${playlistId}/image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  reorderPlaylistTracks: (playlistId: string, data: ReorderPlaylistTracksRequest) =>
    api.patch<ReorderPlaylistTracksResponse>(
      `/api/playlists/v1/${playlistId}/tracks/order`,
      data
    ),

  addPlaylistToHistory: (playlistId: string) =>
    api.post<AddPlaylistToHistoryResponse>(
      `/api/v1/playlists/${playlistId}/history`
    ),

    getTrackPlaylists: async (trackId: string) => {
      const res = await api.get(`/api/tracks/v1/playlists/${trackId}`);
      return res.data.data as Playlist[];
    },

    getTrackAlbums: async (trackId: string) => {
      const res = await api.get(`/api/tracks/v1/albums/${trackId}`);
      return res.data.data as Playlist[];
    },
};

