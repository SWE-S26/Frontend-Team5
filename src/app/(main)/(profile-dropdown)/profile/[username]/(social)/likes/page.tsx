'use client'

import { useEffect, useMemo } from "react";
import { LuShare } from "react-icons/lu";
import { useState } from "react";

import SharePopup from "@/components/profile/SharePopUp";
import EmptySocial from "@/components/social-graph/EmptySocial";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";

import { useAppSelector } from "@/store/hooks";
import { useGetLikedTracks } from "@/hooks/useTracks";
import { Track } from "@/types/tracks.types";
import { Track as PlayerTrack } from "@/store/slices/playerSlice";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapToPlayerTrack(track: Track): PlayerTrack {
  return {
    id: track.trackId ?? "",
    url: track.audio.audioLink,
    title: track.basicInfo.title,
    artist: track.basicInfo.mainArtists?.[0],
    img: track.image?.imgLink,
    duration: track.durationInSeconds,
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-32 h-32 bg-white-smoke/10 rounded shrink-0" />
          <div className="flex-1 flex flex-col gap-2 py-2">
            <div className="h-3 bg-white-smoke/10 rounded w-1/4" />
            <div className="h-4 bg-white-smoke/10 rounded w-1/3" />
            <div className="h-14 bg-white-smoke/10 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = () => {
  const [open, setOpen] = useState(false);

  const isOwn       = useAppSelector((state) => state.profile.isOwnProfile);
  const displayName = useAppSelector((state) => state.profile.displayName);
  const profileUserId = useAppSelector((state) => state.profile.userId);

  const { getLikedTracks, tracks, loading } = useGetLikedTracks();

  useEffect(() => {
    if (profileUserId) void getLikedTracks(profileUserId);
  }, [profileUserId, getLikedTracks]);

  const orderedTracks = useMemo(
    () => (tracks ?? []).slice().reverse(),
    [tracks],
  );

  const allPlayerTracks: PlayerTrack[] = useMemo(
    () => orderedTracks.map(mapToPlayerTrack),
    [orderedTracks],
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-silver">Hear the tracks you&apos;ve liked</p>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            data-testid="likes-share-button"
            className="rounded-md bg-off-black text-sm flex items-center justify-center px-2 py-1 cursor-pointer hover:text-silver"
          >
            <LuShare className="w-4 h-4" />
            <span className="ml-1 text-xs font-bold px-2 py-1">Share</span>
          </button>
          <SharePopup isOpen={open} onClose={() => setOpen(false)} />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && <ListSkeleton />}

      {/* ── Empty state ── */}
      {!loading && orderedTracks.length === 0 && (
        <EmptySocial
          type="likes"
          isOwn={isOwn}
          displayName={displayName ?? ""}
        />
      )}

      {/* ── Track list ── */}
      {!loading && orderedTracks.length > 0 && (
        <PopoverProvider>
          <div className="flex flex-col gap-6 mt-4">
            {orderedTracks.map((track) => (
              <WaveformCard
                key={track.trackId}
                trackId={track.trackId ?? ""}
                trackUrl={track.audio.audioLink}
                title={track.basicInfo.title}
                artist={track.basicInfo.mainArtists?.[0]}
                artistId={track.posterId}
                img={track.image?.imgLink}
                duration={track.durationInSeconds}
                tag={track.basicInfo.tags?.[0]}
                audioClipStart={track.audioClip?.start}
                audioClipEnd={track.audioClip?.end}
                likeCount={track.numLikes}
                repostCount={track.numReposts}
                commentsCount={track.numComments}
                playsCount={track.numPlays}
                isLikedByUser={track.isLikedByUser}
                isRepostedByUser={track.isRepostedByUser ?? false}
                wfLink={track.audio.waveformLink}
                enableDirectDownload={
                  track.permissions?.enableDirectDownload ?? false
                }
                allTracks={allPlayerTracks}
              />
            ))}
          </div>
        </PopoverProvider>
      )}
    </div>
  );
};

export default Page;
