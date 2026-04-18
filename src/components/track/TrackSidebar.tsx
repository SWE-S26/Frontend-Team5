"use client"
import { PiInfo } from "react-icons/pi";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Avatar, Popover } from "antd";
import { BsFillPersonFill } from "react-icons/bs";
import FollowButton from "../ui/FollowButton";
import { useLikeTrack } from "@/hooks/useLikes";

interface TrackSidebarProps {
  trackId: string
}

export default function TrackSidebar({ trackId }: TrackSidebarProps) {
  const LikesCount   = useAppSelector((state) => state.track.likesCount)
  const RepostsCount = useAppSelector((state) => state.track.repostsCount)
  const [activeTab, setActiveTab] = useState("top");

  const { users, loadLikes } = useLikeTrack()

  useEffect(() => {
    loadLikes(trackId)
  }, [trackId])

  const SideTabs = [
    { href: "", label: "Top",   value: "top"   },
    { href: "", label: "First", value: "first" },
  ]

  return (
    <aside className="w-[340px] sticky top-20 h-fit flex flex-col gap-10 text-white">
      
      <section className="flex flex-col gap-3 mt-5">
        <div className="flex">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Fans</h2>
          <PiInfo className="mt-0.5 ml-1" />
        </div>

        <div className="flex text-sm pb-2">
          <TabsNavbar
            tabs={SideTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            textSize="text-md"
            className="flex text-white-smoke"
            tabsWrapperClassName="flex space-x-2"
          />
        </div>

        <p className="text-sm text-gray-400">
          {activeTab === "top"
            ? "Fans who have played this track the most:"
            : "Fans who played this track in the first 7 days:"}
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* RELATED TRACKS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">Related Tracks</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* ALBUMS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">In Albums</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-white/5 rounded animate-pulse" />
          <div className="h-10 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* PLAYLISTS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">In Playlists</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-white/5 rounded animate-pulse" />
          <div className="h-10 bg-white/5 rounded animate-pulse" />
        </div>
      </section>

      {/* Likes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">{LikesCount} Likes</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>

        <Avatar.Group className="w-100">
          {users.map((user, index) => (
            <Popover
              key={index}
              trigger="hover"
              placement="top"
              styles={{
                root: { padding: 0 },
                content: {
                  backgroundColor: "#111",
                  borderRadius: "8px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                  padding: 0,
                  overflow: "hidden",
                },
              }}
              content={
                <div style={{ width: 200, textAlign: "center", color: "#fff", padding: "20px 16px 16px", backgroundColor: "#111" }}>
                  <Avatar src={user.avatarUrl} size={110} style={{ marginBottom: 12 }} />
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{user.displayName}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "10px 0", fontSize: 13, color: "#aaa" }}>
                    <BsFillPersonFill className="w-5 h-5" />
                    <span>{user.followersCount} followers</span>
                  </div>

                  <FollowButton userId={user.userId} />
                </div>
              }
            >
              <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
            </Popover>
          ))}
        </Avatar.Group>
      </section>

      {/* Reposts */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">{RepostsCount} Reposts</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>
      </section>

    </aside>
  );
}