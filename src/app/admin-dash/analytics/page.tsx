"use client";

import { useAdminAnalytics } from "@/hooks/admin-dash/useAdminAnalytics";
import { Users, Music, Play, HardDrive, TrendingUp } from "lucide-react";

const formatBytes = (bytes: number): string => {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
  return `${(bytes / 1_024).toFixed(2)} KB`;
};

const formatRatio = (ratio: number): string => `${(ratio * 100).toFixed(1)}%`;

export default function Analytics() {
  const { overview, storage, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-silver text-sm">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-anger text-sm">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Analytics</h1>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-off-black rounded-xl p-4 md:p-6 border border-white/5 flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 rounded-lg bg-brilliant-orange/10 shrink-0">
            <Users size={18} className="text-brilliant-orange" />
          </div>
          <div className="min-w-0">
            <p className="text-silver text-xs md:text-sm">Total Users</p>
            <p className="text-2xl md:text-3xl font-bold text-white-smoke mt-1">
              {overview?.totalUsers.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-off-black rounded-xl p-4 md:p-6 border border-white/5 flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 rounded-lg bg-crusta/10 shrink-0">
            <TrendingUp size={18} className="text-crusta" />
          </div>
          <div className="min-w-0">
            <p className="text-silver text-xs md:text-sm">Pro to Listeners Ratio</p>
            <p className="text-2xl md:text-3xl font-bold text-white-smoke mt-1">
              {overview ? formatRatio(overview.proToListenersRatio) : "—"}
            </p>
            <p className="text-silver text-xs mt-1">of users are Pro subscribers</p>
          </div>
        </div>

        <div className="bg-off-black rounded-xl p-4 md:p-6 border border-white/5 flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 rounded-lg bg-brilliant-orange/10 shrink-0">
            <Music size={18} className="text-brilliant-orange" />
          </div>
          <div className="min-w-0">
            <p className="text-silver text-xs md:text-sm">Total Tracks</p>
            <p className="text-2xl md:text-3xl font-bold text-white-smoke mt-1">
              {overview?.totalTracks.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-off-black rounded-xl p-4 md:p-6 border border-white/5 flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 rounded-lg bg-green-500/10 shrink-0">
            <Play size={18} className="text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-silver text-xs md:text-sm">Total Plays</p>
            <p className="text-2xl md:text-3xl font-bold text-white-smoke mt-1">
              {overview?.totalPlays.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Storage */}
      <div className="bg-off-black rounded-xl p-4 md:p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="p-2 md:p-2.5 rounded-lg bg-white/5 shrink-0">
            <HardDrive size={18} className="text-silver" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white-smoke font-medium text-sm md:text-base">Audio Storage Usage</p>
            <p className="text-silver text-xs">Total storage consumed by uploaded audio files</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white-smoke shrink-0">
            {storage ? formatBytes(storage.usedBytes) : "—"}
          </p>
        </div>

        {storage && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-brilliant-orange rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((storage.usedBytes / 1_073_741_824) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-silver text-xs">
              {formatBytes(storage.usedBytes)} used of 1 GB display cap
            </p>
          </div>
        )}
      </div>
    </div>
  );
}