"use client";

import { useEffect, useState, useMemo } from "react";
import { Spin } from "antd";

import { useGetTrackHistory, useGetPlaylistHistory, useDeleteHistory } from "@/hooks/useHistory";
import { Track } from "@/types/tracks.types";
import { HistoryPlaylist } from "@/types/history.types";
import { Track as PlayerTrack } from "@/store/slices/playerSlice";

import PlaylistCard from "@/components/ui/PlaylistCard";
import EmptyCard from "@/components/social-graph/EmptyCard";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext";
import ClearHistoryPopUp from "@/components/ui/ClearHistoryPopUp";

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_COLS = 6;

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

function dedupeById<T>(items: T[], getId: (item: T) => string | undefined): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = getId(item);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

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

function HistoryEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-white-smoke font-bold text-2xl">
        {filtered
          ? "Nothing in your history matches that filter."
          : "You haven't played anything yet."}
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

export default function History() {
  const { getTrackHistory, tracks, loading: tracksLoading } = useGetTrackHistory();
  const { getPlaylistHistory, playlists, loading: playlistsLoading } = useGetPlaylistHistory();
  const { deleteHistory, loading: deleteLoading } = useDeleteHistory();

  const [filterText, setFilterText] = useState("");
  const [cleared, setCleared] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    void getTrackHistory();
    void getPlaylistHistory();
  }, [getTrackHistory, getPlaylistHistory]);

  // Dedupe by id — API returns duplicates when a track is played multiple times
  const uniqueTracks = useMemo(() => dedupeById(tracks ?? [], (t) => t.trackId), [tracks]);

  const uniquePlaylists = useMemo(() => dedupeById(playlists ?? [], (p) => p._id), [playlists]);

  const filteredTracks = useMemo(
    () =>
      uniqueTracks.filter((t) =>
        t.basicInfo.title.toLowerCase().includes(filterText.toLowerCase())
      ),
    [uniqueTracks, filterText]
  );

  const filteredPlaylists = useMemo(
    () => uniquePlaylists.filter((p) => p.title.toLowerCase().includes(filterText.toLowerCase())),
    [uniquePlaylists, filterText]
  );

  const allPlayerTracks: PlayerTrack[] = useMemo(
    () => filteredTracks.map(mapToPlayerTrack),
    [filteredTracks]
  );

  // Pad playlists grid to nearest multiple of GRID_COLS
  const playlistSlots = useMemo(() => {
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
  const isLoading = tracksLoading || playlistsLoading;
  const isEmpty = !isLoading && filteredTracks.length === 0 && filteredPlaylists.length === 0;

  async function handleClearHistory() {
    await deleteHistory();
    setPopupOpen(false);
    setCleared(true);
  }

  if (cleared) {
    return (
      <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-0">
        <HistoryEmptyState filtered={false} />
        <div className="mt-auto pt-10">
          <LibraryFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-0">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <p className="font-bold text-sm text-white-smoke">Recently played:</p>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setPopupOpen((prev) => !prev)}
              data-testid="clear-history-btn"
              className={`text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                popupOpen ? "text-crusta" : "text-white-smoke hover:text-silver"
              }`}
            >
              Clear all history
            </button>
            <ClearHistoryPopUp
              isOpen={popupOpen}
              onClose={() => setPopupOpen(false)}
              onConfirm={handleClearHistory}
              loading={deleteLoading}
            />
          </div>

          <input
            type="text"
            placeholder="Filter"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            data-testid="history-filter-input"
            className="bg-off-black text-white-smoke text-sm px-3 py-2 rounded-md outline-none placeholder:text-silver w-full sm:w-60 sm:mr-8"
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex flex-col gap-10">
          <GridSkeleton />
          <ListSkeleton />
        </div>
      )}

      {/* ── Empty state ── */}
      {isEmpty && <HistoryEmptyState filtered={hasFilter} />}

      {/* ── Playlist grid ── */}
      {!isLoading && filteredPlaylists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-10">
          {playlistSlots.map((slot) =>
            slot.type === "playlist" ? (
              <PlaylistCard
                key={slot.data._id}
                playlistId={slot.data._id}
                title={slot.data.title}
                artist={slot.data.description}
                img={slot.data.image?.url || undefined}
                isLikedByUser={slot.data.isLikedByUser}
                type={slot.data.playlistType}
                artistId={slot.data.artistId}
              />
            ) : (
              <EmptyCard key={(slot as { type: "empty"; key: string }).key} />
            )
          )}
        </div>
      )}

      {/* ── Tracks section ── */}
      {!isLoading && filteredTracks.length > 0 && (
        <>
          <p className="font-bold text-sm text-white-smoke mb-4">
            Hear the tracks you&apos;ve played:
          </p>

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
                  enableDirectDownload={track.permissions?.enableDirectDownload ?? false}
                  allTracks={allPlayerTracks}
                />
              ))}
            </div>
          </PopoverProvider>
        </>
      )}

      <div className="mt-auto pt-10">
        <LibraryFooter />
      </div>
    </div>
  );
}
