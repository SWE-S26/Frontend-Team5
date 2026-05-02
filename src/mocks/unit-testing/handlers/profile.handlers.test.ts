import { createTestServer, testUrl } from "../helpers/mswServer"
import { profileHandlers } from "@/mocks/handlers/profile.handlers"

const server = createTestServer(...profileHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("profile.handlers", () => {
  it("GET /api/profile/v1/:userId", async () => {
    const res = await fetch(testUrl("/api/profile/v1/mock-user-id-123"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.userId).toBe("mock-user-id-123")
    expect(json.role).toBe("user")
    expect(json.bannerLinks).toEqual([])
  })

  it("GET /api/public/profile/v1/:userId", async () => {
    const res = await fetch(testUrl("/api/public/profile/v1/mock-user-id-123"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.displayName).toBeDefined()
  })

  it("GET profile-link", async () => {
    const res = await fetch(testUrl("/api/public/profile/v1/profile-link/omds2005-1774126647643"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.profileLink).toBe("omds2005-1774126647643")
  })

  it("PATCH /api/profile/v1", async () => {
    const res = await fetch(testUrl("/api/profile/v1"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "New" }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.displayName).toBeDefined()
  })

  it("PATCH /api/profile/v1/images", async () => {
    const fd = new FormData()
    const res = await fetch(testUrl("/api/profile/v1/images"), {
      method: "PATCH",
      body: fd,
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.profileImgLink).toBeDefined()
  })
})
