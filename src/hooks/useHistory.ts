import axios from "axios";
import { useCallback, useState } from "react";
import { historyService } from "@/services/history.service";
import {
  GetTrackHistoryResponse,
  GetPlaylistHistoryResponse,
  HistoryPlaylist,
} from "@/types/history.types";
import { Track } from "@/types/tracks.types";

// ─── Track History ────────────────────────────────────────────────────────────

export function useGetTrackHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<GetTrackHistoryResponse["data"] | null>(null);

  const getTrackHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTracks(null);
    try {
      const res = await historyService.getTrackHistory();
      setTracks(res.data.data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { getTrackHistory, tracks, loading, error };
}

// ─── Playlist History ─────────────────────────────────────────────────────────

export function useGetPlaylistHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<GetPlaylistHistoryResponse["data"] | null>(null);

  const getPlaylistHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPlaylists(null);
    try {
      const res = await historyService.getPlaylistHistory();
      setPlaylists(res.data.data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { getPlaylistHistory, playlists, loading, error };
}

// ─── Delete History ───────────────────────────────────────────────────────────

export function useDeleteHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const deleteHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await historyService.deleteHistory();
      setSuccess(true);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteHistory, loading, error, success };
}
