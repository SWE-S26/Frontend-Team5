import axios from "axios";
import { useCallback, useState } from "react";

import { feedService } from "@/services/feed.service";
import { FeedItem, GetFeedErrorResponse } from "@/types/feed.types";

export function useGetFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const getFeed = useCallback(async (offset = 0, limit = 20, includeReposts = true) => {
    setLoading(true);
    setError(null);
    if (offset === 0) {
      setHasMore(true); // reset hasMore on fresh fetch
    }
    try {
      const res = await feedService.getFeed(offset, limit, includeReposts);
      const incoming = res.data;

      setItems((prev) =>
        offset === 0
          ? incoming // ← replace on reset
          : [...prev, ...incoming.filter((i) => !prev.some((p) => p.id === i.id))]
      );

      setHasMore(incoming.length >= limit);
      return incoming;
    } catch (err) {
      if (axios.isAxiosError<GetFeedErrorResponse>(err)) {
        setError(err.response?.data?.message || "Failed to load feed");
      } else {
        setError("Failed to load feed");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    getFeed,
    reset,
    items,
    loading,
    error,
    hasMore,
  };
}
