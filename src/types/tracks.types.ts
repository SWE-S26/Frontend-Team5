//* ======================== CREATE TRACK ======================== */

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
/* (1) "/api/public/tracks/v1/?page=1&limit=10" */
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
  trackId: string;

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

  posterId?: string;

  durationInSeconds?: number;

  audio: {
    audioLink: string;
    id: string;
    cloudIndex?: number;
    downloadLink?: string;
    waveformLink?: string;
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
}


/* ======================== GET TRACK BY ID ======================== */

export interface GetTrackByIdResponse {
  message: string;
  data: TrackBase;
}


/* ======================== GET TRACKS (LIST) ======================== */

export interface TrackListItem {
  trackId: string;

  basicInfo: {
    title: string;
    permalink: string;
    mainArtists: string[];
    genre: string;
    tags: string[];
    description: string;
    isPrivate: boolean;
    caption?: string;
  };

  audio: {
    audioLink: string;
    id: string;
  };

  durationInSeconds: number;

  image: {
    imgLink: string;
    publicId: string;
  };

  numLikes: number;
  numPlays: number;
  numReposts: number;
  numComments: number;

  releaseDate: string;
}

export interface GetTracksResponse {
  message: string;
  data: {
    tracks: TrackListItem[];
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


/* ======================== POSTED TRACKS ======================== */

export interface PostedTrack {
  trackId: string;

  basicInfo: {
    title: string;
    permalink: string;
    mainArtists: string[];
    genre?: string;
    tags?: string[];
    isPrivate: boolean;
  };

  audio?: {
    audioLink?: string;
    id?: string;
  };

  image?: {
    imgLink?: string;
    publicId?: string;
  };

  numLikes?: number;
  numPlays?: number;
  numReposts?: number;
  numComments?: number;

  releaseDate?: string;
}

export interface GetPostedTracksResponse {
  message: string;
  data: PostedTrack[];
}


/* ======================== UPDATE TRACK ======================== */

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


/* ======================== OTHER RESPONSES ======================== */

export interface IncrementPlayCountResponse {
  message: string;
  errors?: CreateTrackValidationError[];
}

export interface DeleteTrackResponse {
  message: string;
}
