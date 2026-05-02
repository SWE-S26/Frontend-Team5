import { http, HttpResponse } from "msw"
import {
  MOCK_TRACKS,
  getTrackOrDefault,
  mockTrackPlaylistAlbum,
  MOCK_PROFILE_LINK,
} from "@/mocks/data/fixtures"
import type { TrackDetailed } from "@/types/tracks.types"

function listPayload(url: URL) {
  const page = Number(url.searchParams.get("page") ?? 1)
  const limit = Number(url.searchParams.get("limit") ?? 20)
  const totalNumTracks = MOCK_TRACKS.length
  const totalPages = Math.max(1, Math.ceil(totalNumTracks / limit))
  return {
    message: "Tracks retrieved",
    data: {
      tracks: MOCK_TRACKS,
      paginationInfo: {
        totalNumTracks,
        page,
        totalPages,
        hasNext: page < totalPages,
      },
    },
  }
}

function trackData(trackId: string) {
  return {
    message: "Track retrieved",
    data: getTrackOrDefault(trackId),
  }
}

function detailed(trackId: string): TrackDetailed {
  const t = getTrackOrDefault(trackId)
  return {
    id: trackId,
    basicInfo: t.basicInfo,
    permissions: t.permissions,
    license: t.license,
    advanced: {
      recordLabel: "Mock Label",
      releaseDate: t.releaseDate,
    },
    geoBlocking: t.geoBlocking ?? {
      mode: "worldwide" as const,
      regions: [],
      countries: [],
    },
  }
}

const trackListGet = ({ request }: { request: Request }) =>
  HttpResponse.json(listPayload(new URL(request.url)))

const trackByIdGet = ({ params }: { params: { id: string } }) =>
  HttpResponse.json(trackData(params.id))

const trackPermalinkGet = ({ params }: { params: { profileLink: string; permalink: string } }) => {
  const t =
    MOCK_TRACKS.find(
      (x) =>
        x.basicInfo.permalink === params.permalink &&
        MOCK_PROFILE_LINK === params.profileLink,
    ) ?? MOCK_TRACKS[0]
  return HttpResponse.json({
    message: "ok",
    data: { ...t, basicInfo: { ...t.basicInfo, permalink: params.permalink } },
  })
}

export const tracksHandlers = [
  http.get("/api/tracks/v2/permalink/:profileLink/:permalink", trackPermalinkGet),
  http.get("/api/public/tracks/v2/permalink/:profileLink/:permalink", trackPermalinkGet),

  http.get("/api/tracks/v2/detailed/:id", ({ params }) =>
    HttpResponse.json({
      message: "ok",
      data: detailed(params.id as string),
    }),
  ),

  http.get("/api/tracks/v2/posted/:userId", () =>
    HttpResponse.json({
      message: "ok",
      data: MOCK_TRACKS,
    }),
  ),
  http.get("/api/public/tracks/v2/posted/:userId", () =>
    HttpResponse.json({
      message: "ok",
      data: MOCK_TRACKS,
    }),
  ),

  http.get("/api/tracks/v2/liked/:userId", () =>
    HttpResponse.json({
      message: "ok",
      data: MOCK_TRACKS,
    }),
  ),
  http.get("/api/public/tracks/v2/liked/:userId", () =>
    HttpResponse.json({
      message: "ok",
      data: MOCK_TRACKS,
    }),
  ),

  http.get("/api/tracks/v2/stats/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: {
        topFans: [],
        firstFans: [],
      },
    }),
  ),
  http.get("/api/public/tracks/v2/stats/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: {
        topFans: [],
        firstFans: [],
      },
    }),
  ),

  http.get("/api/tracks/v2/albums/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: [mockTrackPlaylistAlbum("album-mock-1", "Mock Album")],
    }),
  ),
  http.get("/api/public/tracks/v1/albums/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: [mockTrackPlaylistAlbum("album-mock-1", "Mock Album")],
    }),
  ),

  http.get("/api/tracks/v2", trackListGet),
  http.get("/api/public/tracks/v2", trackListGet),

  http.get("/api/tracks/v2/:id", trackByIdGet),
  http.get("/api/public/tracks/v2/:id", trackByIdGet),

  http.post("/api/tracks/v2", async ({ request }) => {
    await request.formData()
    return HttpResponse.json(
      {
        message: "Track created",
        data: { id: "track-mock-new" },
      },
      { status: 201 },
    )
  }),

  http.patch("/api/tracks/v2", async ({ request }) => {
    await request.formData()
    return HttpResponse.json({
      message: "Track updated",
      data: MOCK_TRACKS[0].trackId,
    })
  }),

  http.patch("/api/tracks/v2/listen", async () =>
    HttpResponse.json({ message: "Play recorded" }),
  ),

  http.patch("/api/tracks/v2/download", async () =>
    HttpResponse.json({ message: "Download counted" }),
  ),

  http.post("/api/tracks/v1/played/:id", () =>
    HttpResponse.json({ message: "Added to history" }),
  ),

  http.delete("/api/tracks/v1/:id", () =>
    HttpResponse.json({ message: "Track deleted" }),
  ),

  http.get("/api/tracks/v1/quota", () =>
    HttpResponse.json({
      message: "ok",
      data: { quota: 3600 },
    }),
  ),

  http.get("/api/tracks/v1/permalink/valid/:permalink", ({ params }) =>
    HttpResponse.json({
      message: "ok",
      data: { isFound: params.permalink !== "taken" },
    }),
  ),

  http.get("/api/tracks/v1/playlists/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: [mockTrackPlaylistAlbum("pl-from-track", "Related Playlist")],
    }),
  ),
  http.get("/api/public/tracks/v1/playlists/:trackId", () =>
    HttpResponse.json({
      message: "ok",
      data: [mockTrackPlaylistAlbum("pl-from-track", "Related Playlist")],
    }),
  ),
]
