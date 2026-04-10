    import { http, HttpResponse } from "msw"

    const BASE = process.env.NEXT_PUBLIC_API_URL

    // ─────────────────────────────────────────────────────────────────────────────
    // Mock user pool — reused across all list endpoints
    // Shape matches exactly what the real API returns
    // ─────────────────────────────────────────────────────────────────────────────
    const MOCK_USERS = [
    {
        userId:         "mock-user-001",
        displayName:    "Karol G",
        profileImgLink: "https://picsum.photos/seed/karólg/200",
        trackCount:     109,
        followersCount: 395000,
    },
    {
        userId:         "mock-user-002",
        displayName:    "Trippie Redd",
        profileImgLink: "https://picsum.photos/seed/trippie/200",
        trackCount:     531,
        followersCount: 2160000,
    },
    {
        userId:         "mock-user-003",
        displayName:    "DOJA CAT",
        profileImgLink: "https://picsum.photos/seed/doja/200",
        trackCount:     164,
        followersCount: 2030000,
    },
    {
        userId:         "mock-user-004",
        displayName:    "Bad Bunny",
        profileImgLink: "https://picsum.photos/seed/badbunny/200",
        trackCount:     200,
        followersCount: 3040000,
    },
    {
        userId:         "mock-user-005",
        displayName:    "Drake",
        profileImgLink: "https://picsum.photos/seed/drake/200",
        trackCount:     320,
        followersCount: 5000000,
    },
    {
        userId:         "mock-user-006",
        displayName:    "Taylor Swift",
        profileImgLink: "https://picsum.photos/seed/taylorswift/200",
        trackCount:     280,
        followersCount: 8000000,
    },
    {
        userId:         "mock-user-007",
        displayName:    "The Weeknd",
        profileImgLink: "https://picsum.photos/seed/weeknd/200",
        trackCount:     150,
        followersCount: 6500000,
    },
    ]

    // ─────────────────────────────────────────────────────────────────────────────
    export const socialHandlers = [

    // (1) GET /api/social/v1/followers/{userId}
  
    http.get(`${BASE}/api/social/v1/followers/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        // Return first 3 users as mock followers — plain array, no wrapper
        return HttpResponse.json(MOCK_USERS.slice(0, 3), { status: 200 })
    }),

    // (2) GET /api/social/v1/following/{userId}

    http.get(`${BASE}/api/social/v1/following/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        return HttpResponse.json(MOCK_USERS.slice(0, 4), { status: 200 })
    }),

    // (3) GET /api/social/v1/suggested
   
    http.get(`${BASE}/api/social/v1/suggested`, ({ request }) => {
        const url    = new URL(request.url)
        const offset = parseInt(url.searchParams.get("offset") ?? "0", 10)
        const limit  = parseInt(url.searchParams.get("limit")  ?? "20", 10)

        const sliced = MOCK_USERS.slice(offset, offset + limit)
        // If we've run out of users, loop back from start (simulates endless suggestions)
        const result = sliced.length > 0 ? sliced : MOCK_USERS.slice(0, limit)

        return HttpResponse.json(result, { status: 200 })
    }),

    // (4) GET /api/social/v1/blocked
    // Returns the blocked users list — plain array
    http.get(`${BASE}/api/social/v1/blocked`, () => {
        // Return last 2 from pool as mock blocked users
        return HttpResponse.json(MOCK_USERS.slice(5, 7), { status: 200 })
    }),

    // (5) POST /api/social/v1/follow/{userId}
    
    http.post(`${BASE}/api/social/v1/follow/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        // Find user in pool or fall back to first user
        const user = MOCK_USERS.find(u => u.userId === userId) ?? MOCK_USERS[0]
        // Backend returns updated followersCount — simulate +1
        return HttpResponse.json(
        { ...user, followersCount: user.followersCount + 1 },
        { status: 200 },
        )
    }),

    // (6) POST /api/social/v1/unfollow/{userId}
  
    http.post(`${BASE}/api/social/v1/unfollow/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        const user = MOCK_USERS.find(u => u.userId === userId) ?? MOCK_USERS[0]
        // Backend returns updated followersCount — simulate -1, floor at 0
        return HttpResponse.json(
        { ...user, followersCount: Math.max(0, user.followersCount - 1) },
        { status: 200 },
        )
    }),

    // (7) POST /api/social/v1/block/{userId}

    http.post(`${BASE}/api/social/v1/block/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        const user = MOCK_USERS.find(u => u.userId === userId) ?? MOCK_USERS[0]
        return HttpResponse.json(user, { status: 200 })
    }),

    // (8) POST /api/social/v1/unblock/{userId}

    http.post(`${BASE}/api/social/v1/unblock/:userId`, ({ params }) => {
        const { userId } = params

        if (userId === "unauth-id") {
        return HttpResponse.json(
            { success: false, message: "Unauthorized", code: 401 },
            { status: 401 },
        )
        }
        if (userId === "notfound-id") {
        return HttpResponse.json(
            { success: false, message: "User not found", code: 404 },
            { status: 404 },
        )
        }
        if (userId === "error-id") {
        return HttpResponse.json(
            { success: false, message: "Internal server error", code: 500 },
            { status: 500 },
        )
        }

        const user = MOCK_USERS.find(u => u.userId === userId) ?? MOCK_USERS[0]
        return HttpResponse.json(user, { status: 200 })
    }),
    ]