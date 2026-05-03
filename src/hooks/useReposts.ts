import axios from "axios";

import { repostService, fetchTrackReposts, fetchPlaylistReposts } from "@/services/reposts.service";
import {
  RepostTrackErrorResponse,
  RepostPlaylistErrorResponse,
  GetTrackRepostStatusErrorResponse,
  RepostUser,
} from "@/types/reposts.types";
import { useCallback, useEffect, useState } from "react";

// ─── Track ────────────────────────────────────────────────────────────────────

export function useRepostTrack(trackId: string, enabled = true, initialNumReposts?: number) {
  const [reposted, setReposted] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [numOfReposts, setNumOfReposts] = useState<number | null>(initialNumReposts ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial repost status — only when visible
  useEffect(() => {
    if (!trackId || !enabled) return;

    const loadStatus = async () => {
      try {
        const res = await repostService.getTrackRepostStatus(trackId);
        setReposted(res.data.reposted);
        setCaption(res.data.caption);
      } catch (err) {
        if (axios.isAxiosError<GetTrackRepostStatusErrorResponse>(err)) {
          setError(err.response?.data?.message || "Failed");
        } else {
          setError("Failed");
        }
      }
    };

    loadStatus();
  }, [trackId, enabled]);

  // Fetch repost count on mount only if no initial value was provided
  useEffect(() => {
    if (!trackId || !enabled || initialNumReposts !== undefined) return;

    const loadCount = async () => {
      try {
        const res = await fetchTrackReposts(trackId, 1, 1);
        setNumOfReposts(res.total);
      } catch {}
    };

    loadCount();
  }, [trackId, enabled, initialNumReposts]);

  const repostTrack = useCallback(
    async (newCaption?: string) => {
      if (!trackId || loading) return;

      const prevReposted = reposted;
      const prevReposts = numOfReposts;
      const prevCaption = caption;

      const nextReposted = !reposted;

      setReposted(nextReposted);
      setNumOfReposts((prev) => (prev ?? 0) + (nextReposted ? 1 : -1));
      if (newCaption !== undefined) setCaption(newCaption);
      setLoading(true);
      setError(null);

      try {
        const res = await repostService.repostTrack(trackId, newCaption);
        setReposted(res.data.reposted);
        setNumOfReposts(res.data.numberOfReposts);
      } catch (err) {
        setReposted(prevReposted);
        setNumOfReposts(prevReposts);
        setCaption(prevCaption);

        if (axios.isAxiosError<RepostTrackErrorResponse>(err)) {
          setError(err.response?.data?.message || "Something went wrong");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [trackId, reposted, numOfReposts, caption, loading]
  );

  return {
    repostTrack,
    reposted,
    caption,
    numOfReposts,
    loading,
    error,
  };
}

export function useTrackRepostsList(trackId: string) {
  const [users, setUsers] = useState<RepostUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReposts = async (offset = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTrackReposts(trackId, offset, limit);
      setUsers((prev) => (offset === 1 ? res.users : [...prev, ...res.users]));
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (offset: number, limit?: number) => {
    loadReposts(offset, limit);
  };

  return {
    users,
    total,
    hasMore: users.length < total,
    loading,
    error,
    loadReposts,
    loadMore,
  };
}

// ─── Playlist ─────────────────────────────────────────────────────────────────

export function useRepostPlaylist(playlistId: string, enabled = true, initialNumReposts?: number) {
  const [reposted, setReposted] = useState(false);
  const [numOfReposts, setNumOfReposts] = useState<number | null>(initialNumReposts ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch repost count on mount only if no initial value was provided
  useEffect(() => {
    if (!playlistId || !enabled || initialNumReposts !== undefined) return;

    const loadCount = async () => {
      try {
        const res = await fetchPlaylistReposts(playlistId, 1, 1);
        setNumOfReposts(res.total);
      } catch {}
    };

    loadCount();
  }, [playlistId, enabled, initialNumReposts]);

  const repostPlaylistOptimistic = useCallback(
    async (caption?: string) => {
      if (!playlistId || loading) return;

      const prevReposted = reposted;
      const prevReposts = numOfReposts;

      const nextReposted = !reposted;

      setReposted(nextReposted);
      setNumOfReposts((prev) => (prev ?? 0) + (nextReposted ? 1 : -1));
      setLoading(true);
      setError(null);

      try {
        const res = await repostService.repostPlaylist(playlistId, caption);
        setReposted(res.data.reposted);
        setNumOfReposts(res.data.numberOfReposts);
      } catch (err) {
        setReposted(prevReposted);
        setNumOfReposts(prevReposts);

        if (axios.isAxiosError<RepostPlaylistErrorResponse>(err)) {
          setError(err.response?.data?.message || "Something went wrong");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [playlistId, reposted, numOfReposts, loading]
  );

  return {
    repostPlaylist: repostPlaylistOptimistic,
    reposted,
    numOfReposts,
    loading,
    error,
  };
}

export function usePlaylistRepostsList(playlistId: string) {
  const [users, setUsers] = useState<RepostUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReposts = async (offset = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPlaylistReposts(playlistId, offset, limit);
      setUsers((prev) => (offset === 1 ? res.users : [...prev, ...res.users]));
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (offset: number, limit?: number) => {
    loadReposts(offset, limit);
  };

  return {
    users,
    total,
    hasMore: users.length < total,
    loading,
    error,
    loadReposts,
    loadMore,
  };
}
