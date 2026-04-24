    "use client"


    import { useRef, useState, useEffect } from "react"
    import { SlBell } from "react-icons/sl"
    import NotificationPopup from "@/components/notifications/NotificationPopUp"
    import type { Notification } from "@/types/notification.types"

    // ─── Props ────────────────────────────────────────────────────────────────────

    interface NotificationBellProps {
    notifications?: Notification[]
    }

    export default function NotificationBell({
    notifications = [],
    }: NotificationBellProps) {
    const [isOpen, setIsOpen]   = useState(false)
    const containerRef          = useRef<HTMLDivElement>(null)
    const hasUnread             = notifications.some((n) => !n.read)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>

        <button
            data-testid="notifications"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center cursor-pointer relative"
        >
            <SlBell />

            {/* Orange dot — top center of the bell */}
            {hasUnread && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-anger border-2 border-chinese-black" />
            )}
        </button>

        {isOpen && (
            <div className="absolute right-0 top-9 z-[9999]">
            <NotificationPopup
                notifications={notifications}
                onClose={() => setIsOpen(false)}
            />
            </div>
        )}

        </div>
    )
    }
