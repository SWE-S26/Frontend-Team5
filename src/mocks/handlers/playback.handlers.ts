import { http, HttpResponse } from "msw"
import { MOCK_TRACKS, mockHistoryPlaylistFromDetail, MOCK_PLAYLIST_DETAIL } from "@/mocks/data/fixtures"

export const playbackHandlers = [
  http.get("/api/playback/v1/history/tracks", () =>
    HttpResponse.json({
      message: "ok",
      data: MOCK_TRACKS,
    }),
  ),

  http.get("/api/playback/v1/history/playlists", () =>
    HttpResponse.json({
      message: "ok",
      data: [mockHistoryPlaylistFromDetail(MOCK_PLAYLIST_DETAIL)],
    }),
  ),

  http.delete("/api/playback/v1/history/", () =>
    HttpResponse.json({
      message: "History cleared",
    }),
  ),
]
