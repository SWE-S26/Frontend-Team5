"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "antd";
import ProfilePopover from "../layout/track-cards/ProfilePopover";
import GoMobile from "@/components/layout/GoMobile";
import { profileService } from "@/services/profile.service";
import { GetProfileResponse } from "@/types/profile.types";
import { usePlaylistLikesList } from "@/hooks/useLikes";
import { usePlaylistRepostsList } from "@/hooks/useReposts";

interface PlaylistSidebarProps {
  playlistId: string;
  playlist: any;
  className?: string;
}

export default function PlaylistSidebar({ playlistId, playlist, className }: PlaylistSidebarProps) {
  // ── data ──────────────────────────────────────────────────────────────────
  const { users: likeUsers,   total: LikesCount,   loadLikes   } = usePlaylistLikesList(playlistId);
  const { users: repostUsers, total: RepostsCount, loadReposts } = usePlaylistRepostsList(playlistId);

  // ── profile batch-fetch (identical pattern to TrackSidebar) ───────────────
  const [userProfiles,    setUserProfiles]   = useState<Record<string, GetProfileResponse>>({});
  const [followOverrides, setFollowOverrides] = useState<Record<string, boolean>>({});
  const inFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!playlistId) return;
    loadLikes();
    loadReposts();
  }, [playlistId]);

  const sidebarUserIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...likeUsers.map((u) => u.userId),
          ...repostUsers.map((u) => u.userId),
        ].filter(Boolean)),
      ),
    [likeUsers, repostUsers],
  );

  useEffect(() => {
    const missingIds = sidebarUserIds.filter(
      (id) => !userProfiles[id] && !inFlightIdsRef.current.has(id),
    );
    if (missingIds.length === 0) return;

    missingIds.forEach((id) => inFlightIdsRef.current.add(id));
    let cancelled = false;

    void (async () => {
      const BATCH_SIZE = 3;
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      for (let start = 0; start < missingIds.length; start += BATCH_SIZE) {
        const batch = missingIds.slice(start, start + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (id) => {
            try   { return await profileService.getProfileAuthCached(id); }
            catch { return null; }
          }),
        );

        if (cancelled) return;

        setUserProfiles((prev) => {
          const next = { ...prev };
          batch.forEach((id, i) => {
            const profile = results[i];
            if (profile) next[id] = profile;
            inFlightIdsRef.current.delete(id);
          });
          return next;
        });

        if (start + BATCH_SIZE < missingIds.length) await delay(250);
      }
    })();

    return () => { cancelled = true; };
  }, [sidebarUserIds, userProfiles]);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <aside className={`w-full max-w-full top-20 h-fit flex flex-col gap-10 text-white ${className ?? ""} md:max-w-85`}>

      {/* Likes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">
            {LikesCount} Likes
          </h2>
        </div>

        {likeUsers.length === 0 ? (
          <p className="text-xs text-silver">No likes yet</p>
        ) : (
          <Avatar.Group className="w-full max-w-full overflow-x-auto">
            {likeUsers.map((user) => {
              const profile     = userProfiles[user.userId];
              const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false;

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
              );
            })}
          </Avatar.Group>
        )}
      </section>

      {/* Reposts */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white-smoke">
            {RepostsCount} Reposts
          </h2>
        </div>

        {repostUsers.length === 0 ? (
          <p className="text-xs text-silver">No reposts yet</p>
        ) : (
          <Avatar.Group className="w-full max-w-full overflow-x-auto">
            {repostUsers.map((user) => {
              const profile     = userProfiles[user.userId];
              const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false;

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
              );
            })}
          </Avatar.Group>
        )}
      </section>

      <GoMobile />

      <div className="text-xs text-silver leading-6">
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
  );
}
