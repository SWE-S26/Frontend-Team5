"use client"
import { useState } from "react"
import Link from "next/link"
import { FaUser } from "react-icons/fa"
import { IoIosMore } from "react-icons/io"
import { formatDistanceToNow } from "date-fns"
import FollowButton from "@/components/ui/FollowButton"
import MoreDropdown from "@/components/ui/MoreDropdown"
import BlockPopUp from "@/components/messages/conversation/BlockPopUp"
import ReportPopUp from "@/components/report/ReportPopUp"
import ProfileImage from "@/components/ui/ProfileImage"
import { DEFAULT_PROFILE_IMAGE_URL } from "@/store/slices/authSlice"
import { useBlockUser, useUnblockUser } from "@/hooks/useSocial"
import type { Notification } from "@/types/notification.types"
import { Ban } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNotificationText(n: Notification): string {
  const { activityType, target } = n
  switch (activityType) {
    case "track_liked":
      return `liked your track "${(target as any).title}"`
    case "track_reposted":
      return `reposted your track "${(target as any).title}"`
    case "new_track":
      return `uploaded a new track "${(target as any).title}"`
    case "track_commented":
      return `commented "${(target as any).commentText}" on your track`
    case "user_mentioned":
      return `mentioned you in a comment "${(target as any).commentText}"`
    case "user_followed":
      return "started following you"
    default:
      return ""
  }
}

function getTargetHref(n: Notification): string | null {
  const { activityType, target } = n
  switch (activityType) {
    case "track_liked":
    case "track_reposted":
    case "new_track":
      return `/tracks/${(target as any).targetId}`
    case "track_commented":
    case "user_mentioned":
      return `/tracks/${(target as any).trackId}`
    case "user_followed":
      return `/profile/${(target as any).targetId}`
    default:
      return null
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification:    Notification
  showFollowBack?: boolean
  showMore?:       boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationItem({
  notification,
  showFollowBack = false,
  showMore       = false,
}: NotificationItemProps) {
  const { actor, activityType, createdAt, read } = notification
  const text     = getNotificationText(notification)
  const href     = getTargetHref(notification)
  const isFollow = activityType === "user_followed"
  const timeAgo  = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  const [isBlocked, setIsBlocked] = useState(notification.isBlockingActor ?? false)
  const [isBlockOpen,  setIsBlockOpen]  = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const { blockUser }   = useBlockUser()
  const { unblockUser } = useUnblockUser()

  const moreItems = [
    {
      label: isBlocked ? `Unblock ${actor.displayName}` : `Block ${actor.displayName}`,
      icon: isBlocked ? <Ban className="w-4 h-4" /> : undefined,
      onClick: async () => {
        if (isBlocked) {
          await unblockUser(actor.userId)
          setIsBlocked(false)
        } else {
          setIsBlockOpen(true)
        }
      },
    },
    { label: `Report ${actor.displayName}`, onClick: () => setIsReportOpen(true) },
  ]

  async function handleBlockConfirm() {
    await blockUser(actor.userId)
    setIsBlocked(true)
    setIsBlockOpen(false)
  }

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3 hover:bg-off-black/40 transition-colors">

        {/* Avatar with unread dot on top-left */}
        <div className="relative shrink-0 mt-0.5">
          <Link href={`/profile/${actor.userId}`}>
            <ProfileImage
              src={
                !actor.avatarUrl || actor.avatarUrl === DEFAULT_PROFILE_IMAGE_URL
                  ? null
                  : actor.avatarUrl
              }
              alt={actor.displayName}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover"
            />
          </Link>
          {!read && (
            <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-brilliant-orange border-2 border-chinese-black" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug">
            <Link href={`/profile/${actor.userId}`} className="font-bold text-white-smoke">
              {actor.displayName}
            </Link>
            {" "}
            {href ? (
              <Link href={href} className="text-silver">
                {text}
              </Link>
            ) : (
              <span className="text-silver">{text}</span>
            )}
          </p>

          <div className="flex items-center gap-1 mt-1">
            <FaUser className="text-silver w-3 h-3" />
            <span className="text-xs text-silver">{timeAgo}</span>
          </div>
        </div>

        {/* Follow back — uses isFollowingActor to show correct initial state */}
        {isFollow && showFollowBack && (
          <div className="shrink-0 self-center">
            <FollowButton
              userId={actor.userId}
              initialIsFollowing={notification.isFollowingActor ?? false}
            />
          </div>
        )}

        {/* ··· */}
        {showMore && (
          <div className="shrink-0 self-center">
            <MoreDropdown
              trigger={
                <button className="text-white-smoke bg-off-black hover:text-white-smoke text-xl px-2 py-1 rounded transition-colors cursor-pointer">
                  <IoIosMore />
                </button>
              }
              items={moreItems}
              width="w-52"
            />
          </div>
        )}

      </div>

      <BlockPopUp
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        username={actor.displayName}
        onConfirm={handleBlockConfirm}
      />
      <ReportPopUp
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        username={actor.displayName}
        violatorId={actor.userId}
        violatorType="user"
      />
    </>
  )
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notificationId: "1",
    isFollowingActor: false,
    isBlockingActor: false,
    to: "me",
    read: false,
    activityType: "track_liked",
    actor: { userId: "u1", displayName: "lujina shehata", avatarUrl: "https://i.pravatar.cc/48?img=1" },
    target: { targetType: "track", targetId: "t1", title: "test" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    notificationId: "2",
    isFollowingActor: true,
    isBlockingActor: false,
    to: "me",
    read: false,
    activityType: "track_commented",
    actor: { userId: "u1", displayName: "lujina shehata", avatarUrl: "https://i.pravatar.cc/48?img=1" },
    target: { targetType: "comment", targetId: "c1", trackId: "t1", commentText: "oops" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    notificationId: "3",
    isFollowingActor: false,
    isBlockingActor: false,
    to: "me",
    read: true,
    activityType: "user_followed",
    actor: { userId: "u2", displayName: "Guardian 2004930", avatarUrl: "https://i.pravatar.cc/48?img=5" },
    target: { targetType: "user", targetId: "me" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    notificationId: "4",
    isFollowingActor: true,
    isBlockingActor: false,
    to: "me",
    read: true,
    activityType: "track_reposted",
    actor: { userId: "u1", displayName: "lujina shehata", avatarUrl: "https://i.pravatar.cc/48?img=1" },
    target: { targetType: "track", targetId: "t1", title: "test" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    notificationId: "5",
    isFollowingActor: true,
    isBlockingActor: false,
    to: "me",
    read: true,
    activityType: "new_track",
    actor: { userId: "u1", displayName: "lujina shehata", avatarUrl: "https://i.pravatar.cc/48?img=1" },
    target: { targetType: "track", targetId: "t2", title: "New Track dsdsewfaeblhaewfbnolaef" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
]