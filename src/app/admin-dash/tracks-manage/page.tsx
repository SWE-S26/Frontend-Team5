"use client";

import { useState } from "react";
import { Search, Trash2, Eye, Music, ListMusic } from "lucide-react";

type TrackStatus = "active" | "removed" | "flagged";
type TrackType = "track" | "playlist";

interface Track {
  id: number;
  title: string;
  artist: string;
  type: TrackType;
  plays: number;
  likes: number;
  reports: number;
  status: TrackStatus;
  uploadedAt: string;
}

const mockTracks: Track[] = [
  { id: 1, title: "Summer Vibes", artist: "dj_vibes", type: "track", plays: 12500, likes: 340, reports: 0, status: "active", uploadedAt: "2024-05-10" },
  { id: 2, title: "Best of 2024", artist: "john_doe", type: "playlist", plays: 5600, likes: 120, reports: 2, status: "flagged", uploadedAt: "2024-06-01" },
  { id: 3, title: "Midnight Beats", artist: "jane_smith", type: "track", plays: 87000, likes: 2100, reports: 0, status: "active", uploadedAt: "2024-03-15" },
  { id: 4, title: "Explicit Content", artist: "bad_actor", type: "track", plays: 200, likes: 3, reports: 8, status: "removed", uploadedAt: "2024-05-28" },
  { id: 5, title: "Chill Mix Vol.1", artist: "music_lover", type: "playlist", plays: 3400, likes: 89, reports: 0, status: "active", uploadedAt: "2024-04-22" },
  { id: 6, title: "Stolen Track", artist: "spam_user", type: "track", plays: 100, likes: 0, reports: 5, status: "flagged", uploadedAt: "2024-05-30" },
];

const StatusBadge = ({ status }: { status: TrackStatus }) => {
  const styles: Record<TrackStatus, string> = {
    active: "bg-green-500/20 text-green-400",
    flagged: "bg-brilliant-orange/20 text-brilliant-orange",
    removed: "bg-anger/20 text-anger",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function TracksManagement() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | TrackType>("all");

  const filtered = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tracks.length,
    tracks: tracks.filter((t) => t.type === "track").length,
    playlists: tracks.filter((t) => t.type === "playlist").length,
    flagged: tracks.filter((t) => t.status === "flagged").length,
  };

  const removeTrack = (id: number) =>
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "removed" as TrackStatus } : t))
    );

  const deleteTrack = (id: number) =>
    setTracks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Tracks & Playlists Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: stats.total },
          { label: "Tracks", value: stats.tracks, color: "text-brilliant-orange" },
          { label: "Playlists", value: stats.playlists, color: "text-crusta" },
          { label: "Flagged", value: stats.flagged, color: "text-anger" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-off-black rounded-xl p-4 border border-white/5">
            <p className="text-silver text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color ?? "text-white-smoke"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or artist..."
            className="w-full bg-off-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white-smoke placeholder:text-silver focus:outline-none focus:border-brilliant-orange"
          />
        </div>
        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          {(["all", "track", "playlist"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                filter === f
                  ? "bg-brilliant-orange text-white"
                  : "text-silver hover:text-white-smoke"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-off-black rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-silver text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Plays</th>
              <th className="px-4 py-3 font-medium">Likes</th>
              <th className="px-4 py-3 font-medium">Reports</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((track) => (
              <tr key={track.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white-smoke font-medium">{track.title}</td>
                <td className="px-4 py-3 text-silver">{track.artist}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-silver">
                    {track.type === "track" ? <Music size={13} /> : <ListMusic size={13} />}
                    <span className="capitalize">{track.type}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-white-smoke">{track.plays.toLocaleString()}</td>
                <td className="px-4 py-3 text-white-smoke">{track.likes.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={track.reports > 0 ? "text-anger font-medium" : "text-silver"}>
                    {track.reports}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={track.status} />
                </td>
                <td className="px-4 py-3 text-silver">{track.uploadedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      title="View"
                      className="p-1.5 rounded-lg text-silver hover:text-white-smoke hover:bg-white/10 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    {track.status !== "removed" && (
                      <button
                        title="Remove"
                        onClick={() => removeTrack(track.id)}
                        className="p-1.5 rounded-lg text-silver hover:text-brilliant-orange hover:bg-brilliant-orange/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                    <button
                      title="Delete permanently"
                      onClick={() => deleteTrack(track.id)}
                      className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-silver text-center py-10">No tracks found.</p>
        )}
      </div>
    </div>
  );
}
