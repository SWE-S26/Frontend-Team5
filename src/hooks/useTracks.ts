import axios from "axios";
import { tracksService } from "@/services/tracks.service";
import { useCallback, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { CreateTrackRequest, incrementPlayCountRequest } from "@/types/tracks.types";
import {
  GetPostedTracksResponse,
  GetTracksErrorResponse,
  GetUploadQuotaResponse,
  GetTracksResponse,
  GetLikedTracksResponse,
  UpdateTrackRequest,
  GetTrackDetailedResponse,
  TrackPlaylist,
  GetTrackPlaylistsResponse,
  TrackFan,
  GetTrackStatsResponse,
  GetRepostedTracksResponse,
} from "@/types/tracks.types";
import { GetTrackByIdResponse } from "@/types/tracks.types";

const useTrackAuthState = () =>
  useAppSelector((state) => state.auth.isAuthenticated && state.auth.hasHydrated);

const getTrackErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
};

export function useCreateTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const createTrack = useCallback(
    async (data: CreateTrackRequest, onUploadProgress?: (progress: number) => void) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await tracksService.createTrack(data, onUploadProgress);
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        const status = err.response?.status;
        const message =
          status === 413
            ? "Upload failed: file is too large for the server limit."
            : err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createTrack, loading, error, success };
}

export function useGetTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<GetTracksErrorResponse["errors"] | null>(
    null
  );
  const [tracks, setTracks] = useState<GetTracksResponse["data"]["tracks"] | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<
    GetTracksResponse["data"]["paginationInfo"] | null
  >(null);
  const isAuthenticated = useTrackAuthState();

  const getTracks = useCallback(
    async (page: number, limit: number) => {
      setLoading(true);
      setError(null);
      setValidationErrors(null);
      setTracks(null);
      setPaginationInfo(null);
      try {
        const request = isAuthenticated
          ? tracksService.getTracks(page, limit)
          : tracksService.getPublicTracks(page, limit);
        const res = await request;
        setTracks(res.data.data.tracks);
        setPaginationInfo(res.data.data.paginationInfo);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError<GetTracksErrorResponse>(err)) {
          const data = err.response?.data;
          setError(data?.message || "Something went wrong");
          if (data?.errors) setValidationErrors(data.errors);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return {
    getTracks,
    loading,
    error,
    validationErrors,
    tracks,
    paginationInfo,
  };
}

export function useGetPostedTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<GetTracksErrorResponse["errors"] | null>(
    null
  );
  const [tracks, setTracks] = useState<GetPostedTracksResponse["data"] | null>(null);
  const lastSnapshotRef = useRef<string>("");
  const isAuthenticated = useTrackAuthState();

  const getPostedTracks = useCallback(
    async (userId: string, options?: { silent?: boolean }) => {
      if (!userId) return;
      const silent = options?.silent === true;
      if (!silent) setLoading(true);
      setError(null);
      setValidationErrors(null);
      try {
        const request = isAuthenticated
          ? tracksService.getPostedTracks(userId)
          : tracksService.getPublicPostedTracks(userId);
        const res = await request;
        const snapshot = JSON.stringify(res.data.data ?? []);
        if (snapshot !== lastSnapshotRef.current) {
          lastSnapshotRef.current = snapshot;
          setTracks(res.data.data);
        }
        return res.data;
      } catch (err) {
        if (axios.isAxiosError<GetTracksErrorResponse>(err)) {
          const data = err.response?.data;
          setError(data?.message || "Something went wrong");
          if (data?.errors) setValidationErrors(data.errors);
        } else {
          setError("Something went wrong");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return {
    getPostedTracks,
    loading,
    error,
    validationErrors,
    tracks,
  };
}

export function useGetLikedTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<GetTracksErrorResponse["errors"] | null>(
    null
  );
  const [tracks, setTracks] = useState<GetLikedTracksResponse["data"] | null>(null);
  const isAuthenticated = useTrackAuthState();

  const getLikedTracks = useCallback(
    async (userId: string) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      setValidationErrors(null);
      setTracks(null);
      try {
        const request = isAuthenticated
          ? tracksService.getLikedTracks(userId)
          : tracksService.getPublicLikedTracks(userId);
        const res = await request;
        setTracks(res.data.data);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError<GetTracksErrorResponse>(err)) {
          const data = err.response?.data;
          setError(data?.message || "Something went wrong");
          if (data?.errors) setValidationErrors(data.errors);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return {
    getLikedTracks,
    loading,
    error,
    validationErrors,
    tracks,
  };
}

export function useGetTrackById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<GetTrackByIdResponse["data"] | null>(null);
  const isAuthenticated = useTrackAuthState();

  const getTrackById = useCallback(
    async (id: string) => {
      if (!id) return;

      setLoading(true);
      setError(null);
      setTrack(null);

      try {
        const request = isAuthenticated
          ? tracksService.getTrackById(id)
          : tracksService.getPublicTrackById(id);
        const res = await request;
        setTrack(res.data.data);
        return res.data;
      } catch (err) {
        setError(getTrackErrorMessage(err, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return {
    getTrackById,
    loading,
    error,
    track,
  };
}

export function useGetTrackDetailed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<GetTrackDetailedResponse["data"] | null>(null);

  const getTrackDetailed = useCallback(async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setTrack(null);

    try {
      const res = await tracksService.getTrackDetailed(id);
      setTrack(res.data.data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Failed to fetch track";
        setError(message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getTrackDetailed,
    loading,
    error,
    track,
  };
}

export function useUpdateTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const updateTrack = useCallback(async (data: UpdateTrackRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await tracksService.UpdateTrack(data);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const status = err.response?.status;
      const message =
        status === 413 ? "Update failed" : err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTrack, loading, error, success };
}

export function useIncrementPlayCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const incrementPlayCount = useCallback(async (data: incrementPlayCountRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await tracksService.incrementPlayCount(data);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to increment play count");
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { incrementPlayCount, loading, error, success };
}

export function useDeleteTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const deleteTrack = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await tracksService.deleteTrack(id);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete track.");
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTrack, loading, error, success };
}

export function useGetUploadQuota() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<number | null>(null);

  const getUploadQuota = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tracksService.getUploadQuota();
      setQuota(res.data.data.quota);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError<GetUploadQuotaResponse>(err)) {
        setError(err.response?.data?.message || "Failed to fetch upload quota");
      } else {
        setError("Failed to fetch upload quota");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getUploadQuota, loading, error, quota };
}

export function useGetTrackPlaylists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<TrackPlaylist[]>([]);
  const isAuthenticated = useTrackAuthState();

  const getTrackPlaylists = useCallback(
    async (trackId: string) => {
      if (!trackId) return;
      setLoading(true);
      setError(null);
      try {
        const request = isAuthenticated
          ? tracksService.getTrackPlaylists(trackId)
          : tracksService.getPublicTrackPlaylists(trackId);
        const res = await request;
        setPlaylists(res.data.data);
        return res.data;
      } catch (err) {
        setError(getTrackErrorMessage(err, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getTrackPlaylists, loading, error, playlists };
}

export function useGetTrackAlbums() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [albums, setAlbums] = useState<TrackPlaylist[]>([]);
  const isAuthenticated = useTrackAuthState();

  const getTrackAlbums = useCallback(
    async (trackId: string) => {
      if (!trackId) return;
      setLoading(true);
      setError(null);
      try {
        const request = isAuthenticated
          ? tracksService.getTrackAlbums(trackId)
          : tracksService.getPublicTrackAlbums(trackId);
        const res = await request;
        setAlbums(res.data.data);
        return res.data;
      } catch (err) {
        setError(getTrackErrorMessage(err, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getTrackAlbums, loading, error, albums };
}

export function useGetTrackByPermalink() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<GetTrackByIdResponse["data"] | null>(null);
  const isAuthenticated = useTrackAuthState();

  const getTrackByPermalink = useCallback(
    async (profileLink: string, permalink: string) => {
      if (!profileLink || !permalink) return;

      setLoading(true);
      setError(null);
      setTrack(null);

      try {
        const request = isAuthenticated
          ? tracksService.getTrackByPermalink(profileLink, permalink)
          : tracksService.getPublicTrackByPermalink(profileLink, permalink);
        const res = await request;
        setTrack(res.data.data);
        return res.data;
      } catch (err) {
        setError(getTrackErrorMessage(err, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getTrackByPermalink, loading, error, track };
}

export function useCheckTrackPermalinkValidity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFound, setIsFound] = useState<boolean | null>(null);

  const checkTrackPermalinkValidity = useCallback(async (permalink: string) => {
    if (!permalink) return;

    setLoading(true);
    setError(null);
    setIsFound(null);

    try {
      const res = await tracksService.checkTrackPermalinkValidity(permalink);
      setIsFound(res.data.data.isFound);
      return res.data;
    } catch (err) {
      setError(getTrackErrorMessage(err, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkTrackPermalinkValidity, loading, error, isFound };
}

export function useGetTrackStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topFans, setTopFans] = useState<TrackFan[]>([]);
  const [firstFans, setFirstFans] = useState<TrackFan[]>([]);
  const isAuthenticated = useTrackAuthState();

  const getTrackStats = useCallback(
    async (trackId: string) => {
      if (!trackId) return;
      setLoading(true);
      setError(null);
      try {
        const request = isAuthenticated
          ? tracksService.getTrackStats(trackId)
          : tracksService.getPublicTrackStats(trackId);
        const res = await request;
        setTopFans(res.data.data.topFans);
        setFirstFans(res.data.data.firstFans);
        return res.data;
      } catch (err) {
        setError(getTrackErrorMessage(err, "Failed to fetch track stats"));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getTrackStats, loading, error, topFans, firstFans };
}

export function useGetRepostedTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<GetRepostedTracksResponse["tracks"]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(20);

  const getRepostedTracks = useCallback(async (userId: string, offset = 1, limit = 20) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await tracksService.getRepostedTracks(userId, offset, limit);
      setTracks(res.data.tracks ?? []);
      setTotal(res.data.total ?? 0);
      setOffset(res.data.offset ?? offset);
      setLimit(res.data.limit ?? limit);
      return res.data;
    } catch (err) {
      setError(getTrackErrorMessage(err, "Failed to fetch reposted tracks"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { getRepostedTracks, loading, error, tracks, total, offset, limit };
}
