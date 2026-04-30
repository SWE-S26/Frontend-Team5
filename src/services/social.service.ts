    import api from "@/lib/api"
    import {
    GetFollowersResponse,
    GetFollowingResponse,
    GetSuggestedUsersResponse,
    GetBlockedUsersResponse,
    FollowUserResponse,
    UnfollowUserResponse,
    BlockUserResponse,
    UnblockUserResponse,
    SuggestedParams,
    } from "@/types/social.types"

    export const socialService = {

    /* (1) GET /api/public/social/v1/followers/{userId} */
    getFollowersPublic: (userId: string) =>
        api.get<GetFollowersResponse>(`/api/public/social/v1/followers/${userId}`),

    /* (2) GET /api/public/social/v1/following/{userId} */
    getFollowingPublic: (userId: string) =>
        api.get<GetFollowingResponse>(`/api/public/social/v1/following/${userId}`),

    /* (3) GET /api/social/v1/followers/{userId} */
    getFollowers: (userId: string) =>
        api.get<GetFollowersResponse>(`/api/social/v1/followers/${userId}`),

    /* (4) GET /api/social/v1/following/{userId} */
    getFollowing: (userId: string) =>
        api.get<GetFollowingResponse>(`/api/social/v1/following/${userId}`),

    /* (5) GET /api/social/v1/suggested
        offset + limit drive the refresh button — just change the params */
    getSuggestedUsers: () =>
        api.get<GetSuggestedUsersResponse>("/api/social/v1/suggested"),

    /* (6) GET /api/social/v1/blocked */
    getBlockedUsers: () =>
        api.get<GetBlockedUsersResponse>("/api/social/v1/blocked"),

    /* (7) POST /api/social/v1/follow/{userId} */
    followUser: (userId: string) =>
        api.post<FollowUserResponse>(`/api/social/v1/follow/${userId}`),

    /* (8) POST /api/social/v1/unfollow/{userId} */
    unfollowUser: (userId: string) =>
        api.post<UnfollowUserResponse>(`/api/social/v1/unfollow/${userId}`),

    /* (9) POST /api/social/v1/block/{userId} */
    blockUser: (userId: string) =>
        api.post<BlockUserResponse>(`/api/social/v1/block/${userId}`),

    /* (10) POST /api/social/v1/unblock/{userId} */
    unblockUser: (userId: string) =>
        api.post<UnblockUserResponse>(`/api/social/v1/unblock/${userId}`),
    }