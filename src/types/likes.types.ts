//* ======================== API Integration ======================== */

/* (1) "/api/engagement/tracks/v1/{trackId}/like" */
export interface LikeTrackResponse {
  liked: boolean;
  numOfLikes: number;
}

export interface LikeTrackErrorResponse {
  message: string;
}
