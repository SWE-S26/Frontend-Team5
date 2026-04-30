"use client";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toastBus } from "@/lib/sockets/toastBus";
import ProfileImage from "@/components/ui/ProfileImage"
import { DEFAULT_PROFILE_IMAGE_URL } from "@/store/slices/authSlice"
import Link from "next/link";

type NotificationPayload = {
  notificationId: string;
  activityType: "track_liked" | "track_commented" | "track_reposted" | "user_followed" | "user_mentioned" | "new_track";
  actor: { userId: string; displayName: string; avatarUrl: string };
  target: { title?: string; commentText?: string };
  createdAt: string;
};

type Toast = NotificationPayload & { id: string };

const MESSAGES: Record<string, (actor: string) => string> = {
  track_liked:     (a) => `${a} liked your track`,
  track_commented: (a) => `${a} commented on your track`,
  track_reposted:  (a) => `${a} reposted your track`,
  user_followed:   (a) => `${a} has started following you`,
  user_mentioned:  (a) => `${a} mentioned you in a comment`,
  new_track:       (a) => `${a} uploaded a new track`,
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff <= 0) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastBus.register((data: NotificationPayload) => {
      const id = Date.now().toString();
      setToasts((prev) => [{ ...data, id }, ...prev]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200000);
    });
  }, []);

  return (
    <div className="fixed top-20 right-2 left-2 sm:left-auto sm:right-4 sm:w-85 z-9999 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-off-black border border-white-smoke/20 rounded-md px-3 py-3 w-full shadow-xl animate-slide-in"
        >
            <Link
            href={`/profile/${toast.actor.userId}`}
            className="no-underline hover:opacity-70 transition-opacity"
            >
              <ProfileImage
                src={
                  !toast.actor.avatarUrl || toast.actor.avatarUrl === DEFAULT_PROFILE_IMAGE_URL
                    ? null
                    : toast.actor.avatarUrl
                }
                alt={toast.actor.displayName}
                width={36}
                height={36}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
              />
            </Link>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold m-0 leading-snug">
              <Link
                href={`/profile/${toast.actor.userId}`}
                className="no-underline hover:opacity-70 transition-opacity text-white-smoke"
              >
                {toast.actor.displayName}
              </Link>
              {" "}
              <span className="font-normal text-white-smoke/80">
                {MESSAGES[toast.activityType]?.(toast.actor.displayName).replace(toast.actor.displayName, "")}
              </span>
            </p>
            {(toast.target?.title || toast.target?.commentText) && (
              <p className="text-xs text-white/50 mt-0.5 m-0 truncate">
                {toast.target.title || toast.target.commentText}
              </p>
            )}
            <p className="text-xs text-white-smoke/30 mt-1 m-0">
              {timeAgo(toast.createdAt)}
            </p>
          </div>

          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-white-smoke/40 hover:text-white-smoke/80 text-xl leading-none bg-transparent border-none cursor-pointer shrink-0"
          >
            <MdClose />
          </button>
        </div>
      ))}
    </div>
  );
}