import axios from "axios";

import { likeService } from "@/services/likes.service";
import { LikeTrackErrorResponse, LikeUser } from "@/types/likes.types";
import { useCallback, useState } from "react";
import { fetchTrackLikes } from "@/services/likes.service";

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
      setUsers(prev => offset === 1 ? res.users : [...prev, ...res.users]);
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