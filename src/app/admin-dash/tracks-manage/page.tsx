"use client";

import { useState, useMemo } from "react";
import { Search, Trash2, Music, ListMusic, ShieldOff, ShieldCheck } from "lucide-react";
import { useAdminTracks } from "@/hooks/admin-dash/useAdminTracks";
import { useAdminTrackActions } from "@/hooks/admin-dash/useAdminTrackActions";
import { AdminTrack } from "@/types/admin-dash/adminTracks.types";
import { useDebounce } from "@/hooks/useDebounce";

const LIMIT = 20;

type SortOption = "newest" | "oldest" | "most_plays" | "most_likes";
type BannedFilter = "all" | "active" | "banned";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  most_plays: "Most Plays",
  most_likes: "Most Likes",
};

const BannedBadge = ({ banned }: { banned: boolean }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      !banned ? "bg-green-500/20 text-green-400" : "bg-anger/20 text-anger"
    }`}
  >
    {banned ? "banned" : "active"}
  </span>
);

const sortTracks = (tracks: AdminTrack[], sort: SortOption): AdminTrack[] => {
  const copy = [...tracks];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "most_plays":
      return copy.sort((a, b) => b.numberOfPlays - a.numberOfPlays);
    case "most_likes":
      return copy.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
  }
};

export default function TracksManagement() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(1);
  const [sort, setSort] = useState<SortOption>("newest");
  const [bannedFilter, setBannedFilter] = useState<BannedFilter>("all");
  const [localTracks, setLocalTracks] = useState<AdminTrack[] | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const params = useMemo(
    () => ({
      offset,
      limit: LIMIT,
      ...(debouncedSearch ? { query: debouncedSearch } : {}),
    }),
    [offset, debouncedSearch]
  );

  const { tracks: fetchedTracks, total, loading, error, refetch } = useAdminTracks(params);

  const tracks = localTracks ?? fetchedTracks;
  useMemo(() => {
    setLocalTracks(fetchedTracks);
  }, [fetchedTracks]);

  const optimisticToggleBan = (trackId: string, banned: boolean) => {
    setLocalTracks((prev) =>
      (prev ?? fetchedTracks).map((t) => (t.id === trackId ? { ...t, banned } : t))
    );
  };

  const optimisticDelete = (trackId: string) => {
    setLocalTracks((prev) => (prev ?? fetchedTracks).filter((t) => t.id !== trackId));
  };

  const { banTrack, unbanTrack, deleteTrack, loadingId, error: actionError } =
    useAdminTrackActions(refetch);

  const handleBan = async (trackId: string) => {
    optimisticToggleBan(trackId, true);
    try {
      await banTrack(trackId, "Content violates community guidelines.");
    } catch {
      optimisticToggleBan(trackId, false);
    }
  };

  const handleUnban = async (trackId: string) => {
    optimisticToggleBan(trackId, false);
    try {
      await unbanTrack(trackId);
    } catch {
      optimisticToggleBan(trackId, true);
    }
  };

  const handleDelete = async (trackId: string) => {
    optimisticDelete(trackId);
    try {
      await deleteTrack(trackId);
    } catch {
      setLocalTracks(null);
    }
  };

  const processed = useMemo(() => {
    let result = [...tracks];
    if (bannedFilter !== "all") {
      result = result.filter((t) => (bannedFilter === "banned" ? t.banned : !t.banned));
    }
    return sortTracks(result, sort);
  }, [tracks, sort, bannedFilter]);

  const totalPages = Math.ceil(total / LIMIT);

  const stats = useMemo(
    () => ({
      total,
      tracks: tracks.filter((t) => t.type === "track").length,
      banned: tracks.filter((t) => t.banned).length,
    }),
    [tracks, total]
  );

  const ActionButtons = ({ track }: { track: AdminTrack }) => (
    <div className="flex gap-2">
      <button
        title={track.banned ? "Unban" : "Ban"}
        disabled={loadingId === track.id}
        onClick={() => track.banned ? handleUnban(track.id) : handleBan(track.id)}
        className="p-1.5 rounded-lg text-silver hover:text-brilliant-orange hover:bg-brilliant-orange/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {track.banned ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
      </button>
      <button
        title="Delete permanently"
        disabled={loadingId === track.id}
        onClick={() => handleDelete(track.id)}
        className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Tracks & Playlists Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total Items", value: stats.total },
          { label: "Tracks", value: stats.tracks, color: "text-brilliant-orange" },
          { label: "Banned", value: stats.banned, color: "text-anger" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-off-black rounded-xl p-3 md:p-4 border border-white/5">
            <p className="text-silver text-xs md:text-sm">{label}</p>
            <p className={`text-2xl md:text-3xl font-bold mt-1 ${color ?? "text-white-smoke"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(1);
            }}
            placeholder="Search by title or artist..."
            className="w-full bg-off-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white-smoke placeholder:text-silver focus:outline-none focus:border-brilliant-orange"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
            {(["all", "active", "banned"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setBannedFilter(f)}
                className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm capitalize transition-colors ${
                  bannedFilter === f
                    ? "bg-brilliant-orange text-white"
                    : "text-silver hover:text-white-smoke"
                }`}
              >
                {f === "all" ? "All Status" : f}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
            {(["newest", "oldest", "most_plays", "most_likes"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm transition-colors ${
                  sort === s
                    ? "bg-brilliant-orange text-white"
                    : "text-silver hover:text-white-smoke"
                }`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(error || actionError) && (
        <p className="text-anger text-sm">{error ?? actionError}</p>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-silver text-center py-10">Loading...</p>
        ) : processed.length === 0 ? (
          <p className="text-silver text-center py-10">No tracks found.</p>
        ) : (
          processed.map((track) => (
            <div key={track.id} className="bg-off-black rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white-smoke font-medium truncate">{track.title}</p>
                  <p className="text-silver text-xs mt-0.5 truncate">{track.artistName}</p>
                </div>
                <ActionButtons track={track} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-silver text-xs">
                  {track.type === "track" ? <Music size={12} /> : <ListMusic size={12} />}
                  <span className="capitalize">{track.type}</span>
                </span>
                <BannedBadge banned={track.banned} />
              </div>

              <div className="flex gap-4 text-xs text-silver">
                <span>{track.numberOfPlays.toLocaleString()} plays</span>
                <span>{track.numberOfLikes.toLocaleString()} likes</span>
                <span>{new Date(track.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-off-black rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-silver text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Plays</th>
              <th className="px-4 py-3 font-medium">Likes</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-silver text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : processed.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-silver text-center py-10">
                  No tracks found.
                </td>
              </tr>
            ) : (
              processed.map((track: AdminTrack) => (
                <tr
                  key={track.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white-smoke font-medium">{track.title}</td>
                  <td className="px-4 py-3 text-silver">{track.artistName}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-silver">
                      {track.type === "track" ? <Music size={13} /> : <ListMusic size={13} />}
                      <span className="capitalize">{track.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white-smoke">
                    {track.numberOfPlays.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-white-smoke">
                    {track.numberOfLikes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <BannedBadge banned={track.banned} />
                  </td>
                  <td className="px-4 py-3 text-silver">
                    {new Date(track.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <ActionButtons track={track} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm flex-wrap gap-2">
          <p className="text-silver">
            Page {offset} of {totalPages} — {total} total items
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((p) => Math.max(1, p - 1))}
              disabled={offset === 1}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
              disabled={offset === totalPages}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}