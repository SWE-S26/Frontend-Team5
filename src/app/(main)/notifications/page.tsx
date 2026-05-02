"use client"

import { useEffect } from "react"
import Link from "next/link"
import NotificationItem from "@/components/notifications/NotificationItem"
import NotificationFilterDropdown from "@/components/notifications/NotificationFilterDropdown"
import User from "@/components/layout/User"
import { useNotificationsContext } from "@/components/notifications/NotificationsContext"
import { useGetFollowers } from "@/hooks/useSocial"
import { useAppSelector } from "@/store/hooks"
import {
  type NotificationFilterType,
  FILTER_EMPTY_MESSAGES,
} from "@/types/notification.types"
import type { SocialUser } from "@/types/social.types"

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  filter,
  onShowAll,
}: {
  filter:    NotificationFilterType
  onShowAll: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5">
      <p className="text-white-smoke font-bold text-base">
        {FILTER_EMPTY_MESSAGES[filter]}
      </p>
      {filter !== "all" && (
        <button
          onClick={onShowAll}
          className="px-5 py-2.5 bg-white-smoke text-chinese-black font-bold text-sm rounded hover:bg-white-smoke/80 transition-colors cursor-pointer"
        >
          Show all notifications
        </button>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function RecentFollowersSidebar() {
  const userId                          = useAppSelector((state) => state.auth.userId)
  const { getFollowers, followers, loading } = useGetFollowers()

  useEffect(() => {
    if (userId) getFollowers(userId)
  }, [userId])

  const recentFollowers = (followers ?? []).slice(0, 5)

  return (
    <aside className="hidden md:block md:w-[27.75%] shrink-0">
      <div className="flex items-center justify-between mb-4">
        <Link
        href={`/profile/${userId}/followers`}
        className="text-white-smoke text-xs font-bold uppercase hover:text-silver transition-colors"
        >
        Recent Followers
        </Link>
        <Link
          href={`/profile/${userId}/followers`}
          className="text-silver text-xs hover:underline transition-all"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-silver text-sm">Loading...</p>
      ) : recentFollowers.length === 0 ? (
        <p className="text-silver text-sm">No recent followers yet.</p>
      ) : (
        recentFollowers.map((user) => (
          <User key={user.userId} user={user} />
        ))
      )}

      <div className="mt-8 text-xs text-silver leading-6">
        {[
          "Legal", "Privacy", "Cookie Policy", "Cookie Manager",
          "Imprint", "Artist Resources", "Newsroom", "Charts",
          "Transparency Reports",
        ].map((label, i, arr) => (
          <span key={label}>
            <span className="hover:text-white-smoke cursor-pointer">{label}</span>
            {i < arr.length - 1 && " · "}
          </span>
        ))}
      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    hasMore,
    filter,
    setFilter,
    markLoadedAsRead,
    loadMore,
  } = useNotificationsContext()

  const hasUnread = notifications.some((n) => !n.read)

  useEffect(() => {
    markLoadedAsRead()
  }, [])

  async function handleLoadMore() {
    await loadMore()
    markLoadedAsRead()
  }

  return (
    <div className="flex justify-between px-4 pb-4 md:px-0 md:pb-0">

      <div className="w-full md:w-[68%]">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white-smoke text-3xl font-bold">Notifications</h1>
          <div className="flex items-center gap-3">
            {hasUnread && (
              <button
                onClick={markLoadedAsRead}
                className="text-sm text-silver hover:text-white-smoke transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
            <NotificationFilterDropdown selected={filter} onChange={setFilter} />
          </div>
        </div>

        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-silver text-sm">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState filter={filter} onShowAll={() => setFilter("all")} />
        ) : (
          <>
            <div className="flex flex-col divide-y divide-silver/10">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.notificationId}
                  notification={n}
                  showFollowBack
                  showMore
                />
              ))}
            </div>

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-4 text-sm text-silver hover:text-white-smoke transition-colors border-t border-silver/10 mt-2"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
          </>
        )}

      </div>

      <RecentFollowersSidebar />

    </div>
  )
}