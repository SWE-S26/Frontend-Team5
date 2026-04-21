import { InsightsIcon, CoinIcon, GoldenHeartIcon, PurpleHeartIcon } from "../ArtistStudioContent";

function StatItem({ label, value, hasBorder }: { label: string; value: string; hasBorder: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 px-5 ${hasBorder ? "border-l border-[#2a2a2a]" : ""}`}>
      <span className="text-[22px] font-black text-white">{value}</span>
      <span className="text-[11px] text-[#666]">{label}</span>
    </div>
  );
}

function IconItem({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5">
      <Icon className="text-[24px] text-[#d6d6d6]" />
      <span className="text-[11px] text-[#666]">{label}</span>
    </div>
  );
}

export function ArtistStudioHeader({ stats }: {
  stats: { plays: number; reposts: number; downloads: number; likes: number; comments: number };
}) {
  return (
    <div className="w-full mb-6 rounded-lg border border-[#2a2a2a] bg-[#111] p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[24px] font-bold text-white">Artist Studio</h2>
        <span className="text-[12px] text-[#666]">All time stats updated daily.</span>
      </div>
      <div className="flex">
        <div className="flex flex-wrap items-center gap-19">
          <StatItem label="SC plays"  value={String(stats.plays)}     hasBorder={false} />
          <StatItem label="Reposts"   value={String(stats.reposts)}   hasBorder={true} />
          <StatItem label="Downloads" value={String(stats.downloads)} hasBorder={true} />
          <StatItem label="Likes"     value={String(stats.likes)}     hasBorder={true} />
          <StatItem label="Comments"  value={String(stats.comments)}  hasBorder={true} />
        </div>
        <div className="flex flex-wrap items-center gap-22">
          <IconItem label="Insights" icon={InsightsIcon} />
          <IconItem label="Earnings" icon={CoinIcon} />
          <IconItem label="Fans"     icon={GoldenHeartIcon} />
          <IconItem label="Benefits" icon={PurpleHeartIcon} />
        </div>
      </div>
    </div>
  );
}