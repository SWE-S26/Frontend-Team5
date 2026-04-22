import axios from "axios";

import { likeService } from "@/services/likes.service";
import {
  GetTrackLikeStatusErrorResponse,
  LikeTrackErrorResponse,
  LikeUser,
} from "@/types/likes.types";
import { useCallback, useEffect, useState } from "react";
import { fetchTrackLikes } from "@/services/likes.service";

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

export function useLikeTrackOptimistic(trackId: string, initialLikes?: number) {
  const { isLiked: initialIsLiked } = useLikeStatus(trackId);

  const [liked, setLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiked(initialIsLiked);
  }, [initialIsLiked]);

  useEffect(() => {
    if (!trackId) return;

    const load = async () => {
      try {
        const res = await fetchTrackLikes(trackId, 1, 1);
        setNumOfLikes(res.total);
      } catch {}
    };

    load();
  }, [trackId]);

  const likeTrackOptimistic = useCallback(async () => {
    if (!trackId || loading) return;

    const prevLiked = liked;
    const prevLikes = numOfLikes;

    const nextLiked = !liked;

    setLiked(nextLiked);
    setNumOfLikes((prev) => (prev ?? 0) + (nextLiked ? 1 : -1));
    setLoading(true);
    setError(null);

    try {
      const res = await likeService.likeTrack(trackId);

      setLiked(res.data.liked);
      setNumOfLikes(res.data.numOfLikes);
    } catch (err) {
      setLiked(prevLiked);
      setNumOfLikes(prevLikes);

      if (axios.isAxiosError<LikeTrackErrorResponse>(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [trackId, liked, numOfLikes, loading]);

  return {
    likeTrack: likeTrackOptimistic,
    liked,
    numOfLikes,
    loading,
    error,
  };
}
