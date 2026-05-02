import { createTestServer, testUrl } from "../helpers/mswServer"
import { socialHandlers } from "@/mocks/handlers/social.handlers"

const server = createTestServer(...socialHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("social.handlers", () => {
  it("GET followers (auth path)", async () => {
    const res = await fetch(testUrl("/api/social/v1/followers/mock-user-id-123"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json[0].userId).toBeDefined()
  })

  it("GET followers (public path)", async () => {
    const res = await fetch(testUrl("/api/public/social/v1/followers/mock-user-id-123"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.length).toBeGreaterThan(0)
  })

  it("GET following public", async () => {
    const res = await fetch(testUrl("/api/public/social/v1/following/mock-user-id-123"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.every((u: { isFollowed: boolean }) => u.isFollowed)).toBe(true)
  })

  it("GET suggested", async () => {
    const res = await fetch(testUrl("/api/social/v1/suggested?offset=0&limit=5"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
  })

  it("POST follow", async () => {
    const res = await fetch(testUrl("/api/social/v1/follow/mock-user-001"), {
      method: "POST",
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.userId).toBe("mock-user-001")
  })
})
