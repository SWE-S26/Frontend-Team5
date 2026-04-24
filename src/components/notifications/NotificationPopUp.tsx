    "use client"

    import Link from "next/link"
    import NotificationItem, { MOCK_NOTIFICATIONS } from "./NotificationItem"
    import type { Notification } from "@/types/notification.types"

    // ─── Props ────────────────────────────────────────────────────────────────────

    interface NotificationPopupProps {
    notifications?: Notification[]
    onClose: () => void
    }

    // ─── Component ────────────────────────────────────────────────────────────────

    export default function NotificationPopup({
    notifications = MOCK_NOTIFICATIONS, // swap for real data later
    onClose,
    }: NotificationPopupProps) {
    const isEmpty = notifications.length === 0

    return (
        <div className="w-[450px] bg-chinese-black border border-silver/20 rounded-sm shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-silver/20">
            <h2 className="text-white-smoke font-bold text-base">Notifications</h2>
            <Link
            href="/settings/notifications"
            onClick={onClose}
            className="text-white-smoke font-bold text-sm hover:text-silver transition-colors"
            >
            Settings
            </Link>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto no-scrollbar">
            {isEmpty ? (
            <p className="text-silver text-sm text-center py-10">
                No notifications
            </p>
            ) : (
            notifications.map((n) => (
                <NotificationItem
                key={n.notificationId}
                notification={n}
                showFollowBack
                />
            ))
            )}
        </div>

        {/* Footer */}
        <div className="border-t border-silver/20 py-3 text-center">
            <Link
            href="/notifications"
            onClick={onClose}
            className="text-white-smoke font-bold text-sm hover:text-silver transition-colors"
            >
            View all notifications
            </Link>
        </div>

        </div>
    )
    }
