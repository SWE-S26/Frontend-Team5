import { http, HttpResponse } from "msw"
import type { TrackComment } from "@/types/comments.types"
import { MOCK_TRACKS, toPlaylistSummary, MOCK_PLAYLIST_DETAIL } from "@/mocks/data/fixtures"

const mockLikeUser = {
  userId: "mock-fan-001",
  displayName: "Fan One",
  avatarUrl: "https://picsum.photos/seed/fan1/100",
  followersCount: 42,
}

let trackLiked = false
let playlistLiked = false

const mockComment = (trackId: string): TrackComment => ({
  commentId: "comment-mock-1",
  userId: "mock-fan-001",
  displayName: "Fan One",
  avatarUrl: "https://picsum.photos/seed/fan1/100",
  content: "Great track!",
  timestamp: Date.now(),
  numLikes: 2,
  replyCount: 0,
  isLikedByUser: false,
  isOwnComment: false,
  createdAt: new Date().toISOString(),
})

export const engagementHandlers = [
  http.post("/api/engagement/tracks/v1/:trackId/like", () => {
    trackLiked = true
    return HttpResponse.json({ liked: true, numOfLikes: 11 })
  }),

  http.get("/api/engagement/tracks/v1/:trackId/like", () =>
    HttpResponse.json({ liked: trackLiked }),
  ),

  http.post("/api/engagement/playlists/v1/:playlistId/like", () => {
    playlistLiked = true
    return HttpResponse.json({ ok: true })
  }),

  http.get("/api/public/engagement/tracks/v1/:trackId/likes", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 20,
      users: [mockLikeUser],
    }),
  ),

  http.get("/api/public/engagement/playlists/v1/:playlistId/likes", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 20,
      users: [mockLikeUser],
    }),
  ),

  http.get("/api/public/engagement/tracks/v1/:trackId/comments", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 50,
      comments: [mockComment("t1")],
    }),
  ),

  http.get("/api/public/engagement/comments/v1/:commentId/replies", () =>
    HttpResponse.json({
      total: 0,
      offset: 1,
      limit: 20,
      replies: [],
    }),
  ),

  http.post("/api/engagement/tracks/v1/:trackId/comments", async ({ request, params }) => {
    const body = (await request.json().catch(() => ({}))) as { content?: string }
    return HttpResponse.json({
      ...mockComment(params.trackId as string),
      content: body.content ?? "Nice!",
      commentId: `comment-${Date.now()}`,
    })
  }),

  http.post("/api/engagement/comments/v1/:commentId/like", () =>
    HttpResponse.json({ liked: true, numLikes: 3 }),
  ),

  http.delete("/api/engagement/comments/v1/:commentId", () =>
    HttpResponse.json(null, { status: 204 }),
  ),

  http.get("/api/engagement/mentions/v1/followers", () =>
    HttpResponse.json([
      {
        userId: "mock-fan-002",
        displayName: "Fan Two",
        avatarUrl: "https://picsum.photos/seed/fan2/100",
        profileLink: "fan-two",
      },
    ]),
  ),

  http.post("/api/engagement/tracks/v1/:trackId/repost", async () =>
    HttpResponse.json({ reposted: true, numberOfReposts: 3 }),
  ),

  http.get("/api/engagement/tracks/v1/:trackId/repost", () =>
    HttpResponse.json({
      reposted: false,
      caption: null,
      repostedAt: null,
    }),
  ),

  http.patch("/api/engagement/tracks/v1/:trackId/repost", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { caption?: string }
    return HttpResponse.json({
      success: true,
      caption: body.caption ?? "",
    })
  }),

  http.post("/api/engagement/playlists/v1/:playlistId/repost", async () =>
    HttpResponse.json({ reposted: true, numberOfReposts: 2 }),
  ),

  http.get("/api/public/engagement/tracks/v1/:trackId/reposts", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 20,
      users: [mockLikeUser],
    }),
  ),

  http.get("/api/public/engagement/playlists/v1/:playlistId/reposts", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 20,
      users: [mockLikeUser],
    }),
  ),

  http.get("/api/public/engagement/tracks/v1/users/:userId/reposted", () =>
    HttpResponse.json({
      total: MOCK_TRACKS.length,
      offset: 1,
      limit: 20,
      tracks: MOCK_TRACKS,
    }),
  ),

  http.get("/api/public/engagement/playlists/v1/users/:userId/reposted", () =>
    HttpResponse.json({
      total: 1,
      offset: 1,
      limit: 20,
      playlists: [toPlaylistSummary(MOCK_PLAYLIST_DETAIL)],
    }),
  ),
]
