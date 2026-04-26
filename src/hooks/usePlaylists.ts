import axios from "axios";
import { playlistsService } from "@/services/playlists.service";
import { useCallback, useState } from "react";
import {
  CreatePlaylistRequest,
  CreatePlaylistResponse,
  GetPlaylistsResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  UpdatePlaylistRequest,
  Playlist,
  PlaylistDetail,
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

  const getPlaylists = useCallback(
    async (limit?: number, offset?: number) => {
      setLoading(true);
      setError(null);
      setPlaylists(null);
      try {
        const res = await playlistsService.getPlaylists(limit, offset);
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
    },
    []
  );

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
            err.response?.data?.message || "Failed to fetch your playlists"
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getMyPlaylists, loading, error, playlists };
}

export function useGetPlaylistById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const getPlaylistById = useCallback(
    async (playlistId: string, limit?: number, offset?: number) => {
      if (!playlistId) return;
      setLoading(true);
      setError(null);
      setPlaylist(null);
      setHasFetched(false);
      try {
        const res = await playlistsService.getPlaylistById(
          playlistId,
          limit,
          offset
        );
        const playlistPayload = res.data?.data?.playlist;
        const playlistData = Array.isArray(playlistPayload)
          ? playlistPayload[0] ?? null
          : playlistPayload ?? null;
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
    []
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
    []
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
          trackId
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
    []
  );

  return { addTrackToPlaylist, loading, error, success };
}