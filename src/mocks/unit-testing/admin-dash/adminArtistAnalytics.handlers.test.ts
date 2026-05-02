import { createTestServer, testUrl } from "../helpers/mswServer"
import { adminArtistAnalyticsHandlers } from "@/mocks/handlers/admin-dash/adminArtistAnalyticsHandlers"

const server = createTestServer(...adminArtistAnalyticsHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("adminArtistAnalyticsHandlers", () => {
  it("GET /api/admin/v1/artist-analytics/me returns flat analytics object", async () => {
    const res = await fetch(testUrl("/api/admin/v1/artist-analytics/me"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(typeof json.totalPlays).toBe("number")
    expect(typeof json.totalplayrate).toBe("number")
    expect(json.totalLikes).toBeGreaterThan(0)
  })
})
