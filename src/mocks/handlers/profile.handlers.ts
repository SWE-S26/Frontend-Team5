// mocks/handlers/profile.handlers.ts
import { http, HttpResponse } from "msw"

const BASE = process.env.NEXT_PUBLIC_API_URL

/* (1) */
export const profileHandlers = [
  http.get(`${BASE}/api/profile/v1/:userId`, ({ params }) => {
    const { userId } = params

    // 400 - invalid user ID
    if (!userId || userId === "invalid-id") {
      return HttpResponse.json(
        { success: false, message: "Invalid user ID", code: 400 },
        { status: 400 }
      )
    }

    // 401 - unauthorized
    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      )
    }

    // 403 - private profile
    if (userId === "private-id") {
      return HttpResponse.json(
        { success: false, message: "Profile is private", code: 403 },
        { status: 403 }
      )
    }

    // 404 - user not found
    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      )
    }

    // 200 - success
    return HttpResponse.json({
      userId:          userId as string,
      displayName:     "Omar Mahmoud",
      firstName:       "Omar",
      lastName:        "Mahmoud",
      profileLink:     "https://beatza.me/profile/omar",
      profileImgLink:  "https://picsum.photos/200",
      bannerImgLink:   "https://picsum.photos/1200/300",
      bio:             "Music lover and developer",
      city:            "Cairo",
      country:         "Egypt",
      links:           [{ linkId: "1", name: "Twitter", link: "https://twitter.com/omar" }],
      bannerLinks:     [],
      supportLink:     "",
      role:            "Listener",
      isPaid:          false,
      favoriteGenres:  ["Hip-Hop", "Jazz"],
      followersCount:  120,
      followingsCount: 80,
      trackCount:      15,
    }, { status: 200 })
  }),
]