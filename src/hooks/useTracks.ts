import axios from "axios";
import { tracksService } from "@/services/tracks.service";
import { useCallback, useState } from "react";
import { CreateTrackRequest } from "@/types/tracks.types";
import {
  GetPostedTracksResponse,
  GetTracksErrorResponse,
  GetTracksResponse,
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

  const getPostedTracks = useCallback(async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    setValidationErrors(null);
    setTracks(null);
    try {
      const res = await tracksService.getPostedTracks(userId);
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
    getPostedTracks,
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