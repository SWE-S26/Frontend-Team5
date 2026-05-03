import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { artistService } from "@/services/artist.service";
import { ArtistAnalyticsResponse } from "@/types/artist.types";

export interface UseArtistReturn {
  analytics: ArtistAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useArtist = (): UseArtistReturn => {
  const [analytics, setAnalytics] = useState<ArtistAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await artistService.getArtistAnalytics();
      if (isMounted.current) {
        setAnalytics(data);
      }
    } catch (err) {
      if (isMounted.current) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch artist analytics");
        } else {
          setError("An unexpected error occurred");
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};
