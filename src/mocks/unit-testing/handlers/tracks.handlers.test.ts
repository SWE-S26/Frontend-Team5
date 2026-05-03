import { createTestServer, testUrl } from "../helpers/mswServer";
import { tracksHandlers } from "@/mocks/handlers/tracks.handlers";

const server = createTestServer(...tracksHandlers);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("tracks.handlers", () => {
  it("GET /api/tracks/v2 returns paginated tracks", async () => {
    const res = await fetch(testUrl("/api/tracks/v2?page=1&limit=10"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBeDefined();
    expect(Array.isArray(json.data.tracks)).toBe(true);
    expect(json.data.paginationInfo.page).toBe(1);
  });

  it("GET /api/public/tracks/v2 mirrors auth list", async () => {
    const res = await fetch(testUrl("/api/public/tracks/v2"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.tracks.length).toBeGreaterThan(0);
  });

  it("GET /api/tracks/v2/:id returns track data", async () => {
    const res = await fetch(testUrl("/api/tracks/v2/track-mock-001"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.trackId ?? json.data.basicInfo).toBeDefined();
  });

  it("GET /api/tracks/v2/detailed/:id returns detailed shape", async () => {
    const res = await fetch(testUrl("/api/tracks/v2/detailed/track-mock-001"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.id).toBe("track-mock-001");
    expect(json.data.basicInfo).toBeDefined();
  });

  it("GET permalink resolves track", async () => {
    const res = await fetch(
      testUrl(`/api/tracks/v2/permalink/omds2005-1774126647643/summer-vibes`)
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.basicInfo.permalink).toBe("summer-vibes");
  });

  it("POST /api/tracks/v1/played/:id", async () => {
    const res = await fetch(testUrl("/api/tracks/v1/played/track-mock-001"), {
      method: "POST",
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBeDefined();
  });

  it("GET /api/tracks/v1/quota", async () => {
    const res = await fetch(testUrl("/api/tracks/v1/quota"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.quota).toBe(3600);
  });

  it("PATCH /api/tracks/v2/listen", async () => {
    const res = await fetch(testUrl("/api/tracks/v2/listen"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: "track-mock-001",
        listenedDuration: 10,
        sessionIdPlay: "sess-1",
      }),
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/tracks/v2 accepts multipart", async () => {
    const fd = new FormData();
    fd.append("audio", new Blob(["x"], { type: "audio/mpeg" }), "t.mp3");
    fd.append(
      "basicInfo",
      JSON.stringify({ title: "T", permalink: "t", mainArtists: [], isPrivate: false })
    );
    const res = await fetch(testUrl("/api/tracks/v2"), { method: "POST", body: fd });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.id).toBeDefined();
  });
});
