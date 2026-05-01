import axios from "axios";
import { playlistsService } from "@/services/playlists.service";
import { useCallback, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  CreatePlaylistRequest,
  CreatePlaylistWithImageRequest,
  GetPlaylistsResponse,
  GetPublicPlaylistsResponse,
  GetPublicPlaylistByIdResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  UpdatePlaylistRequest,
  ReorderPlaylistTracksRequest,
  Playlist,
  PlaylistDetail,
  PlaylistCreatorInfo,
  GetRepostedPlaylistsResponse,
} from "@/types/playlists.types";

export function useCreatePlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const createPlaylist = useCallback(async (data: CreatePlaylistRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await playlistsService.createPlaylist(data);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create playlist";
      setError(message);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPlaylist, loading, error, success };
}

export function useGetPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<
    GetPlaylistsResponse["data"]["playlists"] | null
  >(null);
  const isAuthenticated = usePlaylistAuthState();

  const getPlaylists = useCallback(async (limit?: number, offset?: number) => {
    setLoading(true);
    setError(null);
    setPlaylists(null);
    try {
      const request = isAuthenticated
        ? playlistsService.getPlaylists(limit, offset)
        : playlistsService.getPublicPlaylists(limit, offset);
      const res = await request;
      setPlaylists(res.data.data.playlists);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch playlists");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { getPlaylists, loading, error, playlists };
}

export function useGetMyPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<
    GetMyPlaylistsResponse["data"]["playlists"] | null
  >(null);

  const getMyPlaylists = useCallback(
    async (limit?: number, offset?: number) => {
      setLoading(true);
      setError(null);
      setPlaylists(null);
      try {
        const res = await playlistsService.getMyPlaylists(limit, offset);
        setPlaylists(res.data.data.playlists);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch your playlists",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getMyPlaylists, loading, error, playlists };
}

export function useGetPlaylistById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const isAuthenticated = usePlaylistAuthState();

  const getPlaylistById = useCallback(
    async (playlistId: string, limit?: number, offset?: number) => {
      if (!playlistId) return;
      setLoading(true);
      setError(null);
      setPlaylist(null);
      setHasFetched(false);
      try {
        const request = isAuthenticated
          ? playlistsService.getPlaylistById(playlistId, limit, offset)
          : playlistsService.getPublicPlaylistById(playlistId, limit, offset);
        const res = await request;
        const playlistPayload = res.data?.data?.playlist;
        const playlistData = Array.isArray(playlistPayload)
          ? (playlistPayload[0] ?? null)
          : (playlistPayload ?? null);
        setPlaylist(playlistData);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch playlist");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setHasFetched(true);
        setLoading(false);
      }
    },
    [],
  );

  return { getPlaylistById, loading, error, playlist, hasFetched };
}

export function useUpdatePlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const updatePlaylist = useCallback(
    async (playlistId: string, data: UpdatePlaylistRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await playlistsService.updatePlaylist(playlistId, data);
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to update playlist";
        setError(message);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updatePlaylist, loading, error, success };
}

export function useDeletePlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await playlistsService.deletePlaylist(playlistId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to delete playlist";
      setError(message);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePlaylist, loading, error, success };
}

export function useAddTrackToPlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const addTrackToPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await playlistsService.addTrackToPlaylist(
          playlistId,
          trackId,
        );
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to add track to playlist";
        setError(message);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { addTrackToPlaylist, loading, error, success };
}

export function useGetPublicPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<
    GetPublicPlaylistsResponse["data"]["playlists"] | null
  >(null);

  const getPublicPlaylists = useCallback(
    async (limit?: number, offset?: number) => {
      setLoading(true);
      setError(null);
      setPlaylists(null);
      try {
        const res = await playlistsService.getPublicPlaylists(limit, offset);
        setPlaylists(res.data.data.playlists);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch public playlists",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getPublicPlaylists, loading, error, playlists };
}

export function useGetPublicPlaylistById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);

  const getPublicPlaylistById = useCallback(
    async (playlistId: string, limit?: number, offset?: number) => {
      if (!playlistId) return;
      setLoading(true);
      setError(null);
      setPlaylist(null);
      try {
        const res = await playlistsService.getPublicPlaylistById(
          playlistId,
          limit,
          offset,
        );
        const payload = res.data?.data?.playlist;
        const data = Array.isArray(payload)
          ? (payload[0] ?? null)
          : (payload ?? null);
        setPlaylist(data);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch playlist");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getPublicPlaylistById, loading, error, playlist };
}

export function useGetArtistPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const isAuthenticated = usePlaylistAuthState();

  const getArtistPlaylists = useCallback(
    async (
      artistId: string,
      isPublic = false,
      limit?: number,
      offset?: number,
    ) => {
      if (!artistId) return;
      setLoading(true);
      setError(null);
      setPlaylists(null);
      try {
        const usePublic = isPublic || !isAuthenticated;
        const res = usePublic
          ? await playlistsService.getPublicArtistPlaylists(
              artistId,
              limit,
              offset,
            )
          : await playlistsService.getArtistPlaylists(artistId, limit, offset);
        setPlaylists(res.data.data.playlists);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch artist playlists",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getArtistPlaylists, loading, error, playlists };
}

export function useGetPlaylistCreator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<PlaylistCreatorInfo | null>(null);
  const isAuthenticated = usePlaylistAuthState();

  const getPlaylistCreator = useCallback(
    async (creatorId: string, isPublic = false) => {
      if (!creatorId) return;
      setLoading(true);
      setError(null);
      setCreator(null);
      try {
        const usePublic = isPublic || !isAuthenticated;
        const res = usePublic
          ? await playlistsService.getPublicPlaylistCreator(creatorId)
          : await playlistsService.getPlaylistCreator(creatorId);
        const artist = res.data.data.artist;
        setCreator(Array.isArray(artist) ? (artist[0] ?? null) : artist);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch creator info",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getPlaylistCreator, loading, error, creator };
}

export function useGetRecommendedPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const isAuthenticated = usePlaylistAuthState();

  const getRecommendedPlaylists = useCallback(
    async (
      playlistId: string,
      artistId: string,
      isPublic = false,
      limit?: number,
      offset?: number,
    ) => {
      if (!playlistId || !artistId) return;
      setLoading(true);
      setError(null);
      setPlaylists(null);
      try {
        const usePublic = isPublic || !isAuthenticated;
        const res = usePublic
          ? await playlistsService.getPublicRecommendedPlaylists(
              playlistId,
              artistId,
              limit,
              offset,
            )
          : await playlistsService.getRecommendedPlaylists(
              playlistId,
              artistId,
              limit,
              offset,
            );
        setPlaylists(res.data.data.playlists);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch recommended playlists",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getRecommendedPlaylists, loading, error, playlists };
}

export function useGetArtistAlbums() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Playlist[] | null>(null);

  const getArtistAlbums = useCallback(
    async (artistId: string, limit?: number, offset?: number) => {
      if (!artistId) return;
      setLoading(true);
      setError(null);
      setAlbums(null);
      try {
        const res = await playlistsService.getArtistAlbums(
          artistId,
          limit,
          offset,
        );
        setAlbums(res.data.data.playlists);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch albums");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getArtistAlbums, loading, error, albums };
}

export function useGetPlaylistByPermalink() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);

  const getPlaylistByPermalink = useCallback(
    async (permalink: string, limit?: number, offset?: number) => {
      if (!permalink) return;
      setLoading(true);
      setError(null);
      setPlaylist(null);
      try {
        const res = await playlistsService.getPlaylistByPermalink(
          permalink,
          limit,
          offset,
        );
        setPlaylist(res.data.data.playlists?.[0] ?? null);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch playlist");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getPlaylistByPermalink, loading, error, playlist };
}

export function useUpdatePlaylistImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const updatePlaylistImage = useCallback(
    async (playlistId: string, image: File) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await playlistsService.updatePlaylistImage(
          playlistId,
          image,
        );
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to update playlist image",
        );
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updatePlaylistImage, loading, error, success };
}

export function useReorderPlaylistTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const reorderPlaylistTracks = useCallback(
    async (playlistId: string, data: ReorderPlaylistTracksRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await playlistsService.reorderPlaylistTracks(
          playlistId,
          data,
        );
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to reorder tracks");
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { reorderPlaylistTracks, loading, error, success };
}

export function useAddPlaylistToHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const addPlaylistToHistory = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await playlistsService.addPlaylistToHistory(playlistId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to add playlist to history",
      );
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addPlaylistToHistory, loading, error, success };
}

export function useCreatePlaylistWithImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const createPlaylistWithImage = useCallback(
    async (data: CreatePlaylistWithImageRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await playlistsService.createPlaylistWithImage(data);
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to create playlist";
        setError(message);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createPlaylistWithImage, loading, error, success };
}

export function useGetRepostedPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<
    GetRepostedPlaylistsResponse["playlists"]
  >([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(20);

  const getRepostedPlaylists = useCallback(
    async (userId: string, offset = 1, limit = 20) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await playlistsService.getRepostedPlaylists(
          userId,
          offset,
          limit,
        );
        setPlaylists(res.data.playlists ?? []);
        setTotal(res.data.total ?? 0);
        setOffset(res.data.offset ?? offset);
        setLimit(res.data.limit ?? limit);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch reposted playlists",
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    getRepostedPlaylists,
    loading,
    error,
    playlists,
    total,
    offset,
    limit,
  };
}

const usePlaylistAuthState = () =>
  useAppSelector(
    (state) => state.auth.isAuthenticated && state.auth.hasHydrated,
  );
