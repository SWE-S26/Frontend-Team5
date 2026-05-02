import { http, HttpResponse } from "msw"
import type { ArtistAnalyticsResponse } from "@/types/artist.types"

const mockAnalytics: ArtistAnalyticsResponse = {
  totalPlays: 12500,
  totalReposts: 340,
  totalDownloads: 890,
  totalLikes: 2100,
  totalComments: 156,
  totalplayrate: 72.5,
}

export const adminArtistAnalyticsHandlers = [
  http.get("/api/admin/v1/artist-analytics/me", () =>
    HttpResponse.json(mockAnalytics),
  ),
]
