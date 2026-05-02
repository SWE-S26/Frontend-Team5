import { Track } from "@/types/tracks.types";

// Playlist Entity

export interface PlaylistImage {
  imgLink: string;
  publicId: string;
}

export interface PlaylistTrack {
  _id: string;
  basicInfo: {
    title: string;
    permalink: string;
    mainArtists: string[];
  };
  audio: {
    audioLink: string;
    id: string;
    cloudIndex: number;
    downloadLink?: string;
    waveformLink: string;
  };
  image: {
    imgLink: string;
    publicId: string;
  };
  audioClip?: {
    start: number;
    end: number;
  };
  durationInSeconds: number;
  numOfPlays: number;
  numOfLikes: number;
  permissions?: {
    enableDirectDownload?: boolean;
    offlineListening?: boolean;
    includeInRssFeed?: boolean;
    displayedEmbedCode?: boolean;
    enableAppPlayback?: boolean;
  };
  poster?: {
    _id: string;
    displayName: string;
    profileLink: string;
  };
  isLiked: boolean;
  isReposted: boolean;
}

export interface Playlist {
  _id: string;
  artistId: string;
  title: string;
  description: string;
  genre: string;
  listOfTracks: string[];
  additionalTags: string[];
  permalink: string;
  isPrivate: boolean;
  numOfLikes: number;
  numOfReposts: number;
  playlistType: "playlist" | "album" | string;
  playlistLengthInSeconds: number;
  likedUser: string[];
  isLiked: boolean;
  isReposted: boolean;
  image: PlaylistImage;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistDetail extends Playlist {
  totalTracks: number;
  totalPages: number;
  page: number;
  tracks: PlaylistTrack[];
}

export interface CreatePlaylistRequest {
  playlistName: string;
  tracks: string[];
  isPrivate: boolean;
}

export interface CreatePlaylistWithImageRequest {
  title: string;
  description?: string;
  isPrivate: boolean;
  listOfTracks: string[];
  buyLink?: string;
  recordLabel?: string;
  image?: File;
}

export interface UpdatePlaylistRequest {
  title?: string;
  permalink?: string;
  additionalTags?: string[];
  type?: string;
  playlistType?: string;
  releaseDate?: string;
  genre?: string;
  tags?: string[];
  description?: string;
  isPrivate?: boolean;
  audioTracks?: string[];
  lengthOfRecievedTracks?: number;
  licensing?: object;
  buyLink?: string;
  recordLabel?: string;
  image?: File;
}

// Response Types

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreatePlaylistResponse {
  message: string;
  data?: {
    playlists: Playlist[];
  };
  errors?: ValidationError[];
}

export interface GetPlaylistsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

export interface GetMyPlaylistsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

export interface GetPlaylistByIdResponse {
  message: string;
  data: {
    playlist: PlaylistDetail[] | PlaylistDetail | null;
  };
}

export interface UpdatePlaylistResponse {
  message: string;
  errors?: ValidationError[];
}

export interface DeletePlaylistResponse {
  message: string;
  data?: {
    deleted: boolean;
  };
}

export interface AddTrackToPlaylistResponse {
  message: string;
}

// Creator / Artist

export interface PlaylistCreatorInfo {
  displayName: string;
  profileLink: string;
  profileImage: {
    imgLink: string;
    publicId: string;
  };
  followersCount: number;
  isFollowed: boolean;
}

export interface GetPlaylistCreatorResponse {
  message: string;
  data: {
    artist: PlaylistCreatorInfo | PlaylistCreatorInfo[];
  };
}

// Recommended Playlists

export interface GetRecommendedPlaylistsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

// Artist Playlists

export interface GetArtistPlaylistsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

// Albums

export interface GetArtistAlbumsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

// Permalink (old v1 — returns array)
export interface GetPlaylistByPermalinkResponse {
  message: string;
  data: {
    playlists: PlaylistDetail[];
  };
}

// Permalink v2 — returns single playlist object (used for message link previews)
export interface GetPlaylistByProfilePermalinkResponse {
  message: string;
  data: {
    playlist: PlaylistDetail;
  };
}

// Update Image

export interface UpdatePlaylistImageRequest {
  image: File;
}

export interface UpdatePlaylistImageResponse {
  message: string;
  data: {
    playlist: Playlist;
  };
}

// Reorder Tracks

export interface ReorderPlaylistTracksRequest {
  trackId: string;
  oldPosition: number;
  newPosition: number;
}

export interface ReorderPlaylistTracksResponse {
  message: string;
}

// History

export interface AddPlaylistToHistoryResponse {
  message: string;
}

// Public Playlists

export interface GetPublicPlaylistsResponse {
  message: string;
  data: {
    playlists: Playlist[];
  };
}

export interface GetPublicPlaylistByIdResponse {
  message: string;
  data: {
    playlist: PlaylistDetail[] | PlaylistDetail | null;
  };
}

export interface GetRepostedPlaylistsResponse {
  total: number;
  offset: number;
  limit: number;
  playlists: Playlist[];
}