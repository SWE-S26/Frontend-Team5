import { http, HttpResponse } from "msw";
import { MOCK_PLAYLIST_DETAIL, toPlaylistSummary, MOCK_PROFILE_LINK } from "@/mocks/data/fixtures";

const mockCreator = {
  displayName: "Mock Artist",
  profileLink: MOCK_PROFILE_LINK,
  profileImage: {
    imgLink: "https://picsum.photos/200",
    publicId: "p/1",
  },
  followersCount: 120,
  isFollowed: false,
};

const playlistsArray = () => [toPlaylistSummary(MOCK_PLAYLIST_DETAIL)];

export const playlistsHandlers = [
  http.post("/api/playlists/v1", async ({ request }) => {
    await request.json().catch(() => ({}));
    return HttpResponse.json(
      {
        message: "Playlist created",
        data: { playlists: playlistsArray() },
      },
      { status: 201 }
    );
  }),

  http.post("/api/playlists/v1/with-image", async ({ request }) => {
    await request.formData();
    return HttpResponse.json(
      {
        message: "Playlist created",
        data: { playlists: playlistsArray() },
      },
      { status: 201 }
    );
  }),

  http.get("/api/playlists/v1/my-playlists", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/playlists/v1", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/public/playlists/v1", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/public/playlists/v1/playlists/:artistId", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/public/playlists/v1/creator/:artistId/albums", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/public/playlists/v1/creator/:artistId", () =>
    HttpResponse.json({
      message: "ok",
      data: { artist: mockCreator },
    })
  ),

  http.get("/api/public/playlists/v1/:playlistId/recommend/:artistId", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/public/playlists/v1/permalink/:permalink", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: [MOCK_PLAYLIST_DETAIL] },
    })
  ),

  http.get("/api/public/playlists/v2/permalink/:profileLink/:permalink", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlist: MOCK_PLAYLIST_DETAIL },
    })
  ),

  http.get("/api/playlists/v1/playlists/:artistId", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/playlists/v1/creator/:creatorId", () =>
    HttpResponse.json({
      message: "ok",
      data: { artist: mockCreator },
    })
  ),

  http.get("/api/playlists/v1/:playlistId/recommend/:creatorId", () =>
    HttpResponse.json({
      message: "ok",
      data: { playlists: playlistsArray() },
    })
  ),

  http.get("/api/playlists/v1/:playlistId", ({ params }) =>
    HttpResponse.json({
      message: "ok",
      data: {
        playlist: {
          ...MOCK_PLAYLIST_DETAIL,
          _id: params.playlistId as string,
        },
      },
    })
  ),

  http.get("/api/public/playlists/v1/:playlistId", ({ params }) =>
    HttpResponse.json({
      message: "ok",
      data: {
        playlist: {
          ...MOCK_PLAYLIST_DETAIL,
          _id: params.playlistId as string,
        },
      },
    })
  ),

  http.put("/api/playlists/v1/:playlistId", async ({ request }) => {
    await request.formData();
    return HttpResponse.json({ message: "Playlist updated" });
  }),

  http.delete("/api/playlists/v1/:playlistId", () =>
    HttpResponse.json({
      message: "Deleted",
      data: { deleted: true },
    })
  ),

  http.patch("/api/playlists/v1/:playlistId/tracks/:trackId", () =>
    HttpResponse.json({ message: "Track added" })
  ),

  http.delete("/api/playlists/v1/:playlistId/tracks/:trackId", () =>
    HttpResponse.json({ message: "Track removed" })
  ),

  http.patch("/api/playlists/v1/:playlistId/image", async ({ request }) => {
    await request.formData();
    return HttpResponse.json({
      message: "ok",
      data: { playlist: toPlaylistSummary(MOCK_PLAYLIST_DETAIL) },
    });
  }),

  http.patch("/api/playlists/v1/:playlistId/tracks/order", async () =>
    HttpResponse.json({ message: "Order updated" })
  ),

  http.post("/api/v1/playlists/:playlistId/history", () =>
    HttpResponse.json({ message: "Playlist play recorded" })
  ),
];
