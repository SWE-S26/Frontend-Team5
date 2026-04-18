import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  setLoading,
  setError,
  setComments,
  appendComments,
  addComment,
  removeComment,
  updateCommentLike,
} from "@/store/slices/commentSlice"
import {
  fetchTrackComments,
  fetchCommentReplies,
  postComment,
  likeComment,
  deleteComment,
} from "@/services/comment.service"
import { PostCommentPayload, TrackComment } from "@/types/comments.types"

export const useComments = () => {
  const dispatch = useAppDispatch()
  const { comments, total, offset, limit, loading, error } = useAppSelector(s => s.comments)

  const loadComments = async (trackId: string, reset = true) => {
    try {
      dispatch(setLoading(true))
      const currentOffset = reset ? 1 : offset
      const res = await fetchTrackComments(trackId, currentOffset, limit)
      if (reset) {
        dispatch(setComments({ comments: res.comments, total: res.total, offset: res.offset }))
      } else {
        dispatch(appendComments({ comments: res.comments, total: res.total, offset: res.offset }))
      }
    } catch (err: any) {
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const loadMore = (trackId: string) => {
    loadComments(trackId, false)
  }

  const submitComment = async (trackId: string, payload: PostCommentPayload) => {
    try {
      const comment = await postComment(trackId, payload)
      dispatch(addComment(comment)) // ← fixed: was TrackComment
      return comment
    } catch (err: any) {
      dispatch(setError(err.message))
    }
  }

  const toggleLike = async (commentId: string) => {
    try {
      const res = await likeComment(commentId)
      dispatch(updateCommentLike({ commentId, liked: res.liked, numLikes: res.numLikes }))
    } catch (err: any) {
      dispatch(setError(err.message))
    }
  }

  const removeCommentById = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      dispatch(removeComment(commentId))
    } catch (err: any) {
      dispatch(setError(err.message))
    }
  }

  return {
    comments,
    total,
    loading,
    error,
    hasMore: comments.length < total,
    loadComments,
    loadMore,
    submitComment,
    toggleLike,
    removeCommentById,
  }
}

export const useReplies = () => {
  const [replies,  setReplies]  = useState<TrackComment[]>([]) // ← fixed: was Comment[]
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoadingR] = useState(false)
  const [error,    setErrorR]   = useState<string | null>(null)

  const loadReplies = async (commentId: string, offset = 1, limit = 20) => {
    try {
      setLoadingR(true)
      const res = await fetchCommentReplies(commentId, offset, limit)
      setReplies(prev => offset === 1 ? res.replies : [...prev, ...res.replies])
      setTotal(res.total)
    } catch (err: any) {
      setErrorR(err.message)
    } finally {
      setLoadingR(false)
    }
  }

  return {
    replies,
    total,
    loading,
    error,
    hasMore: replies.length < total,
    loadReplies,
  }
}