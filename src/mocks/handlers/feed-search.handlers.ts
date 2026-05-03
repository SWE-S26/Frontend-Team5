import { http, HttpResponse } from "msw";
import { MOCK_TRACKS, MOCK_PLAYLIST_DETAIL, POSTER_ID } from "@/mocks/data/fixtures";
import type { FeedItem } from "@/types/feed.types";

let searchHistory: { id: string; type: string; title?: string }[] = [
  { id: "track-mock-001", type: "track", title: "Summer Vibes" },
];

function searchPayload() {
  return {
    counts: {
      tracks: MOCK_TRACKS.length,
      users: 1,
      playlists: 1,
      albums: 0,
    },
    results: [
      ...MOCK_TRACKS.map((t) => ({
        id: t.trackId!,
        type: "track",
        title: t.basicInfo.title,
      })),
      {
        id: POSTER_ID,
        type: "user",
        userId: POSTER_ID,
        displayName: "Omar Mahmoud",
        profileImgLink: "https://picsum.photos/200",
        followersCount: 120,
        trackCount: 15,
        isFollowed: false,
      },
      {
        id: MOCK_PLAYLIST_DETAIL._id,
        type: "playlist",
        title: MOCK_PLAYLIST_DETAIL.title,
      },
    ],
  };
}

function suggestionsPayload(q: string) {
  const ql = q.toLowerCase();
  return [
    {
      id: "track-mock-001",
      type: "track",
      title: MOCK_TRACKS[0].basicInfo.title,
    },
    {
      id: "track-mock-002",
      type: "track",
      title: MOCK_TRACKS[1].basicInfo.title,
    },
  ].filter((s) => s.title.toLowerCase().includes(ql) || ql.length < 2);
}

const feedItems: FeedItem[] = MOCK_TRACKS.map((t) => ({
  id: t.trackId!,
  type: "track",
  isRepost: false,
  createdAt: t.releaseDate,
  actorId: POSTER_ID,
  displayName: "Omar Mahmoud",
  imgLink: t.image.imgLink,
}));

export const feedSearchHandlers = [
  http.get("/api/feed/v1/feed", () => HttpResponse.json(feedItems)),

  http.get("/api/feed/v1/search", () => HttpResponse.json(searchPayload())),
  http.get("/api/public/feed/v1/search", () => HttpResponse.json(searchPayload())),

  http.get("/api/feed/v1/search/suggestions", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return HttpResponse.json(suggestionsPayload(q));
  }),
  http.get("/api/public/feed/v1/search/suggestions", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return HttpResponse.json(suggestionsPayload(q));
  }),

  http.get("/api/feed/v1/search/history", () => HttpResponse.json(searchHistory)),

  http.post("/api/feed/v1/search/add-to-history", async ({ request }) => {
    const body = (await request.json().catch(() => null)) as { id: string; type: string } | null;
    if (body?.id && body?.type) {
      searchHistory = [
        { id: body.id, type: body.type },
        ...searchHistory.filter((h) => h.id !== body.id),
      ];
    }
    return HttpResponse.json({ message: "saved" });
  }),

  http.delete("/api/feed/v1/search/history/:historyId", ({ params }) => {
    searchHistory = searchHistory.filter((h) => h.id !== params.historyId);
    return HttpResponse.json({ message: "removed" });
  }),
];
