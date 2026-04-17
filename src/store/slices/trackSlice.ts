import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TrackState {
  trackId:        string | null

  // basic info
  title:          string | null
  permalink:      string | null
  mainArtists:    string[]
  genre:          string | null
  tags:           string[]
  description:    string | null
  isPrivate:      boolean

  // media
  audioLink:      string | null
  audioId:        string | null
  imageLink:      string | null
  imagePublicId:  string | null

  // stats
  likesCount:     number
  playsCount:     number
  repostsCount:   number
  commentsCount:  number

  // meta
  releaseDate:    string | null

  // UI state
  isLiked:        boolean
  isReposted:     boolean
  isLoading:      boolean
  error:          string | null
}

const initialState: TrackState = {
  trackId:        null,

  title:          null,
  permalink:      null,
  mainArtists:    [],
  genre:          null,
  tags:           [],
  description:    null,
  isPrivate:      false,

  audioLink:      null,
  audioId:        null,
  imageLink:      null,
  imagePublicId:  null,

  likesCount:     0,
  playsCount:     0,
  repostsCount:   0,
  commentsCount:  0,

  releaseDate:    null,

  isLiked:        false,
  isReposted:     false,
  isLoading:      false,
  error:          null,
}

const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<Partial<TrackState>>) => {
      return { ...state, ...action.payload }
    },

    setTrackLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setTrackError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    clearTrack: () => initialState,

    // likes
    setIsLiked: (state, action: PayloadAction<boolean>) => {
      state.isLiked = action.payload
    },

    setLikesCount: (state, action: PayloadAction<number>) => {
      state.likesCount = action.payload
    },
    setRepostsCount: (state, action: PayloadAction<number>) => {
      state.repostsCount = action.payload
    },

    incrementLikes: (state) => {
      state.likesCount += 1
    },

    decrementLikes: (state) => {
      state.likesCount = Math.max(0, state.likesCount - 1)
    },

    // reposts
    setIsReposted: (state, action: PayloadAction<boolean>) => {
      state.isReposted = action.payload
    },

    incrementReposts: (state) => {
      state.repostsCount += 1
    },

    decrementReposts: (state) => {
      state.repostsCount = Math.max(0, state.repostsCount - 1)
    },

    // plays
    incrementPlays: (state) => {
      state.playsCount += 1
    },
  },
})

export const {
  setTrack,
  setTrackLoading,
  setTrackError,
  clearTrack,
  setIsLiked,
  setLikesCount,
  incrementLikes,
  decrementLikes,
  setIsReposted,
  incrementReposts,
  decrementReposts,
  incrementPlays,
} = trackSlice.actions

export default trackSlice.reducer