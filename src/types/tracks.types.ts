//* ======================== API Integration ======================== */

export interface CreateTrackBasicInfo {
  title: string;
  permalink: string;
  mainArtists: string[];
  genre?: string;
  tags?: string[];
  description?: string;
  isPrivate: boolean;
  caption?: string;
}

export interface CreateTrackPermissions {
  enableDirectDownload?: boolean;
  offlineListening?: boolean;
  includeInRssFeed?: boolean;
  displayedEmbedCode?: boolean;
  enableAppPlayback?: boolean;
  allowComments?: boolean;
  showTrackComments?: boolean;
  showTrackInsights?: boolean;
  geoblocking?: string;
}

export interface CreateTrackLicense {
  type?: "allRightsReserved" | "creativeCommons";
  attribution?: boolean;
  nonCommercial?: boolean;
  noDerivativeWorks?: boolean;
  shareAlike?: boolean;
}

export interface CreateTrackAdvanced {
  buyLink?: string;
  recordLabel?: string;
  releaseDate?: string;
  publisher?: string;
  ISRC?: string;
  explicitContent?: boolean;
  pLine?: string;
  audioClipStart?: number;
  audioClipEnd?: number;
  composer?: string;
  ISWC?: string;
  albumTitle?: string;
}

export interface CreateTrackRequest {
  audio: File;
  image?: File;
  basicInfo: CreateTrackBasicInfo;
  permissions?: CreateTrackPermissions;
  license?: CreateTrackLicense;
  advanced?: CreateTrackAdvanced;
}

export interface CreateTrackValidationError {
  field: string;
  message: string;
}

export interface CreateTrackResponse {
  message: string;
  errors?: CreateTrackValidationError[];
  data?: {
    id?: string;
  };
}
export interface GetTracksResponse {
  message: string;
  data: {
    tracks: Track[];

    paginationInfo: {
      totalNumTracks: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
    };
  };
}

export interface GetTracksErrorResponse {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

export interface GetPostedTracksResponse {
  message: string;
  data: Track[];
}

export interface Track {
  trackId?: string;

  basicInfo: {
    title: string;
    permalink: string;
    mainArtists: string[];
    genre?: string;
    tags?: string[];
    description?: string;
    isPrivate: boolean;
    caption?: string;
  };

  posterId: string;
  durationInSeconds?: number;

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

  numLikes: number;
  numPlays: number;
  numReposts: number;
  numComments: number;
  releaseDate: string;
  isLikedByUser: boolean;
  isRepostedByUser?: boolean;
  isAvailableForUser?: boolean;
  geoBlocking?: {
    mode: "worldwide" | "exclusive" | "blocked";
    regions: string[];
    countries: string[];
  };

  permissions?: {
    enableDirectDownload?: boolean;
    offlineListening?: boolean;
    includeInRssFeed?: boolean;
    displayedEmbedCode?: boolean;
    enableAppPlayback?: boolean;
    // allowComments?: boolean;
    // showTrackComments?: boolean;
    // showTrackInsights?: boolean;
    // geoblocking?: string;
  };

  license?: {
    type?: "allRightsReserved" | "creativeCommons";
    attribution?: boolean;
    nonCommercial?: boolean;
    noDerivativeWorks?: boolean;
    shareAlike?: boolean;
  };

  audioClip?: {
    start: number;
    end: number;
  };

  // advanced?: {
  //   buyLink?: string;
  //   recordLabel?: string;
  //   releaseDate?: string;
  //   publisher?: string;
  //   ISRC?: string;
  //   explicitContent?: boolean;
  //   pLine?: string;
  //   audioClipStart?: number;
  //   audioClipEnd?: number;
  //   composer?: string;
  //   ISWC?: string;
  //   albumTitle?: string;
  // };
}

export interface GetTrackByIdResponse {
  message: string;
  data: Track;
}

export interface GetTrackPermalinkResponse {
  message: string;
  data: Track;
}

export interface CheckTrackPermalinkResponse {
  message: string;
  data: {
    isFound: boolean;
  };
}

export interface TrackDetailedAdvanced {
  buyLink?: string;
  recordLabel?: string;
  releaseDate?: string;
  publisher?: string;
  ISRC?: string;
  explicitContent?: boolean;
  pLine?: string;
  audioClipStart?: number;
  audioClipEnd?: number;
  composer?: string;
  ISWC?: string;
  albumTitle?: string;
}

export interface TrackDetailed {
  id: string;
  basicInfo: Track["basicInfo"];
  permissions?: Track["permissions"];
  license?: Track["license"];
  advanced?: TrackDetailedAdvanced;
}

export interface GetTrackDetailedResponse {
  message: string;
  data: TrackDetailed;
}

export interface UpdateTrackRequest {
  id: string;
  image?: File;
  basicInfo: CreateTrackBasicInfo;
  permissions?: CreateTrackPermissions;
  license?: CreateTrackLicense;
  advanced?: CreateTrackAdvanced;
}

export interface UpdateTrackResponse {
  message: string;
  errors?: CreateTrackValidationError[];
  data?: string;
}

export interface incrementPlayCountRequest{
  trackId: string
  listenedDuration: number
  sessionIdPlay: string
}

export interface incrementPlayCountResponse {
  message: string;
  errors?: CreateTrackValidationError[];
}

export interface GetUploadQuotaResponse {
  message: string;
  data: {
    quota: number;
  };
}

export interface deleteTrackResponse {
  message: string;
}

export interface GetLikedTracksResponse {
  message: string;
  data: Track[];
}

export interface AddTrackToHistoryResponse {
  message: string;
}


export interface TrackPlaylist {
  _id: string
  artistId: {
    _id: string
    displayName: string
    profileLink: string
    profileImg: { imgLink: string; publicId: string }
  }
  title: string
  permaLink: string
  description: string
  genre: string
  listOfTracks: string[]
  additionalTags: string[]
  isPrivate: boolean
  numOfLikes: number
  numOfReposts: number
  playlistType: "playlist" | "album" | string
  playlistLengthInSeconds: number
  image: { imgLink: string; publicId: string }
  createdAt: string
  updatedAt: string
}

export interface GetTrackPlaylistsResponse {
  message: string
  data: TrackPlaylist[]
}