import api from "@/lib/api"
import type {
  GetNotificationsResponse,
  UnreadCountResponse,
  MarkReadResponse,
  MarkAllReadResponse,
} from "@/types/notification.types"

export const notificationService = {

  // GET /api/notifications/v1
  getNotifications: (params?: { offset?: number; limit?: number; read?: boolean }) =>
    api.get<GetNotificationsResponse>("/api/notifications/v1", { params }),

  // GET /api/notifications/v1/unread-count
  getUnreadCount: () =>
    api.get<UnreadCountResponse>("/api/notifications/v1/unread-count"),

  // GET /api/notifications/v1/:notificationId
  getNotification: (notificationId: string) =>
    api.get<Notification>(`/api/notifications/v1/${notificationId}`),

  // PATCH /api/notifications/v1/:notificationId/read
  markAsRead: (notificationId: string) =>
    api.patch<MarkReadResponse>(`/api/notifications/v1/${notificationId}/read`),

  // PATCH /api/notifications/v1/read-all
  markAllAsRead: () =>
    api.patch<MarkAllReadResponse>("/api/notifications/v1/read-all"),
}