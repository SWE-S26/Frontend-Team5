import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TrackComment } from "@/types/comments.types"

interface CommentState {
  comments: TrackComment[]
  total:    number
  offset:   number
  limit:    number
  loading:  boolean
  error:    string | null
}

const initialState: CommentState = {
  comments: [],
  total:    0,
  offset:   1,
  limit:    20,
  loading:  false,
  error:    null,
}

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setComments(state, action: PayloadAction<{ comments: TrackComment[]; total: number; offset: number }>) {
      state.comments = action.payload.comments
      state.total    = action.payload.total
      state.offset   = action.payload.offset
    },
    appendComments(state, action: PayloadAction<{ comments: TrackComment[]; total: number; offset: number }>) {
      state.comments = [...state.comments, ...action.payload.comments]
      state.total    = action.payload.total
      state.offset   = action.payload.offset
    },
    addComment(state, action: PayloadAction<TrackComment>) {
      state.comments.unshift(action.payload)
      state.total += 1
    },
    removeComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter(c => c.commentId !== action.payload)
      state.total -= 1
    },
    updateCommentLike(state, action: PayloadAction<{ commentId: string; liked: boolean; numLikes: number }>) {
      const comment = state.comments.find(c => c.commentId === action.payload.commentId)
      if (comment) {
        comment.isLikedByUser = action.payload.liked
        comment.numLikes      = action.payload.numLikes
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setComments,
  appendComments,
  addComment,
  removeComment,
  updateCommentLike,
} = commentSlice.actions

export default commentSlice.reducer