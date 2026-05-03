import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/notification.service";
import type { Notification, NotificationFilterType } from "@/types/notification.types";
import { FILTER_TO_ACTIVITY as FILTER_MAP } from "@/types/notification.types";

const LIMIT = 20;

export function useNotifications(filter: NotificationFilterType = "all") {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(1);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(
    async (pageOffset = 1, replace = true) => {
      setLoading(true);
      try {
        const res = await notificationService.getNotifications({
          offset: pageOffset,
          limit: LIMIT,
        });
        const allowed = FILTER_MAP[filter];
        const filtered = res.data.notifications.filter((n) => allowed.includes(n.activityType));

        setNotifications((prev) => (replace ? filtered : [...prev, ...filtered]));
        setTotal(res.data.total);
        setOffset(pageOffset);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  // ── Mark visible as read (popup) ───────────────────────────────────────────
  const markVisibleAsRead = useCallback(
    async (visibleIds: string[]) => {
      const unreadVisible = notifications.filter(
        (n) => visibleIds.includes(n.notificationId) && !n.read
      );
      if (unreadVisible.length === 0) return;

      await Promise.all(unreadVisible.map((n) => notificationService.markAsRead(n.notificationId)));
      setNotifications((prev) =>
        prev.map((n) =>
          unreadVisible.some((u) => u.notificationId === n.notificationId)
            ? { ...n, read: true }
            : n
        )
      );
    },
    [notifications]
  );

  // ── Mark all as read ───────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  // ── Load more ──────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    fetchNotifications(offset + 1, false);
  }, [offset, fetchNotifications]);

  // ── Add incoming socket notification ───────────────────────────────────────
  const addIncoming = useCallback((n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const hasMore = notifications.length < total;

  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  return {
    notifications,
    loading,
    hasMore,
    markVisibleAsRead,
    markAllAsRead,
    loadMore,
    addIncoming,
  };
}
