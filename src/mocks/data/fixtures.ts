import type { Track } from "@/types/tracks.types";
import type { PlaylistDetail, PlaylistTrack, Playlist } from "@/types/playlists.types";
import type { TrackPlaylist } from "@/types/tracks.types";
import type { HistoryPlaylist } from "@/types/history.types";

export const POSTER_ID = "mock-user-id-123";
export const MOCK_PROFILE_LINK = "omds2005-1774126647643";

export function mockTrack(trackId: string, permalink: string, title: string): Track {
  return {
    trackId,
    basicInfo: {
      title,
      permalink,
      mainArtists: ["Mock Artist"],
      genre: "Hip-Hop",
      tags: [],
      description: "Mock track",
      isPrivate: false,
      caption: "",
    },
    posterId: POSTER_ID,
    durationInSeconds: 180,
    audio: {
      audioLink: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      id: `audio-${trackId}`,
      cloudIndex: 0,
      waveformLink: "https://picsum.photos/seed/wave/800/120",
    },
    image: {
      imgLink: "https://picsum.photos/seed/cover/400",
      publicId: `cover/${trackId}`,
    },
    numLikes: 10,
    numPlays: 100,
    numReposts: 2,
    numComments: 3,
    numDownloads: 1,
    releaseDate: new Date().toISOString(),
    isLikedByUser: false,
    isRepostedByUser: false,
    isAvailableForUser: true,
  };
}

export const MOCK_TRACKS: Track[] = [
  mockTrack("track-mock-001", "summer-vibes", "Summer Vibes"),
  mockTrack("track-mock-002", "night-drive", "Night Drive"),
];

export function getTrackOrDefault(id: string): Track {
  return MOCK_TRACKS.find((t) => t.trackId === id) ?? { ...MOCK_TRACKS[0], trackId: id };
}

function toPlaylistTrack(track: Track): PlaylistTrack {
  return {
    _id: track.trackId!,
    basicInfo: track.basicInfo,
    audio: track.audio,
    image: track.image,
    durationInSeconds: track.durationInSeconds ?? 180,
    numOfPlays: track.numPlays,
    numOfLikes: track.numLikes,
    isAvailableForUser: true,
    isLiked: false,
    isReposted: false,
  };
}

export function mockPlaylistDetail(_id: string, title: string, tracks: Track[]): PlaylistDetail {
  const pts = tracks.map(toPlaylistTrack);
  const len = pts.reduce((s, p) => s + p.durationInSeconds, 0);
  return {
    _id,
    artistId: POSTER_ID,
    title,
    description: "Mock playlist",
    genre: "Electronic",
    listOfTracks: tracks.map((t) => t.trackId!),
    additionalTags: [],
    permalink: title.toLowerCase().replace(/\s+/g, "-"),
    isPrivate: false,
    numOfLikes: 5,
    numOfReposts: 1,
    playlistType: "playlist",
    playlistLengthInSeconds: len,
    likedUser: [],
    isLiked: false,
    isReposted: false,
    image: { imgLink: "https://picsum.photos/seed/pl/400", publicId: `pl/${_id}` },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalTracks: pts.length,
    totalPages: 1,
    page: 1,
    tracks: pts,
  };
}

export const MOCK_PLAYLIST_DETAIL = mockPlaylistDetail(
  "playlist-mock-001",
  "Mock Playlist One",
  MOCK_TRACKS
);

export function toPlaylistSummary(d: PlaylistDetail): Playlist {
  const { totalTracks, totalPages, page, tracks, ...rest } = d;
  return rest;
}

export function mockTrackPlaylistAlbum(_id: string, title: string): TrackPlaylist {
  return {
    _id,
    artistId: {
      _id: POSTER_ID,
      displayName: "Mock Artist",
      profileLink: MOCK_PROFILE_LINK,
      profileImg: { imgLink: "https://picsum.photos/200", publicId: "p/1" },
    },
    title,
    permaLink: title.toLowerCase().replace(/\s+/g, "-"),
    description: "",
    genre: "Electronic",
    listOfTracks: MOCK_TRACKS.map((t) => t.trackId!),
    additionalTags: [],
    isPrivate: false,
    numOfLikes: 0,
    numOfReposts: 0,
    playlistType: "album",
    playlistLengthInSeconds: 360,
    rssFeedLink: "",
    recordLabel: "",
    image: { imgLink: "https://picsum.photos/seed/album/400", publicId: `alb/${_id}` },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mockHistoryPlaylistFromDetail(d: PlaylistDetail): HistoryPlaylist {
  return {
    _id: d._id,
    artistId: d.artistId,
    title: d.title,
    permaLink: d.permalink,
    image: { url: d.image.imgLink, publicId: d.image.publicId },
    description: d.description,
    genre: d.genre,
    listOfTracks: d.listOfTracks,
    additionalTags: d.additionalTags,
    releaseDate: d.createdAt,
    isPrivate: d.isPrivate,
    numOfLikes: d.numOfLikes,
    numOfReposts: d.numOfReposts,
    playlistType: d.playlistType as "playlist" | "album",
    playlistLengthInSeconds: d.playlistLengthInSeconds,
    isLikedByUser: d.isLiked,
    isRepostedByUser: d.isReposted,
    rssFeedLink: "",
    recordLabel: "",
  };
}
