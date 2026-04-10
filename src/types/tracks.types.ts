//* ======================== API Integration ======================== */

/* (1) "/api/public/tracks/v1/?page=1&limit=10" */
export interface GetTracksResponse {
  message: string;
  data: {
    tracks: {
      _id: string;
      basicInfo: {
        title: string;
        permalink: string;
        mainArtists: string[];
        genre: string;
        tags: string[];
        description: string;
        isPrivate: boolean;
      };
      audio: {
        audioLink: string;
        id: string;
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
    }[];
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
