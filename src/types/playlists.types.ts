import { Track } from "@/types/tracks.types";

// ======================== Playlist Entity ========================

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

// ======================== Request Types ========================

export interface CreatePlaylistRequest {
  playlistName: string;
  tracks: string[];
  isPrivate: boolean;
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

// ======================== Response Types ========================

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