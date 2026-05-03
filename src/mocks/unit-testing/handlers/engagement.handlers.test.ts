import { createTestServer, testUrl } from "../helpers/mswServer";
import { engagementHandlers } from "@/mocks/handlers/engagement.handlers";

const server = createTestServer(...engagementHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("engagement.handlers", () => {
  it("POST like track", async () => {
    const res = await fetch(testUrl("/api/engagement/tracks/v1/track-mock-001/like"), {
      method: "POST",
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.liked).toBe(true);
  });

  it("GET like status", async () => {
    const res = await fetch(testUrl("/api/engagement/tracks/v1/track-mock-001/like"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.liked).toBe("boolean");
  });

  it("GET public track likes list", async () => {
    const res = await fetch(testUrl("/api/public/engagement/tracks/v1/track-mock-001/likes"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.users).toBeDefined();
  });

  it("GET track comments", async () => {
    const res = await fetch(
      testUrl("/api/public/engagement/tracks/v1/track-mock-001/comments?offset=1&limit=50")
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.comments.length).toBeGreaterThan(0);
  });

  it("POST comment", async () => {
    const res = await fetch(testUrl("/api/engagement/tracks/v1/track-mock-001/comments"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Nice", timestamp: Date.now() }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.content).toBe("Nice");
  });

  it("POST track repost", async () => {
    const res = await fetch(testUrl("/api/engagement/tracks/v1/track-mock-001/repost"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: "share" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reposted).toBe(true);
  });

  it("GET reposted tracks for user", async () => {
    const res = await fetch(
      testUrl("/api/public/engagement/tracks/v1/users/mock-user-id-123/reposted?offset=1&limit=20")
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.tracks)).toBe(true);
  });

  it("GET mention followers", async () => {
    const res = await fetch(testUrl("/api/engagement/mentions/v1/followers"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });
});
