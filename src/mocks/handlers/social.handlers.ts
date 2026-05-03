import { http, HttpResponse } from "msw";

// ─────────────────────────────────────────────────────────────────────────────
// Mock user pool — reused across all list endpoints
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    userId: "mock-user-001",
    displayName: "Karol G",
    profileImgLink: "https://picsum.photos/seed/karólg/200",
    trackCount: 109,
    followersCount: 395000,
    isFollowed: false,
  },
  {
    userId: "mock-user-002",
    displayName: "Trippie Redd",
    profileImgLink: "https://picsum.photos/seed/trippie/200",
    trackCount: 531,
    followersCount: 2160000,
    isFollowed: true,
  },
  {
    userId: "mock-user-003",
    displayName: "DOJA CAT",
    profileImgLink: "https://picsum.photos/seed/doja/200",
    trackCount: 164,
    followersCount: 2030000,
    isFollowed: false,
  },
  {
    userId: "mock-user-004",
    displayName: "Bad Bunny",
    profileImgLink: "https://picsum.photos/seed/badbunny/200",
    trackCount: 200,
    followersCount: 3040000,
    isFollowed: true,
  },
  {
    userId: "mock-user-005",
    displayName: "Drake",
    profileImgLink: "https://picsum.photos/seed/drake/200",
    trackCount: 320,
    followersCount: 5000000,
    isFollowed: false,
  },
  {
    userId: "mock-user-006",
    displayName: "Taylor Swift",
    profileImgLink: "https://picsum.photos/seed/taylorswift/200",
    trackCount: 280,
    followersCount: 8000000,
    isFollowed: true,
  },
  {
    userId: "mock-user-007",
    displayName: "The Weeknd",
    profileImgLink: "https://picsum.photos/seed/weeknd/200",
    trackCount: 150,
    followersCount: 6500000,
    isFollowed: false,
  },
];

function followersHandler({ params }: { params: Record<string, string | undefined> }) {
  const { userId } = params;

  if (userId === "unauth-id") {
    return HttpResponse.json(
      { success: false, message: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }
  if (userId === "notfound-id") {
    return HttpResponse.json(
      { success: false, message: "User not found", code: 404 },
      { status: 404 }
    );
  }
  if (userId === "error-id") {
    return HttpResponse.json(
      { success: false, message: "Internal server error", code: 500 },
      { status: 500 }
    );
  }

  return HttpResponse.json(MOCK_USERS.slice(0, 3), { status: 200 });
}

function followingHandler({ params }: { params: Record<string, string | undefined> }) {
  const { userId } = params;

  if (userId === "unauth-id") {
    return HttpResponse.json(
      { success: false, message: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }
  if (userId === "notfound-id") {
    return HttpResponse.json(
      { success: false, message: "User not found", code: 404 },
      { status: 404 }
    );
  }
  if (userId === "error-id") {
    return HttpResponse.json(
      { success: false, message: "Internal server error", code: 500 },
      { status: 500 }
    );
  }

  return HttpResponse.json(
    MOCK_USERS.slice(0, 4).map((u) => ({ ...u, isFollowed: true })),
    { status: 200 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export const socialHandlers = [
  http.get("/api/social/v1/followers/:userId", followersHandler),
  http.get("/api/public/social/v1/followers/:userId", followersHandler),

  http.get("/api/social/v1/following/:userId", followingHandler),
  http.get("/api/public/social/v1/following/:userId", followingHandler),

  http.get("/api/social/v1/suggested", ({ request }) => {
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);

    const sliced = MOCK_USERS.slice(offset, offset + limit);
    const result = sliced.length > 0 ? sliced : MOCK_USERS.slice(0, limit);

    return HttpResponse.json(
      result.map((u) => ({ ...u, isFollowed: false })),
      { status: 200 }
    );
  }),

  http.get("/api/social/v1/blocked", () => {
    return HttpResponse.json(MOCK_USERS.slice(5, 7), { status: 200 });
  }),

  http.post("/api/social/v1/follow/:userId", ({ params }) => {
    const { userId } = params;

    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      );
    }
    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    if (userId === "error-id") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", code: 500 },
        { status: 500 }
      );
    }

    const user = MOCK_USERS.find((u) => u.userId === userId) ?? MOCK_USERS[0];
    return HttpResponse.json({ ...user, followersCount: user.followersCount + 1 }, { status: 200 });
  }),

  http.post("/api/social/v1/unfollow/:userId", ({ params }) => {
    const { userId } = params;

    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      );
    }
    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    if (userId === "error-id") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", code: 500 },
        { status: 500 }
      );
    }

    const user = MOCK_USERS.find((u) => u.userId === userId) ?? MOCK_USERS[0];
    return HttpResponse.json(
      { ...user, followersCount: Math.max(0, user.followersCount - 1) },
      { status: 200 }
    );
  }),

  http.post("/api/social/v1/block/:userId", ({ params }) => {
    const { userId } = params;

    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      );
    }
    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    if (userId === "error-id") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", code: 500 },
        { status: 500 }
      );
    }

    const user = MOCK_USERS.find((u) => u.userId === userId) ?? MOCK_USERS[0];
    return HttpResponse.json(user, { status: 200 });
  }),

  http.post("/api/social/v1/unblock/:userId", ({ params }) => {
    const { userId } = params;

    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      );
    }
    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    if (userId === "error-id") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", code: 500 },
        { status: 500 }
      );
    }

    const user = MOCK_USERS.find((u) => u.userId === userId) ?? MOCK_USERS[0];
    return HttpResponse.json(user, { status: 200 });
  }),
];
