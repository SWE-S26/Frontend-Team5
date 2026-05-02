// src/hooks/admin/useAdminTrackActions.ts

import { useState } from "react";
import { adminTracksService } from "@/services/admin-dash/adminTracks.service";

export function useAdminTrackActions(onSuccess: () => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const banTrack = async (trackId: string, reason: string) => {
    setLoadingId(trackId);
    setError(null);
    try {
      await adminTracksService.banTrack(trackId, { reason });
      onSuccess();
    } catch {
      setError("Failed to ban track.");
    } finally {
      setLoadingId(null);
    }
  };

  const unbanTrack = async (trackId: string) => {
    setLoadingId(trackId);
    setError(null);
    try {
      await adminTracksService.unbanTrack(trackId);
      onSuccess();
    } catch {
      setError("Failed to unban track.");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteTrack = async (trackId: string) => {
    setLoadingId(trackId);
    setError(null);
    try {
      await adminTracksService.deleteTrack(trackId);
      onSuccess();
    } catch {
      setError("Failed to delete track.");
    } finally {
      setLoadingId(null);
    }
  };

  return { banTrack, unbanTrack, deleteTrack, loadingId, error };
}