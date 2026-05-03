"use client";

import { useEffect, useState, useMemo } from "react";
import { useGetMyPlaylists } from "@/hooks/usePlaylists";
import PlaylistCard from "@/components/ui/PlaylistCard";
import EmptyCard from "@/components/social-graph/EmptyCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_COLS = 6;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="w-full aspect-square bg-white-smoke/10 rounded" />
          <div className="h-3 bg-white-smoke/10 rounded w-3/4" />
          <div className="h-3 bg-white-smoke/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function PlaylistsEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-white-smoke font-bold text-2xl">
        {filtered ? "No playlists match your filter." : "You haven't created any playlists yet."}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Playlists() {
  const { getMyPlaylists, playlists, loading } = useGetMyPlaylists();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    void getMyPlaylists();
  }, [getMyPlaylists]);

  const filteredPlaylists = useMemo(
    () => (playlists ?? []).filter((p) => p.title.toLowerCase().includes(filterText.toLowerCase())),
    [playlists, filterText]
  );

  const gridSlots = useMemo(() => {
    const remainder = filteredPlaylists.length % GRID_COLS;
    const emptyCount = remainder === 0 ? 0 : GRID_COLS - remainder;
    return [
      ...filteredPlaylists.map((p) => ({ type: "playlist" as const, data: p })),
      ...Array.from({ length: emptyCount }, (_, i) => ({
        type: "empty" as const,
        key: `empty-${i}`,
      })),
    ];
  }, [filteredPlaylists]);

  const hasFilter = filterText.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-0">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <p className="font-bold text-sm text-white-smoke">
          Hear your own playlists and the playlists you&apos;ve created:
        </p>

        <input
          type="text"
          placeholder="Filter"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          data-testid="playlists-filter-input"
          className="bg-off-black text-white-smoke text-sm px-3 py-2 rounded-md outline-none placeholder:text-silver w-full sm:w-60 sm:mr-8"
        />
      </div>

      {/* ── Loading ── */}
      {loading && <GridSkeleton />}

      {/* ── Empty state ── */}
      {!loading && filteredPlaylists.length === 0 && <PlaylistsEmptyState filtered={hasFilter} />}

      {/* ── Grid ── */}
      {!loading && filteredPlaylists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {gridSlots.map((slot, idx) =>
            slot.type === "playlist" ? (
              <PlaylistCard
                key={slot.data._id}
                playlistId={slot.data._id}
                title={slot.data.title}
                artist={slot.data.description}
                img={slot.data.image?.imgLink || undefined}
                isLikedByUser={slot.data.isLiked}
                type={slot.data.playlistType}
                artistId={slot.data.artistId}
              />
            ) : (
              <EmptyCard key={(slot as { type: "empty"; key: string }).key} />
            )
          )}
        </div>
      )}

      <div className="mt-auto pt-10">
        <LibraryFooter />
      </div>
    </div>
  );
}
