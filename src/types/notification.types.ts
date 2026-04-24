

    export type NotificationActivityType =
    | "track_liked"
    | "track_commented"
    | "track_reposted"
    | "user_followed"
    | "new_track"
    | "user_mentioned"

    export type NotificationFilterType =
    | "all"
    | "likes"
    | "reposts"
    | "follows"
    | "comments"

    // ─── Actor ───────────────────────────────────────────────────────────────────

    export interface NotificationActor {
    userId: string
    displayName: string
    avatarUrl: string | null
    }

    // ─── Target variants ──────────────────────────────────────────────────────────

    export interface TrackTarget {
    targetType: "track"
    targetId: string
    title: string
    }

    export interface CommentTarget {
    targetType: "comment"
    targetId: string
    trackId: string
    commentText: string
    mentionedUserProfileLink?: string // only present on user_mentioned
    }

    export interface UserTarget {
    targetType: "user"
    targetId: string
    }

    export type NotificationTarget = TrackTarget | CommentTarget | UserTarget

    // ─── Notification ─────────────────────────────────────────────────────────────

    export interface Notification {
    notificationId: string
    to: string
    read: boolean
    activityType: NotificationActivityType
    actor: NotificationActor
    target: NotificationTarget
    createdAt: string // ISO string
    }

    // ─── Filter → activityType mapping ───────────────────────────────────────────

    export const FILTER_TO_ACTIVITY: Record<
    NotificationFilterType,
    NotificationActivityType[] | null
    > = {
    all: null, // null = show everything
    likes: ["track_liked"],
    reposts: ["track_reposted"],
    follows: ["user_followed"],
    comments: ["track_commented", "user_mentioned"],
    }

    // ─── Display labels ───────────────────────────────────────────────────────────

    export const FILTER_LABELS: Record<NotificationFilterType, string> = {
    all: "All notifications",
    likes: "Likes",
    reposts: "Reposts",
    follows: "Follows",
    comments: "Comments",
    }

    export const FILTER_EMPTY_MESSAGES: Record<NotificationFilterType, string> = {
    all: "You don't have any notifications",
    likes: "You don't have any likes",
    reposts: "You don't have any reposts",
    follows: "You don't have any follows",
    comments: "You don't have any comments",
    }