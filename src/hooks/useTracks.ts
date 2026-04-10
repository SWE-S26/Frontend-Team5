import axios from "axios";
import { tracksService } from "@/services/tracks.service";
import {
  GetTracksErrorResponse,
  GetTracksResponse,
} from "@/types/tracks.types";
import { useCallback, useState } from "react";

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
