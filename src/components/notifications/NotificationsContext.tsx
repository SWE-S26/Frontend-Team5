"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/notification.service";
import type { Notification, NotificationFilterType } from "@/types/notification.types";
import { FILTER_TO_ACTIVITY as FILTER_MAP } from "@/types/notification.types";

const LIMIT = 20;

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  filter: NotificationFilterType;
  setFilter: (f: NotificationFilterType) => void;
  loadMore: () => void;
  markVisibleAsRead: (ids: string[]) => void;
  markLoadedAsRead: () => void;
  addIncoming: (n: Notification) => void;
  incrementUnread: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(1);
  const [filter, setFilter] = useState<NotificationFilterType>("all");

  // ── Fetch unread count once on mount ──────────────────────────────────────
  useEffect(() => {
    notificationService
      .getUnreadCount()
      .then((res) => setUnreadCount(res.data.unreadCount))
      .catch(console.error);
  }, []);

  // ── Fetch notifications list ───────────────────────────────────────────────
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

  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  // ── Mark visible as read (popup) ──────────────────────────────────────────
  const markVisibleAsRead = useCallback(
    async (ids: string[]) => {
      const unreadVisible = notifications.filter((n) => ids.includes(n.notificationId) && !n.read);
      if (unreadVisible.length === 0) return;

      await Promise.all(unreadVisible.map((n) => notificationService.markAsRead(n.notificationId)));
      setUnreadCount((prev) => Math.max(0, prev - unreadVisible.length));
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

  // ── Mark loaded notifications as read (notifications page) ────────────────
  const markLoadedAsRead = useCallback(async () => {
    const unreadLoaded = notifications.filter((n) => !n.read);
    if (unreadLoaded.length === 0) return;

    try {
      // one single request instead of one per notification
      const res = await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark loaded as read:", err);
    }
  }, [notifications]);

  // ── Load more ─────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    fetchNotifications(offset + 1, false);
  }, [offset, fetchNotifications]);

  // ── Socket helpers ────────────────────────────────────────────────────────
  const addIncoming = useCallback((n: Notification) => {
    setNotifications((prev) => {
      // don't add if already in the list
      if (prev.some((existing) => existing.notificationId === n.notificationId)) return prev;
      return [n, ...prev];
    });
    setUnreadCount((prev) => prev + 1);
  }, []);

  const incrementUnread = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const hasMore = notifications.length < total;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        hasMore,
        filter,
        setFilter,
        loadMore,
        markVisibleAsRead,
        markLoadedAsRead,
        addIncoming,
        incrementUnread,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used inside NotificationsProvider");
  return ctx;
}
