"use client"
import { PiInfo } from "react-icons/pi";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "antd";
import { useLikeTrack } from "@/hooks/useLikes";
import { useTrackRepostsList } from "@/hooks/useReposts";
import ProfilePopover from "../layout/track-cards/ProfilePopover";
import { useGetTrackAlbums, useGetTrackPlaylists, useGetTrackStats } from "@/hooks/useTracks"
import PlaylistCard from "@/components/track/PlaylistCard";
import FanCard from "./FanCard";
import LeaderboardActions from "./LeaderboardActions";

import { profileService } from "@/services/profile.service";
import { GetProfileResponse } from "@/types/profile.types";

interface TrackSidebarProps {
  trackId: string;
  track: any;
  onRepeatPlay?: () => void;
}

export default function TrackSidebar({ trackId,   track, onRepeatPlay }: TrackSidebarProps) {
  const [activeTab, setActiveTab] = useState("top");

  const { users, total: LikesCount, loadLikes } = useLikeTrack()
  const { users: repostUsers, total: RepostsCount, loadReposts } = useTrackRepostsList(trackId)
  const { playlists: trackPlaylists, getTrackPlaylists, loading: playlistsLoading } = useGetTrackPlaylists()
  const { albums: trackAlbums, getTrackAlbums } = useGetTrackAlbums()
  const { topFans, firstFans, loading: fansLoading, getTrackStats } = useGetTrackStats()
  const [userProfiles, setUserProfiles] = useState<Record<string, GetProfileResponse>>({})
  const [followOverrides, setFollowOverrides] = useState<Record<string, boolean>>({})
  const inFlightIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!trackId) return
    void getTrackPlaylists(trackId)
    void getTrackAlbums(trackId)
    loadLikes(trackId)
    loadReposts()
    void getTrackStats(trackId)
  }, [trackId])

  const sidebarUserIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...users.map((user) => user.userId),
          ...repostUsers.map((user) => user.userId),
        ].filter(Boolean)),
      ),
    [users, repostUsers],
  )

  useEffect(() => {
    const missingIds = sidebarUserIds.filter(
      (id) => !userProfiles[id] && !inFlightIdsRef.current.has(id),
    )
    if (missingIds.length === 0) return

    missingIds.forEach((id) => inFlightIdsRef.current.add(id))

    let cancelled = false

    void (async () => {
      const BATCH_SIZE = 3
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))
      for (let start = 0; start < missingIds.length; start += BATCH_SIZE) {
        const batch = missingIds.slice(start, start + BATCH_SIZE)
        const results = await Promise.all(
          batch.map(async (id) => {
            try {
              const data = await profileService.getProfileAuthCached(id)
              return data
            } catch {
              return null
            }
          }),
        )

        if (cancelled) return

        setUserProfiles((prev) => {
          const next = { ...prev }
          batch.forEach((id, index) => {
            const profile = results[index]
            if (profile) next[id] = profile
            inFlightIdsRef.current.delete(id)
          })
          return next
        })

        if (start + BATCH_SIZE < missingIds.length) {
          await delay(250)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sidebarUserIds, userProfiles])

  const SideTabs = [
    { href: "", label: "Top", value: "top" },
    { href: "", label: "First", value: "first" },
  ]

  const activeFans = activeTab === "top" ? topFans : firstFans

  return (
    <aside className="w-85 sticky top-20 h-fit flex flex-col gap-10 text-white">

      <section className="flex flex-col gap-3 mt-5">
        <div className="flex">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white-smoke">Fans</h2>
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

        <p className="text-sm text-silver">
          {activeTab === "top"
            ? "Fans who have played this track the most:"
            : "Fans who played this track in the first 7 days:"}
        </p>

        {fansLoading ? (
          <div className="flex flex-col gap-3 mt-2">
            <div className="h-6 bg-white-smoke/5 rounded animate-pulse" />
            <div className="h-6 bg-white-smoke/5 rounded animate-pulse" />
            <div className="h-6 bg-white-smoke/5 rounded animate-pulse" />
          </div>
        ) : activeFans.length === 0 ? (
          <p className="text-xs text-silver">No fans yet</p>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            {activeFans.map((fan, index) => (
              <FanCard key={index} fan={fan} index={index} activeTab={activeTab} />
            ))}
          </div>
        )}
      </section>

      <section>
        <LeaderboardActions
          onPlay={onRepeatPlay ?? (() => {})}
          trackId={trackId}
          trackUrl={track?.audio?.audioLink ?? ""}
          isLikedByUser={track?.isLikedByUser ?? false}
          posterId={track?.posterId ?? ""}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">Related Tracks</h2>
         
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white-smoke/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white-smoke/10 rounded" />
              <div className="h-3 w-20 bg-white-smoke/10 rounded" />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white-smoke/10 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-32 bg-white-smoke/10 rounded" />
              <div className="h-3 w-20 bg-white-smoke/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">In Playlists</h2>
          
        </div>
        <div className="flex flex-col gap-3">
          {playlistsLoading ? (
            <>
              <div className="h-10 bg-white-smoke/5 rounded animate-pulse" />
              <div className="h-10 bg-white-smoke/5 rounded animate-pulse" />
            </>
          ) : trackPlaylists.length === 0 ? (
            <p className="text-xs text-silver">Not in any playlists</p>
          ) : (
            trackPlaylists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">{LikesCount} Likes</h2>
          
        </div>
        <Avatar.Group className="w-100">
          {users.map((user) => {
            const profile = userProfiles[user.userId]
            const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false

            return (
            <ProfilePopover
              key={user.userId}
              id={`like-${user.userId}`}
              artistName={user.displayName}
              followCount={user.followersCount}
              profileImgLink={user.avatarUrl}
              userId={user.userId}
              isFollowing={isFollowing}
              onFollowChange={(next) =>
                setFollowOverrides((prev) => ({ ...prev, [user.userId]: next }))
              }
            >
              <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
            </ProfilePopover>
            )
          })}
        </Avatar.Group>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">{RepostsCount} Reposts</h2>
 
        </div>
        <Avatar.Group className="w-100">
          {repostUsers.map((user) => {
            const profile = userProfiles[user.userId]
            const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false

            return (
            <ProfilePopover
              key={user.userId}
              id={`repost-${user.userId}`}
              artistName={user.displayName}
              followCount={user.followersCount}
              profileImgLink={user.avatarUrl}
              userId={user.userId}
              isFollowing={isFollowing}
              onFollowChange={(next) =>
                setFollowOverrides((prev) => ({ ...prev, [user.userId]: next }))
              }
            >
              <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
            </ProfilePopover>
            )
          })}
        </Avatar.Group>
      </section>
    </aside>
  );
}

