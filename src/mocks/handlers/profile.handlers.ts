import { http, HttpResponse } from "msw";
import type { GetProfileResponse, GetProfileByLinkResponse } from "@/types/profile.types";
import { MOCK_PROFILE_LINK, POSTER_ID } from "@/mocks/data/fixtures";

function profileErrors(userId: string | undefined) {
  if (!userId || userId === "invalid-id") {
    return HttpResponse.json(
      { success: false, message: "Invalid user ID", code: 400 },
      { status: 400 }
    );
  }
  if (userId === "unauth-id") {
    return HttpResponse.json(
      { success: false, message: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }
  if (userId === "private-id") {
    return HttpResponse.json(
      { success: false, message: "Profile is private", code: 403 },
      { status: 403 }
    );
  }
  if (userId === "notfound-id") {
    return HttpResponse.json(
      { success: false, message: "User not found", code: 404 },
      { status: 404 }
    );
  }
  return null;
}

function profileBody(userId: string): GetProfileResponse {
  return {
    userId,
    displayName: "Omar Mahmoud",
    firstName: "Omar",
    lastName: "Mahmoud",
    profileLink: MOCK_PROFILE_LINK,
    profileImgLink: "https://picsum.photos/200",
    bannerImgLink: null,
    bio: "Music lover and developer",
    city: "Cairo",
    country: "Egypt",
    links: [{ linkId: "1", name: "Twitter", link: "https://twitter.com/omar" }],
    bannerLinks: [],
    supportLink: null,
    role: "user",
    isPaid: false,
    isPrivate: false,
    favoriteGenres: ["Hip-Hop", "Jazz"],
    followersCount: 120,
    followedCount: 80,
    trackCount: 15,
    isFollowed: false,
    isBlocked: false,
    amIBlocked: false,
  };
}

function profileByLinkBody(profileLink: string): GetProfileByLinkResponse {
  return {
    userId: POSTER_ID,
    displayName: "Omar Mahmoud",
    firstName: "Omar",
    lastName: "Mahmoud",
    profileLink,
    profileImgLink: "https://picsum.photos/200",
    bannerImgLink: null,
    bio: "Music lover and developer",
    city: "Cairo",
    country: "Egypt",
    links: [{ linkId: "1", name: "Twitter", link: "https://twitter.com/omar" }],
    bannerLinks: [],
    supportLink: null,
    role: "user",
    isPaid: false,
    isPrivate: false,
    favoriteGenres: ["Hip-Hop", "Jazz"],
    followersCount: 120,
    followingsCount: 80,
    trackCount: 15,
    isFollowed: false,
    isBlocked: false,
    blockingMe: false,
    amIBlocked: false,
  };
}

export const profileHandlers = [
  http.get("/api/profile/v1/:userId", ({ params }) => {
    const err = profileErrors(params.userId as string);
    if (err) return err;
    return HttpResponse.json(profileBody(params.userId as string));
  }),

  http.get("/api/public/profile/v1/:userId", ({ params }) => {
    const err = profileErrors(params.userId as string);
    if (err) return err;
    return HttpResponse.json(profileBody(params.userId as string));
  }),

  http.get("/api/profile/v1/profile-link/:profileLink", ({ params }) => {
    const link = params.profileLink as string;
    if (link === "notfound") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json(profileByLinkBody(link));
  }),

  http.get("/api/public/profile/v1/profile-link/:profileLink", ({ params }) => {
    const link = params.profileLink as string;
    if (link === "notfound") {
      return HttpResponse.json(
        { success: false, message: "User not found", code: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json(profileByLinkBody(link));
  }),

  http.patch("/api/profile/v1", async ({ request }) => {
    await request.json().catch(() => ({}));
    const p = profileBody(POSTER_ID);
    return HttpResponse.json({
      displayName: p.displayName,
      firstName: p.firstName,
      lastName: p.lastName,
      profileLink: p.profileLink,
      bio: p.bio,
      city: p.city,
      country: p.country,
      profileImgLink: p.profileImgLink,
      bannerImgLink: p.bannerImgLink,
      links: p.links,
      bannerLinks: p.bannerLinks,
      supportLink: p.supportLink,
      favoriteGenres: p.favoriteGenres,
    });
  }),

  http.patch("/api/profile/v1/images", async () => {
    const p = profileBody(POSTER_ID);
    return HttpResponse.json({
      userId: p.userId,
      displayName: p.displayName,
      firstName: p.firstName,
      lastName: p.lastName,
      profileLink: p.profileLink,
      profileImgLink: "https://picsum.photos/201",
      bannerImgLink: "https://picsum.photos/1200/400",
      bio: p.bio,
      city: p.city,
      country: p.country,
      links: p.links,
      bannerLinks: p.bannerLinks,
      supportLink: p.supportLink,
      role: p.role,
      isPaid: p.isPaid,
      isPrivate: p.isPrivate,
      favoriteGenres: p.favoriteGenres,
      followersCount: p.followersCount,
      followedCount: p.followedCount,
      trackCount: p.trackCount,
    });
  }),
];
