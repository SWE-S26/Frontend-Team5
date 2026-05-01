export interface TrackComment {
  commentId:     string
  userId:        string
  displayName:   string
  avatarUrl:     string
  content:       string
  timestamp:     number
  numLikes:      number
  replyCount:    number
  isLikedByUser: boolean
  isOwnComment:  boolean
  mentionedUserProfileLink?: string
  mentionedUserId?:         string
  createdAt:     string
}

export interface CommentsResponse {
  total:    number
  offset:   number
  limit:    number
  comments: TrackComment[]
}

export interface RepliesResponse {
  total:   number
  offset:  number
  limit:   number
  replies: TrackComment[]
}

export interface PostCommentPayload {
  content:          string
  timestamp:        number
  parentCommentId?: string
  mentionedUserId?: string
}

export interface LikeCommentResponse {
  liked:    boolean
  numLikes: number
}

export interface MentionUser {
  userId:      string
  displayName: string
  avatarUrl:   string
  profileLink: string
}