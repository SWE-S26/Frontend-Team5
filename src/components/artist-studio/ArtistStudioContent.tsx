"use client";

import { CloudUploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useGetPostedTracks } from "@/hooks/useTracks";
import { TOTAL_MINUTES_LIMIT } from "@/types/upload.types";

import { ArtistStudioHeader } from "./ArtistStudioContent/ArtistStudioHeader";
import { TracksTab } from "./ArtistStudioContent/TracksTab";
import { DistributionTab } from "./ArtistStudioContent/DistributionTab";
import { VinylTab } from "./ArtistStudioContent/VinylTab";
import { CommentsTab } from "./ArtistStudioContent/CommentsTab";
import { PromotionsTab } from "./ArtistStudioContent/PromotionsTab";


export type ArtistTab = "tracks" | "distribution" | "vinyl" | "comments" | "promotions";

export type ArtistStudioContentProps = {
  activeTab: ArtistTab;
  onChangeTab: (tab: ArtistTab) => void;
};

export type ArtistTrackRow = {
  id: string;
  title: string;
  label: string;
  duration: string;
  date: string;
  plays: number;
  likes: number;
  comments: number;
  reposts: number;
  hd: boolean;
  cover: string;
  url: string;
  isPrivate: boolean;
  rawDate?: string;
  rawDuration?: number;
};

export type SortField = "date" | "plays" | "duration" | "likes";


export const formatDuration = (durationInSeconds?: number | null) => {
  if (!durationInSeconds || durationInSeconds <= 0) return "--";
  const mins = Math.floor(durationInSeconds / 60);
  const secs = Math.floor(durationInSeconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const formatDate = (date?: string) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};


export const InsightsIcon = ({ className = "" }: { className?: string }) => (
  <Image src="/artists-icons/insights.svg" alt="Insights" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);
export const CoinIcon = ({ className = "" }: { className?: string }) => (
  <Image src="/artists-icons/coin.svg" alt="Coin" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);
export const GoldenHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <Image src="/artists-icons/heart-listening.svg" alt="Heart" width={48} height={48} className="invert w-12 h-12" />
    <Image src="/artists-icons/golden-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);
export const PurpleHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <Image src="/artists-icons/heart.svg" alt="Heart" width={48} height={48} className="invert w-12 h-12" />
    <Image src="/artists-icons/purple-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);


export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  className = "",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
        checked || indeterminate
          ? "border-white bg-white"
          : "border-[#555] bg-transparent hover:border-[#888]"
      } ${className}`}
      aria-checked={indeterminate ? "mixed" : checked}
      role="checkbox"
    >
      {indeterminate && !checked && (
        <div className="h-0.5 w-2 bg-black rounded-full" />
      )}
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 3.5L3.8 6.5L9 1" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function TabBar({ activeTab, onChangeTab }: { activeTab: ArtistTab; onChangeTab: (tab: ArtistTab) => void }) {
  const tabClass = (id: ArtistTab) =>
    `-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-[13px] transition-colors cursor-pointer ${
      activeTab === id ? "border-white font-semibold text-white" : "border-transparent text-[#888] hover:text-white"
    }`;
  return (
    <div className="sticky top-11.5 z-100 flex overflow-x-auto overflow-y-hidden border-b border-[#222] bg-[#111] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button type="button" onClick={() => onChangeTab("tracks")}       className={tabClass("tracks")}>BeatZa Tracks</button>
      <button type="button" onClick={() => onChangeTab("distribution")} className={tabClass("distribution")}>Distribution</button>
      <button type="button" onClick={() => onChangeTab("vinyl")}        className={tabClass("vinyl")}>Vinyl Records</button>
      <button type="button" onClick={() => onChangeTab("comments")}     className={tabClass("comments")}>Comments</button>
      <button type="button" onClick={() => onChangeTab("promotions")}   className={tabClass("promotions")}>Promotions</button>
    </div>
  );
}

function UploadQuotaBanner({ usagePercent, minutesUsed }: { usagePercent: number; minutesUsed: number }) {
  return (
    <div className="mb-6 rounded-lg border border-[#2a2a2a] bg-[#1f2023] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CloudUploadOutlined style={{ fontSize: 22, color: "#d0d0d0" }} />
          <span className="text-[15px] font-semibold text-white">{Math.round(usagePercent)}% of uploads used</span>
          <div className="relative h-1.5 w-48 rounded-full bg-[#474747]">
            <div
              className="absolute left-0 top-0 h-1.5 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <span className="text-[15px] text-[#d0d0d0]">{Math.round(minutesUsed)} of {TOTAL_MINUTES_LIMIT} minutes</span>
        </div>
        <button type="button" className="rounded-full border border-[#444] bg-[#0e0e10] px-5 py-1.5 text-[14px] font-bold text-white hover:border-[#666] transition-colors">
          Get unlimited uploads
        </button>
      </div>
    </div>
  );
}

export default function ArtistStudioContent({ activeTab, onChangeTab }: ArtistStudioContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { getPostedTracks, tracks: postedTracks } = useGetPostedTracks();

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalMinutesUsed = 0;
  const usagePercent = Math.min(100, (totalMinutesUsed / TOTAL_MINUTES_LIMIT) * 100);

  const stats = useMemo(() => {
    const tracks = postedTracks ?? [];
    return {
      plays:     tracks.reduce((sum, t) => sum + (t.numPlays    ?? 0), 0),
      reposts:   tracks.reduce((sum, t) => sum + (t.numReposts  ?? 0), 0),
      likes:     tracks.reduce((sum, t) => sum + (t.numLikes    ?? 0), 0),
      comments:  tracks.reduce((sum, t) => sum + (t.numComments ?? 0), 0),
      downloads: 0,
    };
  }, [postedTracks]);

  return (
    <section className="min-h-screen bg-[#111] px-6 pb-4 pt-0">
      <UploadQuotaBanner usagePercent={usagePercent} minutesUsed={totalMinutesUsed} />
      <ArtistStudioHeader stats={stats} />
      <TabBar activeTab={activeTab} onChangeTab={onChangeTab} />
      <div className="py-5">
        {activeTab === "tracks"       && <TracksTab isMobile={isMobile} />}
        {activeTab === "distribution" && <DistributionTab />}
        {activeTab === "vinyl"        && <VinylTab />}
        {activeTab === "comments"     && <CommentsTab />}
        {activeTab === "promotions"   && <PromotionsTab />}
      </div>
    </section>
  );
}