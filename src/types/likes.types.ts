//* ======================== API Integration ======================== */

/* (1) "/api/engagement/tracks/v1/{trackId}/like" */
export interface LikeTrackResponse {
  liked: boolean;
  numOfLikes: number;
}

export interface LikeTrackErrorResponse {
  message: string;
}

export interface LikeUser {
  userId:         string
  displayName:    string
  avatarUrl:      string
  followersCount: number
}

export interface TrackLikesResponse {
  total:  number
  offset: number
  limit:  number
  users:  LikeUser[]
}
