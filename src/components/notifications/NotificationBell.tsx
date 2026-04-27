"use client"

import { useRef, useState, useEffect } from "react"
import { SlBell } from "react-icons/sl"
import NotificationPopup from "@/components/notifications/NotificationPopUp"
import { useNotificationsContext } from "@/components/notifications/NotificationsContext"

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef        = useRef<HTMLDivElement>(null)

  const { notifications, unreadCount, markVisibleAsRead } = useNotificationsContext()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleOpen() {
    setIsOpen((prev) => {
      if (!prev) {
        const visibleIds = notifications.slice(0, 5).map((n) => n.notificationId)
        markVisibleAsRead(visibleIds)
      }
      return !prev
    })
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        data-testid="notifications"
        onClick={handleOpen}
        className="text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center cursor-pointer relative"
      >
        <SlBell />
        {unreadCount > 0 && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 min-w-[18px] h-[18px] px-1 rounded-full bg-anger border-2 border-chinese-black flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-[9999]">
          <NotificationPopup
            notifications={notifications.slice(0, 5)}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}