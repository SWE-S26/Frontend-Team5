"use client";

import { useEffect, useState, useMemo } from "react";
import { Spin } from "antd";

import { useAppSelector } from "@/store/hooks";
import { useGetLikedTracks } from "@/hooks/useTracks";
import { Track } from "@/types/tracks.types";
import { Track as PlayerTrack } from "@/store/slices/playerSlice";

import TrackCard from "@/components/ui/TrackCard";
import EmptyCard from "@/components/social-graph/EmptyCard";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";

import { BsFillGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_COLS = 6;

type ViewMode = "grid" | "list";

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

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="w-full aspect-square bg-white-smoke/10 rounded" />
          <div className="h-3 bg-white-smoke/10 rounded w-3/4" />
          <div className="h-3 bg-white-smoke/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
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

// ─── Empty State ──────────────────────────────────────────────────────────────

function LikesEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-white-smoke font-bold text-2xl">
        {filtered ? "No tracks match your filter." : "You haven't liked any tracks yet."}
      </p>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LibraryFooter() {
  return (
    <div className="text-xs text-silver leading-6 mt-10">
      {[
        "Legal",
        "Privacy",
        "Cookie Policy",
        "Cookie Manager",
        "Imprint",
        "Artist Resources",
        "Newsroom",
        "Charts",
        "Transparency Reports",
      ].map((label, i, arr) => (
        <span key={label}>
          <span className="hover:text-white-smoke cursor-pointer">{label}</span>
          {i < arr.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}

// ─── View Toggle ─────────────────────────────────────────────────────────────

interface ViewToggleProps {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded transition-colors ${
          view === "grid" ? "text-crusta" : "text-silver hover:text-white-smoke"
        }`}
        aria-label="Grid view"
        data-testid="view-toggle-grid"
      >
        <BsFillGridFill className="text-lg" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded transition-colors ${
          view === "list" ? "text-crusta" : "text-silver hover:text-white-smoke"
        }`}
        aria-label="List view"
        data-testid="view-toggle-list"
      >
        <FaList className="text-lg" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Likes() {
  const authUserId = useAppSelector((state) => state.auth.userId);
  const { getLikedTracks, tracks, loading } = useGetLikedTracks();

  const [view, setView] = useState<ViewMode>("grid");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (authUserId) void getLikedTracks(authUserId);
  }, [authUserId, getLikedTracks]);

  // Most-recently-liked first
  const orderedTracks = useMemo(() => (tracks ?? []).slice().reverse(), [tracks]);

  const filteredTracks = useMemo(
    () =>
      orderedTracks.filter((t) =>
        t.basicInfo.title.toLowerCase().includes(filterText.toLowerCase())
      ),
    [orderedTracks, filterText]
  );

  // Full queue for the player
  const allPlayerTracks: PlayerTrack[] = useMemo(
    () => filteredTracks.map(mapToPlayerTrack),
    [filteredTracks]
  );

  // Grid: pad to nearest multiple of GRID_COLS so the last row looks neat
  const gridSlots = useMemo(() => {
    if (view !== "grid") return [];
    const remainder = filteredTracks.length % GRID_COLS;
    const emptyCount = remainder === 0 ? 0 : GRID_COLS - remainder;
    return [
      ...filteredTracks.map((t) => ({ type: "track" as const, data: t })),
      ...Array.from({ length: emptyCount }, (_, i) => ({
        type: "empty" as const,
        key: `empty-${i}`,
      })),
    ];
  }, [filteredTracks, view]);

  const hasFilter = filterText.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-0">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <p className="font-bold text-sm text-white-smoke">Hear the tracks you&apos;ve liked:</p>

        <div className="flex items-center gap-3">
          <span className="text-silver text-xs font-semibold">View</span>
          <ViewToggle view={view} onChange={setView} />

          <input
            type="text"
            placeholder="Filter"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            data-testid="likes-filter-input"
            className="bg-off-black text-white-smoke text-sm px-3 py-2 rounded-md outline-none placeholder:text-silver w-full sm:w-60"
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex-1">{view === "grid" ? <GridSkeleton /> : <ListSkeleton />}</div>
      )}

      {/* ── Empty state ── */}
      {!loading && filteredTracks.length === 0 && <LikesEmptyState filtered={hasFilter} />}

      {/* ── Grid view ── */}
      {!loading && filteredTracks.length > 0 && view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {gridSlots.map((slot, idx) =>
            slot.type === "track" ? (
              <TrackCard
                key={slot.data.trackId}
                trackId={slot.data.trackId}
                trackUrl={slot.data.audio.audioLink}
                title={slot.data.basicInfo.title}
                artist={slot.data.basicInfo.mainArtists?.[0]}
                img={slot.data.image?.imgLink}
                duration={slot.data.durationInSeconds}
                isLikedByUser={slot.data.isLikedByUser}
                allTracks={allPlayerTracks}
              />
            ) : (
              <EmptyCard key={(slot as { type: "empty"; key: string }).key} />
            )
          )}
        </div>
      )}

      {/* ── List view ── */}
      {!loading && filteredTracks.length > 0 && view === "list" && (
        <PopoverProvider>
          <div className="flex flex-col gap-6">
            {filteredTracks.map((track) => (
              <WaveformCard
                key={track.trackId}
                trackId={track.trackId ?? ""}
                trackUrl={track.audio.audioLink}
                title={track.basicInfo.title}
                artist={track.basicInfo.mainArtists?.[0]}
                artistId={track.posterId}
                img={track.image?.imgLink}
                duration={track.durationInSeconds}
                likeCount={track.numLikes}
                repostCount={track.numReposts}
                commentsCount={track.numComments}
                playsCount={track.numPlays}
                isLikedByUser={track.isLikedByUser}
                isRepostedByUser={track.isRepostedByUser ?? false}
                wfLink={track.audio.waveformLink}
                tag={track.basicInfo.tags?.[0]}
                audioClipStart={track.audioClip?.start}
                audioClipEnd={track.audioClip?.end}
                enableDirectDownload={track.permissions?.enableDirectDownload ?? false}
                allTracks={allPlayerTracks}
              />
            ))}
          </div>
        </PopoverProvider>
      )}

      <div className="mt-auto pt-10">
        <LibraryFooter />
      </div>
    </div>
  );
}
