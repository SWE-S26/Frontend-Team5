"use client"
import { PiInfo } from "react-icons/pi";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { useLikeTrack } from "@/hooks/useLikes";
import { useTrackRepostsList } from "@/hooks/useReposts";
import ProfilePopover from "../layout/track-cards/ProfilePopover";

import { useGetTrackAlbums, useGetTrackPlaylists } from "@/hooks/useTracks"
import PlaylistCard from "@/components/track/PlaylistCard";



interface TrackSidebarProps {
  trackId: string
}

export default function TrackSidebar({ trackId }: TrackSidebarProps) {
  const [activeTab, setActiveTab] = useState("top");

  const { users, total: LikesCount, loadLikes } = useLikeTrack()
  const { users: repostUsers, total: RepostsCount, loadReposts } = useTrackRepostsList(trackId)


  const { playlists: trackPlaylists, getTrackPlaylists } = useGetTrackPlaylists()
  const { albums: trackAlbums, getTrackAlbums } = useGetTrackAlbums()

  useEffect(() => {
    void getTrackPlaylists(trackId)
  }, [trackId, getTrackPlaylists])

  useEffect(() => {
    void getTrackAlbums(trackId)
  }, [trackId, getTrackAlbums])

  useEffect(() => {
    loadLikes(trackId)
  }, [trackId])

  useEffect(() => {
    loadReposts()
  }, [trackId])

  const SideTabs = [
    { href: "", label: "Top",   value: "top"   },
    { href: "", label: "First", value: "first" },
  ]

  return (
    <aside className="w-85 sticky top-20 h-fit flex flex-col gap-10 text-white">
      
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
          {trackAlbums.length === 0 ? (
            <p className="text-xs text-gray-500">Not in any albums</p>
          ) : (
            trackAlbums.map((album) => (
              <PlaylistCard key={album._id} playlist={album} />
            ))
          )}
        </div>
      </section>

      {/* PLAYLISTS */}
      
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">In Playlists</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>

        <div className="flex flex-col gap-3">
          {trackPlaylists.length === 0 ? (
            <p className="text-xs text-gray-500">Not in any playlists</p>
          ) : (
            trackPlaylists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))
          )}
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
            <ProfilePopover
              key={user.userId}
              id={`like-${user.userId}`}
              artistName={user.displayName}
              followCount={user.followersCount}
              profileImgLink={user.avatarUrl}
            >
              <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
            </ProfilePopover>
          ))}
        </Avatar.Group>
      </section>

      {/* Reposts */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">{RepostsCount} Reposts</h2>
          <button className="text-xs text-gray-500 hover:text-white cursor-pointer">View all</button>
        </div>

        <Avatar.Group className="w-100">
          {repostUsers.map((user, index) => (
            <ProfilePopover
              key={user.userId}
              id={`repost-${user.userId}`}
              artistName={user.displayName}
              followCount={user.followersCount}
              profileImgLink={user.avatarUrl}
            >
              <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
            </ProfilePopover>
          ))}
        </Avatar.Group>
      </section>

    </aside>
  );
}