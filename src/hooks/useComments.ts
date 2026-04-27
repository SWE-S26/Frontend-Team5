import { useState } from "react";

import {
  fetchTrackComments,
  fetchCommentReplies,
  postComment,
  likeComment,
  deleteComment,
  fetchTrackCommentsStateless,
  postCommentStateless,
} from "@/services/comment.service";
import { PostCommentPayload, TrackComment } from "@/types/comments.types";



export const useStatelessComments = () => {
  const [comments, setComments] = useState<TrackComment[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(1);
  const [limit] = useState(20);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async (trackId: string, reset = true) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 1 : offset;
      const res = await fetchTrackCommentsStateless(
        trackId,
        currentOffset,
        limit,
      );

      if (reset) {
        setComments(res.comments);
      } else {
        setComments((prev) => [...prev, ...res.comments]);
      }

      setTotal(res.total);
      setOffset(res.offset);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (trackId: string) => {
    loadComments(trackId, false);
  };

  const submitComment = async (
    trackId: string,
    payload: PostCommentPayload,
  ) => {
    try {
      const comment = await postCommentStateless(trackId, payload);
      setComments((prev) => [comment, ...prev]);
      setTotal((prev) => prev + 1);
      return comment;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleLike = async (commentId: string) => {
    try {
      const res = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId
            ? { ...c, isLikedByUser: res.liked, numLikes: res.numLikes }
            : c,
        ),
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

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
  };
};

export const useReplies = () => {
  const [replies, setReplies] = useState<TrackComment[]>([]); // ← fixed: was Comment[]
  const [total, setTotal] = useState(0);
  const [loading, setLoadingR] = useState(false);
  const [error, setErrorR] = useState<string | null>(null);

  const loadReplies = async (commentId: string, offset = 1, limit = 20) => {
    try {
      setLoadingR(true);
      const res = await fetchCommentReplies(commentId, offset, limit);
      setReplies((prev) =>
        offset === 1 ? res.replies : [...prev, ...res.replies],
      );
      setTotal(res.total);
    } catch (err: any) {
      setErrorR(err.message);
    } finally {
      setLoadingR(false);
    }
  };

  return {
    replies,
    total,
    loading,
    error,
    hasMore: replies.length < total,
    loadReplies,
  };
};