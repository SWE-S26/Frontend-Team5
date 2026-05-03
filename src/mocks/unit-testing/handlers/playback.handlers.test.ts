import { createTestServer, testUrl } from "../helpers/mswServer";
import { playbackHandlers } from "@/mocks/handlers/playback.handlers";

const server = createTestServer(...playbackHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("playback.handlers", () => {
  it("GET /api/playback/v1/history/tracks", async () => {
    const res = await fetch(testUrl("/api/playback/v1/history/tracks"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("GET /api/playback/v1/history/playlists", async () => {
    const res = await fetch(testUrl("/api/playback/v1/history/playlists"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("DELETE /api/playback/v1/history/", async () => {
    const res = await fetch(testUrl("/api/playback/v1/history/"), {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBeDefined();
  });
});
