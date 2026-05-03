import { createTestServer, testUrl } from "../helpers/mswServer";
import { playlistsHandlers } from "@/mocks/handlers/playlists.handlers";

const server = createTestServer(...playlistsHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("playlists.handlers", () => {
  it("GET /api/playlists/v1 returns playlists", async () => {
    const res = await fetch(testUrl("/api/playlists/v1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.playlists.length).toBeGreaterThan(0);
  });

  it("GET /api/playlists/v1/my-playlists", async () => {
    const res = await fetch(testUrl("/api/playlists/v1/my-playlists"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.playlists).toBeDefined();
  });

  it("GET /api/playlists/v1/:playlistId returns detail", async () => {
    const res = await fetch(testUrl("/api/playlists/v1/playlist-mock-001"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.playlist._id).toBe("playlist-mock-001");
  });

  it("GET /api/public/playlists/v2/permalink/:profile/:permalink", async () => {
    const res = await fetch(
      testUrl("/api/public/playlists/v2/permalink/omds2005-1774126647643/mock-playlist-one")
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.playlist).toBeDefined();
  });

  it("POST /api/v1/playlists/:id/history", async () => {
    const res = await fetch(testUrl("/api/v1/playlists/playlist-mock-001/history"), {
      method: "POST",
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/playlists/v1 creates playlist", async () => {
    const res = await fetch(testUrl("/api/playlists/v1"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistName: "X", tracks: [], isPrivate: false }),
    });
    expect(res.status).toBe(201);
  });

  it("DELETE /api/playlists/v1/:playlistId", async () => {
    const res = await fetch(testUrl("/api/playlists/v1/playlist-mock-001"), {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.deleted).toBe(true);
  });
});
