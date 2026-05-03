import { createTestServer, testUrl } from "../helpers/mswServer";
import { authHandlers } from "@/mocks/handlers/auth.handlers";

const server = createTestServer(...authHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("auth.handlers", () => {
  it("POST find-email", async () => {
    const res = await fetch(testUrl("/api/auth/v1/find-email"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.exists).toBe(true);
  });

  it("POST login success", async () => {
    const res = await fetch(testUrl("/api/auth/v1/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "test1234" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("GET refresh-token", async () => {
    const res = await fetch(testUrl("/api/auth/v1/refresh-token"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.user.id).toBeDefined();
  });

  it("GET google/callback with code", async () => {
    const res = await fetch(testUrl("/api/auth/v1/google/callback?code=abc"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("complete");
  });

  it("GET google/callback incomplete flow", async () => {
    const res = await fetch(testUrl("/api/auth/v1/google/callback?code=incomplete"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.incompleteToken).toBeDefined();
  });

  it("POST google/complete", async () => {
    const res = await fetch(testUrl("/api/auth/v1/google/complete"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incompleteToken: "t",
        dateOfBirth: "2000-01-01",
        gender: "male",
      }),
    });
    expect(res.status).toBe(200);
  });

  it("POST google/verify-code", async () => {
    const res = await fetch(testUrl("/api/auth/v1/google/verify-code"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingToken: "p", code: "123456" }),
    });
    expect(res.status).toBe(200);
  });

  it("POST google/resend-code", async () => {
    const res = await fetch(testUrl("/api/auth/v1/google/resend-code"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingToken: "p" }),
    });
    expect(res.status).toBe(200);
  });

  it("GET cross/desktop QR payload", async () => {
    const res = await fetch(testUrl("/api/auth/v1/cross/desktop"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.pendingToken.qrCode).toBeDefined();
  });

  it("POST cross/desktop/poll", async () => {
    const res = await fetch(testUrl("/api/auth/v1/cross/desktop/poll"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrCode: "mock-qr-session-token" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.user.displayName).toBeDefined();
  });
});
