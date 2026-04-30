import { useState, useEffect } from "react";
import { InsightsIcon, CoinIcon, GoldenHeartIcon, PurpleHeartIcon } from "../ArtistStudioContent";
import { artistService } from "@/services/artist.service";
import { ArtistAnalyticsResponse } from "@/types/artist.types";

function StatItem({ label, value, hasBorder }: { label: string; value: string; hasBorder: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 px-3 py-1 sm:px-4 lg:px-5 ${hasBorder ? "sm:border-l sm:border-[#2a2a2a]" : ""}`}>
      <span className="text-[18px] font-chinese-black text-white-smoke sm:text-[20px] lg:text-[22px]">{value}</span>
      <span className="text-[11px] text-white-smoke">{label}</span>
    </div>
  );
}

function IconItem({
  label,
  tooltip,
  tooltipColor = "white-smoke",
  showStar,
  icon: Icon,
}: {
  label: string;
  tooltip: string;
  tooltipColor?: string;
  showStar?: boolean;
  icon: React.ComponentType<{ className?: string; hovered?: boolean; showStar?: boolean }>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-1 px-5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="inline-flex flex-col items-center transition-transform duration-200"
        style={{ transform: hovered ? "translateY(-4px)" : "translateY(0)" }}
      >
        <Icon hovered={hovered} showStar={showStar} />
        <span className="text-[11px] text-white-smoke mt-1">
          {label}
        </span>
      </span>

      <span
        className={`pointer-events-none text-[8px] font-bold leading-none transition-all duration-200 ${tooltipColor}`}
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
        }}
      >
        {tooltip}
      </span>
    </div>
  );
}

export function ArtistStudioHeader({ stats: propStats, isArtistPro }: {
  stats: { plays: number; reposts: number; downloads: number; likes: number; comments: number };
  isArtistPro: boolean;
}) {
  const [analytics, setAnalytics] = useState<ArtistAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await artistService.getArtistAnalytics();
        setAnalytics(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics");
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const stats = analytics ? {
    plays: analytics.totalPlays,
    reposts: analytics.totalReposts,
    downloads: analytics.totalDownloads,
    likes: analytics.totalLikes,
    comments: analytics.totalComments,
    //playthroughrate: analytics.totalplayrate,
  } : propStats;

  return (
    <div className="mb-6 w-full rounded-lg border border-[#2a2a2a] bg-chinese-black p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <h2 className="text-[20px] font-bold text-white-smoke sm:text-[22px] lg:text-[24px]">Artist Studio</h2>
        <span className="text-[11px] text-white-smoke sm:mt-1 sm:text-[12px]">All time stats updated daily.</span>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <StatItem label="SC plays"  value={stats.plays.toString()}     hasBorder={false} />
          <StatItem label="Reposts"   value={stats.reposts.toString()}   hasBorder={true} />
          {isArtistPro && <StatItem label="Downloads" value={stats.downloads.toString()} hasBorder={true} />}
          <StatItem label="Likes"     value={stats.likes.toString()}     hasBorder={true} />
          <StatItem label="Comments"  value={stats.comments.toString()}  hasBorder={true} />
          <StatItem label="Playthrough Rate"  value={"0"}  hasBorder={true} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4 lg:gap-8">
          <IconItem label="Insights" tooltip="Limited"  tooltipColor="text-white-smoke"    icon={InsightsIcon} />
          <IconItem label="Earnings" tooltip=""          tooltipColor="text-white-smoke"    icon={CoinIcon} />
          <IconItem label="Fans"     tooltip={isArtistPro ? "Full Access" : "ARTIST PRO"} tooltipColor="text-[#cfb25d]" showStar={!isArtistPro} icon={GoldenHeartIcon} />
          <IconItem label="Benefits" tooltip={isArtistPro ? "Full Access" : "ARTIST PRO"} tooltipColor="text-[#7564f5]" showStar={!isArtistPro} icon={PurpleHeartIcon} />
        </div>
      </div>
    </div>
  );
}