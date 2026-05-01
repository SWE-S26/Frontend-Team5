"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { useGetLikedTracks } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import { Track as PlayerTrack } from "@/store/slices/playerSlice";
import { Track } from "@/types/tracks.types";
import { GetProfileResponse } from "@/types/profile.types";

import TrackListRow from "@/components/layout/track-cards/TrackListRow";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import { profileService } from "@/services/profile.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const PREVIEW_COUNT = 3;

interface LikedTracksWidgetProps {
  userId?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapToPlayerTrack(track: Track): PlayerTrack {
  return {
    id: track.trackId ?? "",
    url: track.audio.audioLink,
    title: track.basicInfo.title,
    artist: track.basicInfo.mainArtists.join(", "),
    img: track.image?.imgLink,
    duration: track.durationInSeconds,
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2 animate-pulse">
      <div className="w-12 h-12 bg-white-smoke/10 shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-2 bg-white-smoke/10 rounded w-1/3" />
        <div className="h-2.5 bg-white-smoke/10 rounded w-1/2" />
        <div className="h-2 bg-white-smoke/10 rounded w-2/3" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LikedTracksWidget({ userId }: LikedTracksWidgetProps) {
  const { getLikedTracks, tracks, loading } = useGetLikedTracks();
  const [artistProfiles, setArtistProfiles] = useState<
    Record<string, GetProfileResponse>
  >({});
  const inFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (userId) void getLikedTracks(userId);
  }, [userId, getLikedTracks]);

  const totalCount = tracks?.length ?? 0;

  const orderedTracks = useMemo(
    () => (tracks ?? []).slice().reverse(),
    [tracks],
  );

  const previewTracks = useMemo(
    () => orderedTracks.slice(0, PREVIEW_COUNT),
    [orderedTracks],
  );

  // Stable string dep — always size 1, never causes "array size changed" error
  const previewTrackIds = useMemo(
    () => previewTracks.map((t) => t.posterId).join(","),
    [previewTracks],
  );

  useEffect(() => {
    const ids = Array.from(
      new Set(previewTracks.map((track) => track.posterId).filter(Boolean)),
    );
    const missingIds = ids.filter(
      (id) => !artistProfiles[id] && !inFlightIdsRef.current.has(id),
    );
    if (missingIds.length === 0) return;

    missingIds.forEach((id) => inFlightIdsRef.current.add(id));

    let cancelled = false;

    void (async () => {
      const BATCH_SIZE = 3;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      for (let start = 0; start < missingIds.length; start += BATCH_SIZE) {
        const batch = missingIds.slice(start, start + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (id) => {
            try {
              const data = await profileService.getProfileAuthCached(id);
              return data;
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) return;

        setArtistProfiles((prev) => {
          const next = { ...prev };
          batch.forEach((id, index) => {
            const profile = results[index];
            if (profile) next[id] = profile;
            inFlightIdsRef.current.delete(id);
          });
          return next;
        });

        if (start + BATCH_SIZE < missingIds.length) {
          await delay(250);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [previewTrackIds, artistProfiles]);

  // Build the full queue so the player knows all liked tracks
  const allPlayerTracks: PlayerTrack[] = orderedTracks.map(mapToPlayerTrack);

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-1 px-2">
        <Link
          href="/library/likes"
          data-testid="liked-tracks-count"
          className="
            text-white-smoke text-xs font-bold no-underline
             py-0.5 rounded
            hover:text-silver transition-colors
          "
        >
          {loading ? "— LIKES" : `${totalCount} LIKES`}
        </Link>

        <Link
          href="/library/likes"
          data-testid="liked-tracks-view-all"
          className="
            text-silver text-xs font-bold no-underline
            hover:underline transition-all
          "
        >
          View all
        </Link>
      </div>

      {/* ── Loading skeletons ── */}
      {loading && (
        <>
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </>
      )}

      {/* ── Empty state ── */}
      {!loading && previewTracks.length === 0 && (
        <p className="text-silver text-xs px-2 py-3">No liked tracks yet.</p>
      )}

      {/* ── Track rows ── */}
      {!loading && previewTracks.length > 0 && (
        <PopoverProvider>
          {previewTracks.map((track) => {
            const profile = artistProfiles[track.posterId];
            const locationParts =
              profile?.city || profile?.country
                ? [profile?.city, profile?.country].filter(Boolean)
                : [];
            const location = locationParts.length
              ? locationParts.join(", ")
              : undefined;

            return (
              <TrackListRow
                key={track.trackId}
                trackId={track.trackId ?? ""}
                trackUrl={track.audio.audioLink}
                title={track.basicInfo.title}
                artist={track.basicInfo.mainArtists.join(", ")}
                artistId={track.posterId}
                img={track.image?.imgLink}
                duration={track.durationInSeconds}
                playsCount={track.numPlays}
                likeCount={track.numLikes}
                repostCount={track.numReposts}
                commentsCount={track.numComments}
                isLikedByUser={track.isLikedByUser}
                isRepostedByUser={track.isRepostedByUser ?? false}
                allTracks={allPlayerTracks}
                artistUserId={track.posterId}
                artistFollowCount={profile?.followersCount ?? 0}
                artistProfileImg={profile?.profileImgLink ?? undefined}
                artistLocation={location}
                artistIsFollowing={profile?.isFollowed ?? false}
              />
            );
          })}
        </PopoverProvider>
      )}
    </div>
  );
}
