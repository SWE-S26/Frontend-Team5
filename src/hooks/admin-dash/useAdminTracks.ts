// src/hooks/admin/useAdminTracks.ts

import { useState, useEffect, useCallback } from "react";
import { AdminTrack, AdminTracksParams } from "@/types/admin-dash/adminTracks.types";
import { adminTracksService } from "@/services/admin-dash/adminTracks.service";

export function useAdminTracks(params?: AdminTracksParams) {
  const [tracks, setTracks] = useState<AdminTrack[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminTracksService.listTracks(params);
      setTracks(data.items);
      setTotal(data.total);
    } catch {
      setError("Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return { tracks, total, loading, error, refetch: fetchTracks };
}