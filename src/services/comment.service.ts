import api from "@/lib/api";
import { MentionUser } from "@/types/comments.types"


import {
  TrackComment,
  CommentsResponse,
  RepliesResponse,
  PostCommentPayload,
  LikeCommentResponse,
} from "@/types/comments.types";

export const fetchTrackComments = async (
  trackId: string,
  offset = 1,
  limit = 50,
): Promise<CommentsResponse> => {
  const res = await api.get(
    `/api/public/engagement/tracks/v1/${trackId}/comments`,
    { params: { offset, limit } },
  );
  return res.data;
};

export const fetchCommentReplies = async (
  commentId: string,
  offset = 1,
  limit = 20,
): Promise<RepliesResponse> => {
  const res = await api.get(
    `/api/public/engagement/comments/v1/${commentId}/replies`,
    { params: { offset, limit } },
  );
  return res.data;
};

export const postComment = async (
  trackId: string,
  payload: PostCommentPayload,
): Promise<TrackComment> => {
  const res = await api.post(
    `/api/engagement/tracks/v1/${trackId}/comments`,
    payload,
  );
  return res.data;
};

export const likeComment = async (
  commentId: string,
): Promise<LikeCommentResponse> => {
  const res = await api.post(`/api/engagement/comments/v1/${commentId}/like`);
  return res.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/api/engagement/comments/v1/${commentId}`);
};

// stateless versions — no redux, just return data/errors directly

export const fetchTrackCommentsStateless = async (
  trackId: string,
  offset = 1,
  limit = 50,
): Promise<CommentsResponse> => {
  const res = await api.get(
    `/api/public/engagement/tracks/v1/${trackId}/comments`,
    { params: { offset, limit } },
  );
  return res.data;
};

export const postCommentStateless = async (
  trackId: string,
  payload: PostCommentPayload,
): Promise<TrackComment> => {
  const res = await api.post(
    `/api/engagement/tracks/v1/${trackId}/comments`,
    payload,
  );
  return res.data;
};

export const fetchMentionSuggestions = async (): Promise<MentionUser[]> => {
  const res = await api.get("/api/engagement/mentions/v1/followers")
  return res.data
}