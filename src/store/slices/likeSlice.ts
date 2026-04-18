import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LikeUser } from "@/types/likes.types"

interface LikesState {
  users:   LikeUser[]
  total:   number
  offset:  number
  limit:   number
  loading: boolean
  error:   string | null
}

const initialState: LikesState = {
  users:   [],
  total:   0,
  offset:  1,
  limit:   20,
  loading: false,
  error:   null,
}

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLikesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setLikesError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setLikes(state, action: PayloadAction<{ users: LikeUser[]; total: number; offset: number }>) {
      state.users  = action.payload.users
      state.total  = action.payload.total
      state.offset = action.payload.offset
    },
    appendLikes(state, action: PayloadAction<{ users: LikeUser[]; total: number; offset: number }>) {
      state.users  = [...state.users, ...action.payload.users]
      state.total  = action.payload.total
      state.offset = action.payload.offset
    },
  },
})

export const {
  setLikesLoading,
  setLikesError,
  setLikes,
  appendLikes,
} = likesSlice.actions

export default likesSlice.reducer