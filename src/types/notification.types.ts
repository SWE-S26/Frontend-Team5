export type ActivityType =
  | "track_liked"
  | "track_commented"
  | "track_reposted"
  | "user_followed"
  | "user_mentioned"
  | "new_track"

export type NotificationFilterType =
  | "all"
  | "likes"
  | "reposts"
  | "follows"
  | "comments"

export const FILTER_LABELS: Record<NotificationFilterType, string> = {
  all:      "All activity",
  likes:    "Likes",
  reposts:  "Reposts",
  follows:  "Follows",
  comments: "Comments & mentions",
}

export const FILTER_TO_ACTIVITY: Record<NotificationFilterType, ActivityType[]> = {
  all:      ["track_liked", "track_commented", "track_reposted", "user_followed", "user_mentioned", "new_track"],
  likes:    ["track_liked"],
  reposts:  ["track_reposted"],
  follows:  ["user_followed"],
  comments: ["track_commented", "user_mentioned"],
}

export const FILTER_EMPTY_MESSAGES: Record<NotificationFilterType, string> = {
  all:      "You have no notifications yet",
  likes:    "No likes yet",
  reposts:  "No reposts yet",
  follows:  "No new followers yet",
  comments: "No comments or mentions yet",
}

// ─── Target shapes ────────────────────────────────────────────────────────────

export interface TrackTarget {
  targetType: "track"
  targetId:   string
  title:      string
}

export interface CommentTarget {
  targetType:               "comment"
  targetId:                 string
  trackId:                  string
  commentText:              string
  mentionedUserProfileLink?: string
}

export interface UserTarget {
  targetType: "user"
  targetId:   string
}

export type NotificationTarget = TrackTarget | CommentTarget | UserTarget

// ─── Actor ────────────────────────────────────────────────────────────────────

export interface NotificationActor {
  userId:      string
  displayName: string
  avatarUrl?:  string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  notificationId: string
  to:             string
  read:           boolean
  activityType:   ActivityType
  actor:          NotificationActor
  target:         NotificationTarget
  createdAt:      string
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface GetNotificationsResponse {
  total:         number
  offset:        number
  limit:         number
  notifications: Notification[]
}

export interface UnreadCountResponse {
  unreadCount: number
}

export interface MarkReadResponse {
  notificationId: string
  read:           true
  unreadCount:    number
}

export interface MarkAllReadResponse {
  unreadCount: number
}