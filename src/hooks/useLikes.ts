import axios from "axios";

import { likeService, fetchTrackLikes, fetchPlaylistLikes } from "@/services/likes.service";
import {
  GetTrackLikeStatusErrorResponse,
  LikeTrackErrorResponse,
  LikeUser,
} from "@/types/likes.types";
import { useCallback, useEffect, useState } from "react";

export function useLikeStatus(trackId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackId) return;

    const load = async () => {
      try {
        const res = await likeService.getLikeStatus(trackId);
        setIsLiked(res.data.liked);
      } catch (err) {
        if (axios.isAxiosError<GetTrackLikeStatusErrorResponse>(err)) {
          setError(err.response?.data?.message || "Failed");
        } else {
          setError("Failed");
        }
      }
    };

    load();
  }, [trackId]);

  return { isLiked, error };
}

export function useLikeTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [numOfLikes, setNumOfLikes] = useState<number | null>(null);
  const [users, setUsers] = useState<LikeUser[]>([]);
  const [total, setTotal] = useState(0);

  const likeTrack = useCallback(async (trackId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await likeService.likeTrack(trackId);
      setLiked(res.data.liked);
      setNumOfLikes(res.data.numOfLikes);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError<LikeTrackErrorResponse>(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLikes = async (trackId: string, offset = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTrackLikes(trackId, offset, limit);
      setUsers((prev) => (offset === 1 ? res.users : [...prev, ...res.users]));
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (trackId: string, offset: number, limit?: number) => {
    loadLikes(trackId, offset, limit);
  };

  return {
    likeTrack,
    loading,
    error,
    liked,
    numOfLikes,
    users,
    total,
    hasMore: users.length < total,
    loadLikes,
    loadMore,
  };
}

export function useLikeTrackOptimistic(trackId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likeTrackOptimistic = useCallback(async () => {
    if (!trackId || loading) return;
    setLoading(true);
    setError(null);

    try {
      await likeService.likeTrack(trackId);
    } catch (err) {
      if (axios.isAxiosError<LikeTrackErrorResponse>(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [trackId, loading]);

  return {
    likeTrack: likeTrackOptimistic,
    loading,
    error,
  };
}

export function useLikePlaylistOptimistic(playlistId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likePlaylistOptimistic = useCallback(async () => {
    if (!playlistId || loading) return;

    setLoading(true);
    setError(null);

    try {
      await likeService.likePlaylist(playlistId);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [playlistId, loading]);

  return {
    likePlaylist: likePlaylistOptimistic,
    loading,
    error,
  };
}

// NEW — fetches the list of users who liked a playlist
export function usePlaylistLikesList(playlistId: string) {
  const [users, setUsers] = useState<LikeUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLikes = async (offset = 1, limit = 20) => {
    if (!playlistId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPlaylistLikes(playlistId, offset, limit);
      setUsers((prev) => (offset === 1 ? res.users : [...prev, ...res.users]));
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (offset: number, limit?: number) => {
    loadLikes(offset, limit);
  };

  return {
    users,
    total,
    hasMore: users.length < total,
    loading,
    error,
    loadLikes,
    loadMore,
  };
}
