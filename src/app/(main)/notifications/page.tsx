    "use client"

    // src/app/(main)/notifications/page.tsx

    import { useState } from "react"
    import Link from "next/link"
    import NotificationItem, { MOCK_NOTIFICATIONS } from "@/components/notifications/NotificationItem"
    import NotificationFilterDropdown from "@/components/notifications/NotificationFilterDropdown"
    import User from "@/components/layout/User"
    import {
    type NotificationFilterType,
    FILTER_TO_ACTIVITY,
    FILTER_EMPTY_MESSAGES,
    } from "@/types/notification.types"
    import type { SocialUser } from "@/types/social.types"

    // ─── Mock recent followers (remove when API is wired) ─────────────────────────

    const MOCK_FOLLOWERS: SocialUser[] = [
    {
        userId:         "u2",
        displayName:    "Guardian 2004930",
        profileImgLink: "https://i.pravatar.cc/48?img=5",
        followersCount: 1,
        trackCount:     2,
        isFollowed:     false,
    },
    {
        userId:         "u1",
        displayName:    "lujina shehata",
        profileImgLink: "https://i.pravatar.cc/48?img=1",
        followersCount: 1,
        trackCount:     0,
        isFollowed:     true,
    },
    ]

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

    function RecentFollowersSidebar({ followers }: { followers: SocialUser[] }) {
    return (
        <aside className="hidden md:block md:w-[27.75%] shrink-0">

        <div className="flex items-center justify-between mb-4">
            <h2 className="text-white-smoke text-[10px] font-bold  uppercase">
            Recent Followers
            </h2>
            <Link
            href="/library/following"
            className="text-silver text-xs hover:text-white-smoke transition-colors"
            >
            View all
            </Link>
        </div>

        {followers.length === 0 ? (
            <p className="text-silver text-sm">No recent followers yet.</p>
        ) : (
            followers.map((user) => (
            <User key={user.userId} user={user} />
            ))
        )}

        {/* Footer links */}
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
    const [filter, setFilter] = useState<NotificationFilterType>("all")

    const allowedTypes = FILTER_TO_ACTIVITY[filter]
    const filtered = allowedTypes === null
        ? MOCK_NOTIFICATIONS
        : MOCK_NOTIFICATIONS.filter((n) => allowedTypes.includes(n.activityType))

    return (
        <div className="flex justify-between">

        {/* ── Main column — matches home page 68% ── */}
        <div className="w-full md:w-[68%]">

            <div className="flex items-center justify-between mb-6">
            <h1 className="text-white-smoke text-3xl font-bold">Notifications</h1>
            <NotificationFilterDropdown selected={filter} onChange={setFilter} />
            </div>

            {filtered.length === 0 ? (
            <EmptyState filter={filter} onShowAll={() => setFilter("all")} />
            ) : (
            <div className="flex flex-col divide-y divide-silver/10">
                {filtered.map((n) => (
                <NotificationItem
                    key={n.notificationId}
                    notification={n}
                    showFollowBack
                    showMore
                />
                ))}
            </div>
            )}

        </div>

        {/* ── Sidebar — matches home page 27.75% ── */}
        <RecentFollowersSidebar followers={MOCK_FOLLOWERS} />

        </div>
    )
    }