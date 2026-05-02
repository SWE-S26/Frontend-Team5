"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { useGetTrackHistory } from "@/hooks/useHistory";
import { Track as PlayerTrack } from "@/store/slices/playerSlice";
import { Track } from "@/types/tracks.types";
import { GetProfileResponse } from "@/types/profile.types";

import TrackListRow from "@/components/layout/track-cards/TrackListRow";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import { profileService } from "@/services/profile.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const PREVIEW_COUNT = 3;

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

/** History can have the same track multiple times — keep latest occurrence */
function deduplicateByTrackId(tracks: Track[]): Track[] {
  const seen = new Set<string>();
  const result: Track[] = [];

  for (let i = tracks.length - 1; i >= 0; i -= 1) {
    const track = tracks[i];
    if (!track.trackId || seen.has(track.trackId)) continue;
    seen.add(track.trackId);
    result.push(track);
  }

  return result;
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

export default function TrackHistoryWidget() {
  const { getTrackHistory, tracks, loading } = useGetTrackHistory();
  const [artistProfiles, setArtistProfiles] = useState<
    Record<string, GetProfileResponse>
  >({});

  const inFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    void getTrackHistory();
  }, [getTrackHistory]);

  const uniqueTracks = useMemo(
    () => deduplicateByTrackId(tracks ?? []),
    [tracks],
  );

  const totalCount = uniqueTracks.length;

  const previewTracks = useMemo(
    () => uniqueTracks.slice(0, PREVIEW_COUNT),
    [uniqueTracks],
  );

  const previewTrackIds = useMemo(
    () => previewTracks.map((t) => t.posterId).join(","),
    [previewTracks],
  );

  useEffect(() => {
    const ids = Array.from(
      new Set(previewTracks.map((t) => t.posterId).filter(Boolean)),
    );
    const missingIds = ids.filter(
      (id) => !artistProfiles[id] && !inFlightIdsRef.current.has(id),
    );

    if (missingIds.length === 0) return;

    missingIds.forEach((id) => inFlightIdsRef.current.add(id));

    let cancelled = false;

    void (async () => {
      const results = await Promise.all(
        missingIds.map(async (id) => {
          try {
            const data = await profileService.getProfileAuthCached(id);
            return { id, data };
          } catch {
            return { id, data: null };
          }
        }),
      );

      if (cancelled) return;

      setArtistProfiles((prev) => {
        const next = { ...prev };
        results.forEach(({ id, data }) => {
          if (data) next[id] = data;
          inFlightIdsRef.current.delete(id);
        });
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [previewTrackIds, artistProfiles]);

  const allPlayerTracks: PlayerTrack[] = uniqueTracks.map(mapToPlayerTrack);

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-1 px-2">
        <Link
          href="/library/history"
          data-testid="track-history-count"
          className="
            text-white-smoke text-xs font-bold no-underline
            py-0.5 rounded
            hover:text-silver transition-colors
          "
        >
          {loading ? "LISTENING HISTORY" : `LISTENING HISTORY`}
        </Link>

        <Link
          href="/library/history"
          data-testid="track-history-view-all"
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
        <p className="text-silver text-xs px-2 py-3">No listening history yet.</p>
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
                permalink={track.basicInfo.permalink}
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
