export interface AdminTrack {
  id: string;
  title: string;
  artistName: string;
  type: "track" | "playlist";
  numberOfPlays: number;
  numberOfLikes: number;
  banned: boolean;
  createdAt: string;
}

export interface AdminTracksResponse {
  total: number;
  offset: number;
  limit: number;
  items: AdminTrack[];
}

export interface AdminTracksParams {
  offset?: number;
  limit?: number;
  query?: string;
}

export interface BanTrackPayload {
  reason: string;
}