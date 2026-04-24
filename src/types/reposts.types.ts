//* ======================== API Integration ======================== */

// --- Track Repost ---

export interface RepostTrackResponse {
  reposted: boolean;
  numberOfReposts: number;
}

export interface RepostTrackErrorResponse {
  message: string;
}

export interface GetTrackRepostStatusResponse {
  reposted: boolean;
  caption: string | null;
  repostedAt: string | null;
}

export interface GetTrackRepostStatusErrorResponse {
  message: string;
}

export interface UpdateTrackRepostResponse {
  success: boolean;
  caption: string;
}

export interface UpdateTrackRepostErrorResponse {
  error: string;
}

// --- Playlist Repost ---

export interface RepostPlaylistResponse {
  reposted: boolean;
  numberOfReposts: number;
}

export interface RepostPlaylistErrorResponse {
  message: string;
}

// --- Shared ---

export interface RepostUser {
  userId: string;
  displayName: string;
  avatarUrl: string;
  followersCount: number;
}

export interface TrackRepostsResponse {
  total: number;
  offset: number;
  limit: number;
  users: RepostUser[];
}

export interface PlaylistRepostsResponse {
  total: number;
  offset: number;
  limit: number;
  users: RepostUser[];
}
