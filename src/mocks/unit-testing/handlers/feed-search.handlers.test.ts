import { createTestServer, testUrl } from "../helpers/mswServer";
import { feedSearchHandlers } from "@/mocks/handlers/feed-search.handlers";

const server = createTestServer(...feedSearchHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("feed-search.handlers", () => {
  it("GET /api/feed/v1/feed returns feed items", async () => {
    const res = await fetch(testUrl("/api/feed/v1/feed?offset=0&limit=20&includeReposts=true"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].type).toBe("track");
  });

  it("GET /api/feed/v1/search returns counts and results", async () => {
    const res = await fetch(testUrl("/api/feed/v1/search?q=test"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.counts).toBeDefined();
    expect(Array.isArray(json.results)).toBe(true);
  });

  it("GET /api/public/feed/v1/search", async () => {
    const res = await fetch(testUrl("/api/public/feed/v1/search?q=beat"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results.length).toBeGreaterThan(0);
  });

  it("GET /api/feed/v1/search/suggestions", async () => {
    const res = await fetch(testUrl("/api/feed/v1/search/suggestions?q=sum"));
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
  });

  it("GET /api/feed/v1/search/history", async () => {
    const res = await fetch(testUrl("/api/feed/v1/search/history"));
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
  });

  it("POST /api/feed/v1/search/add-to-history", async () => {
    const res = await fetch(testUrl("/api/feed/v1/search/add-to-history"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "track-mock-002", type: "track" }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /api/feed/v1/search/history/:historyId", async () => {
    const res = await fetch(testUrl("/api/feed/v1/search/history/track-mock-001"), {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
  });
});
