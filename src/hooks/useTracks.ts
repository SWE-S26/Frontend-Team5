import axios from "axios";
import { tracksService } from "@/services/tracks.service";
import { useCallback, useRef, useState } from "react";
import { CreateTrackRequest } from "@/types/tracks.types";
import {
  GetPostedTracksResponse,
  GetTracksErrorResponse,
  GetUploadQuotaResponse,
  GetTracksResponse,
  GetLikedTracksResponse,
  UpdateTrackRequest,
  GetTrackDetailedResponse,
} from "@/types/tracks.types";
import { GetTrackByIdResponse } from "@/types/tracks.types";


export function useCreateTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const createTrack = useCallback(
    async (
      data: CreateTrackRequest,
      onUploadProgress?: (progress: number) => void,
    ) => {
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
    [],
  );

  return { createTrack, loading, error, success };
}

export function useGetTracks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    GetTracksErrorResponse["errors"] | null
  >(null);
  const [tracks, setTracks] = useState<
    GetTracksResponse["data"]["tracks"] | null
  >(null);
  const [paginationInfo, setPaginationInfo] = useState<
    GetTracksResponse["data"]["paginationInfo"] | null
  >(null);

  const getTracks = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    setValidationErrors(null);
    setTracks(null);
    setPaginationInfo(null);
    try {
      const res = await tracksService.getTracks(page, limit);
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
  }, []);

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
  const [validationErrors, setValidationErrors] = useState<
    GetTracksErrorResponse["errors"] | null
  >(null);
  const [tracks, setTracks] = useState<GetPostedTracksResponse["data"] | null>(
    null,
  );
  const lastSnapshotRef = useRef<string>("");

  const getPostedTracks = useCallback(async (userId: string, options?: { silent?: boolean }) => {
    if (!userId) return;
    const silent = options?.silent === true;
    if (!silent) setLoading(true);
    setError(null);
    setValidationErrors(null);
    try {
      const res = await tracksService.getPostedTracks(userId);
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
  }, []);

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
  const [validationErrors, setValidationErrors] = useState<
    GetTracksErrorResponse["errors"] | null
  >(null);
  const [tracks, setTracks] = useState<GetLikedTracksResponse["data"] | null>(
    null,
  );

  const getLikedTracks = useCallback(async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    setValidationErrors(null);
    setTracks(null);
    try {
      const res = await tracksService.getLikedTracks(userId);
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
  }, []);

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

  const getTrackById = useCallback(async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setTrack(null);

    try {
      const res = await tracksService.getTrackById(id);
      setTrack(res.data.data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Failed to fetch track";
        setError(message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
        const message =
          err.response?.data?.message || "Failed to fetch track";
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

  const updateTrack = useCallback(
    async (
      data: UpdateTrackRequest
    ) => {
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
          status === 413
            ? "Update failed"
            : err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateTrack, loading, error, success };
}

export function useIncrementPlayCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const incrementPlayCount = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await tracksService.incrementPlayCount(id);
        setSuccess(true);
        return res.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to increment play count");
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { incrementPlayCount, loading, error, success };
}

export function useDeleteTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const deleteTrack = useCallback(
    async (id: string) => {
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
    },
    [],
  );

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
