import { Track } from "./tracks.types";

//* ======================== API Integration ======================== */

// ─── Track History ────────────────────────────────────────────────────────────

export interface GetTrackHistoryResponse {
  message: string;
  data: Track[];
}

// ─── Playlist History ─────────────────────────────────────────────────────────

export interface HistoryPlaylist {
  _id: string;
  artistId: string;
  title: string;
  permaLink: string;
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  genre: string;
  listOfTracks: string[];
  additionalTags: string[];
  releaseDate: string;
  isPrivate: boolean;
  numOfLikes: number;
  numOfReposts: number;
  playlistType: "playlist" | "album";
  playlistLengthInSeconds: number;
  isLikedByUser: boolean;
  isRepostedByUser: boolean;
  rssFeedLink: string;
  recordLabel: string;
}

export interface GetPlaylistHistoryResponse {
  message: string;
  data: HistoryPlaylist[];
}

// ─── Delete History ───────────────────────────────────────────────────────────

export interface DeleteHistoryResponse {
  message: string;
}
