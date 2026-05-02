// src/mocks/handlers/admin/adminTracksHandlers.ts

import { http, HttpResponse } from "msw";
import { AdminTrack, AdminTracksResponse } from "@/types/admin-dash/adminTracks.types";

const mockTracks: AdminTrack[] = [
  {
    id: "trk_001",
    title: "Summer Vibes",
    artistName: "DJ Vibes",
    type: "track",
    numberOfPlays: 12500,
    numberOfLikes: 340,
    banned: false,
    createdAt: "2025-05-10T09:00:00Z",
  },
  {
    id: "trk_002",
    title: "Best of 2024",
    artistName: "John Doe",
    type: "playlist",
    numberOfPlays: 5600,
    numberOfLikes: 120,
    banned: false,
    createdAt: "2025-06-01T09:00:00Z",
  },
  {
    id: "trk_003",
    title: "Midnight Beats",
    artistName: "Jane Smith",
    type: "track",
    numberOfPlays: 87000,
    numberOfLikes: 2100,
    banned: false,
    createdAt: "2025-03-15T09:00:00Z",
  },
  {
    id: "trk_004",
    title: "Explicit Content",
    artistName: "Bad Actor",
    type: "track",
    numberOfPlays: 200,
    numberOfLikes: 3,
    banned: true,
    createdAt: "2025-05-28T09:00:00Z",
  },
  {
    id: "trk_005",
    title: "Chill Mix Vol.1",
    artistName: "Music Lover",
    type: "playlist",
    numberOfPlays: 3400,
    numberOfLikes: 89,
    banned: false,
    createdAt: "2025-04-22T09:00:00Z",
  },
  {
    id: "trk_006",
    title: "Stolen Track",
    artistName: "Spam User",
    type: "track",
    numberOfPlays: 100,
    numberOfLikes: 0,
    banned: true,
    createdAt: "2025-05-30T09:00:00Z",
  },
];

export const adminTracksHandlers = [
  // GET /api/admin/v1/media
  http.get("/api/admin/v1/media", ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const query = url.searchParams.get("query")?.toLowerCase();

    let filtered = [...mockTracks];

    if (query) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artistName.toLowerCase().includes(query)
      );
    }

    const total = filtered.length;
    const start = (offset - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: AdminTracksResponse = {
      total,
      offset,
      limit,
      items: paginated,
    };

    return HttpResponse.json(response);
  }),

  // PATCH /api/admin/v1/tracks/:trackId/ban
  http.patch("/api/admin/v1/tracks/:trackId/ban", ({ params }) => {
    const { trackId } = params;
    const track = mockTracks.find((t) => t.id === trackId);

    if (!track) {
      return HttpResponse.json(
        { message: "Property not found or not updated" },
        { status: 404 }
      );
    }

    track.banned = true;

    return HttpResponse.json(track);
  }),

  // PATCH /api/admin/v1/tracks/:trackId/unban
  http.patch("/api/admin/v1/tracks/:trackId/unban", ({ params }) => {
    const { trackId } = params;
    const track = mockTracks.find((t) => t.id === trackId);

    if (!track) {
      return HttpResponse.json(
        { message: "Property not found or not updated" },
        { status: 404 }
      );
    }

    track.banned = false;

    return HttpResponse.json(track);
  }),

  // DELETE /api/admin/v1/tracks/:trackId
  http.delete("/api/admin/v1/tracks/:trackId", ({ params }) => {
    const { trackId } = params;
    const index = mockTracks.findIndex((t) => t.id === trackId);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Property not found or not updated" },
        { status: 404 }
      );
    }

    mockTracks.splice(index, 1);

    return HttpResponse.json({ message: "Track permanently deleted." });
  }),
];