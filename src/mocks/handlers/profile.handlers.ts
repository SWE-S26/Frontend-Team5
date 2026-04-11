import { http, HttpResponse } from "msw"

const BASE = process.env.NEXT_PUBLIC_API_URL

/* (1) */
export const profileHandlers = [
  http.get(`${BASE}/api/profile/v1/:userId`, ({ params }) => {
    const { userId } = params

    if (!userId || userId === "invalid-id") {
      return HttpResponse.json(
        { success: false, message: "Invalid user ID", code: 400 },
        { status: 400 }
      )
    }

    if (userId === "unauth-id") {
      return HttpResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 }
      )
    }

    if (userId === "private-id") {
      return HttpResponse.json(
        { success: false, message: "Profile is private", code: 403 },
        { status: 403 }
      )
    }

    if (userId === "notfound-id") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      userId:         userId as string,
      displayName:    "Omar Mahmoud",
      firstName:      "Omar",
      lastName:       "Mahmoud",
      profileLink:    "omds2005-1774126647643",
      profileImgLink: "https://picsum.photos/200",
      bannerImgLink:  null,              // matches real response (can be null)
      bio:            "Music lover and developer",
      city:           "Cairo",
      country:        "Egypt",
      links:          [{ linkId: "1", name: "Twitter", link: "https://twitter.com/omar" }],
      supportLink:    null,              // matches real response (can be null)
      favoriteGenres: ["Hip-Hop", "Jazz"],
      followersCount:  120,
      followedCount:   80,
      trackCount:      15,
      isFollowed:      false,
      isBlocked:       false,
    }, { status: 200 })
  }),
]