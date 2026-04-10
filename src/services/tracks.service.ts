import api from "@/lib/api";
import { GetTracksResponse } from "@/types/tracks.types";

export const tracksService = {
  /* (1) */
  getTracks: (page: number, limit: number) =>
    api.get<GetTracksResponse>(
      `/api/public/tracks/v1/?page=${page}&limit=${limit}`,
    ),
};
