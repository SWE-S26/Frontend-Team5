import { useState } from "react";
import { InsightsIcon, CoinIcon, GoldenHeartIcon, PurpleHeartIcon } from "../ArtistStudioContent";
import { useAppSelector } from "@/store/hooks";


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

export function ArtistStudioHeader({ stats }: {
  stats: { plays: number; reposts: number; downloads: number; likes: number; comments: number };
}) {
  const role = useAppSelector((state) => state.auth.role);
  const isArtistPro = role === "Pro";

  return (
    <div className="mb-6 w-full rounded-lg border border-[#2a2a2a] bg-chinese-black p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <h2 className="text-[20px] font-bold text-white-smoke sm:text-[22px] lg:text-[24px]">Artist Studio</h2>
        <span className="text-[11px] text-white-smoke sm:mt-1 sm:text-[12px]">All time stats updated daily.</span>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <StatItem label="SC plays"  value={String(stats.plays)}     hasBorder={false} />
          <StatItem label="Reposts"   value={String(stats.reposts)}   hasBorder={true} />
          <StatItem label="Downloads" value={String(stats.downloads)} hasBorder={true} />
          <StatItem label="Likes"     value={String(stats.likes)}     hasBorder={true} />
          <StatItem label="Comments"  value={String(stats.comments)}  hasBorder={true} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4 lg:gap-8">
          <IconItem label="Insights" tooltip="Limited"  tooltipColor="text-white-smoke"    icon={InsightsIcon} />
          <IconItem label="Earnings" tooltip=""          tooltipColor="text-white-smoke"    icon={CoinIcon} />
          <IconItem label="Fans"     tooltip={isArtistPro ? "UNLOCKED" : "ARTIST PRO"} tooltipColor="text-[#cfb25d]" showStar={!isArtistPro} icon={GoldenHeartIcon} />
          <IconItem label="Benefits" tooltip={isArtistPro ? "UNLOCKED" : "ARTIST PRO"} tooltipColor="text-[#7564f5]" showStar={!isArtistPro} icon={PurpleHeartIcon} />
        </div>
      </div>
    </div>
  );
}