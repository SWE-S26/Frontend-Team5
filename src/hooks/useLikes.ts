import axios from "axios";

import { likeService } from "@/services/likes.service";
import { LikeTrackErrorResponse } from "@/types/likes.types";
import { useCallback, useState } from "react";

export function useLikeTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [numOfLikes, setNumOfLikes] = useState<number | null>(null);

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

  return { likeTrack, loading, error, liked, numOfLikes };
}
