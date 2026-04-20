// ─────────────────────────────────────────────────────────────────────────────
// Shared user shape
// Returned inside every list (followers, following, suggested, blocked)
// AND as the response body of every POST (follow, unfollow, block, unblock)
// ─────────────────────────────────────────────────────────────────────────────
export interface SocialUser {
  userId:         string
  displayName:    string
  profileImgLink: string | null
  trackCount:     number
  followersCount: number
  isFollowed?:     boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// (1) GET /api/social/v1/followers/{userId}

// ─────────────────────────────────────────────────────────────────────────────
export type GetFollowersResponse = SocialUser[]

// ─────────────────────────────────────────────────────────────────────────────
// (2) GET /api/social/v1/following/{userId}
// ─────────────────────────────────────────────────────────────────────────────
export type GetFollowingResponse = SocialUser[]

// ─────────────────────────────────────────────────────────────────────────────
// (3) GET /api/social/v1/suggested

// ─────────────────────────────────────────────────────────────────────────────
export type GetSuggestedUsersResponse = SocialUser[]

// Query params for suggested (offset + limit drive the refresh button)
export interface SuggestedParams {
  offset?: number
  limit?:  number
}

// ─────────────────────────────────────────────────────────────────────────────
// (4) GET /api/social/v1/blocked

// ─────────────────────────────────────────────────────────────────────────────
export type GetBlockedUsersResponse = SocialUser[]

// ─────────────────────────────────────────────────────────────────────────────
// (5) POST /api/social/v1/follow/{userId}

// ─────────────────────────────────────────────────────────────────────────────
export type FollowUserResponse = SocialUser

// ─────────────────────────────────────────────────────────────────────────────
// (6) POST /api/social/v1/unfollow/{userId}

// ─────────────────────────────────────────────────────────────────────────────
export type UnfollowUserResponse = SocialUser

// ─────────────────────────────────────────────────────────────────────────────
// (7) POST /api/social/v1/block/{userId}

// ─────────────────────────────────────────────────────────────────────────────
export type BlockUserResponse = SocialUser

// ─────────────────────────────────────────────────────────────────────────────
// (8) POST /api/social/v1/unblock/{userId}

// ─────────────────────────────────────────────────────────────────────────────
export type UnblockUserResponse = SocialUser