import api from "@/lib/api";

import { ArtistAnalyticsResponse } from "@/types/artist.types";

export const artistService = {
    getArtistAnalytics: () => api.get<ArtistAnalyticsResponse>("/api/admin/v1/artist-analytics/me")
}