"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useGetPostedTracks, useGetUploadQuota } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import UploadUsageBar from "@/app/(artist)/upload/UploadUsageBar";

import { ArtistStudioHeader } from "./ArtistStudioContent/ArtistStudioHeader";
import { TracksTab } from "./ArtistStudioContent/TracksTab";
import { DistributionTab } from "./ArtistStudioContent/DistributionTab";
import { VinylTab } from "./ArtistStudioContent/VinylTab";
import { CommentsTab } from "./ArtistStudioContent/CommentsTab";
import { PromotionsTab } from "./ArtistStudioContent/PromotionsTab";

import { PrettyCheckbox } from "@/app/(artist)/upload/components/TrackInfoForm";


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


const HeartPath = () => (
  <path
    d="M8.64 1.311c-1.305.719-2.456 1.374-2.556 1.454-.232.186-.372.456-.412.789l-.03.26-.985.533c-.541.293-1.076.611-1.19.707-.203.172-.314.399-.408.838-.045.21-.055.217-1.07.775-.564.309-1.098.632-1.187.718L.64 7.54v5.163l.17.237c.253.351.559.528 1.142.661.842.192 1.032.447 1.033 1.389.002.656.086.993.339 1.365.26.381.584.576 1.188.716.858.198 1.03.437 1.036 1.436.004.689.075.959.358 1.358.246.346.577.536 1.176.675.435.1.536.145.701.31.254.254.324.511.324 1.194 0 .664.102 1.008.408 1.364.278.325.542.472 1.073.598.543.129.693.207.856.444.18.263.223.48.223 1.123 0 .536.013.615.153.907.179.375.481.696.78.83.117.053.786.229 1.487.393 1.263.295 1.28.297 2.122.297h.848l2.331-1.275c1.283-.701 2.428-1.343 2.545-1.427.131-.093.271-.264.36-.441.134-.263.147-.342.147-.869 0-.914.11-1.029.832-.868.53.117.87.112 1.124-.018.472-.242.606-.54.653-1.449.019-.366.054-.698.078-.736.101-.162.306-.178.802-.061.767.181 1.19.056 1.507-.443.13-.205.147-.292.18-.92.02-.381.055-.738.078-.792.086-.204.316-.241.791-.129.831.196 1.302.037 1.595-.542.133-.263.147-.342.147-.869 0-.906.114-1.03.806-.873.599.135.939.115 1.233-.071.135-.086.272-.205.304-.263.038-.072.057-.956.057-2.69v-2.583l-.157-.197c-.293-.369-.554-.519-1.13-.648-.479-.108-.633-.183-.812-.396-.193-.23-.247-.476-.248-1.124 0-.647-.071-.91-.348-1.288-.233-.319-.622-.543-1.142-.658-.498-.11-.654-.188-.824-.411-.177-.232-.243-.546-.245-1.163-.001-.59-.08-.867-.349-1.235-.227-.309-.508-.494-.916-.599-.806-.209-3.37-.775-3.511-.775-.21 0-.527.156-2.26 1.113-.846.467-1.52.806-1.6.805-.076 0-.361-.057-.633-.125-.369-.092-.537-.163-.658-.278-.287-.273-.329-.413-.366-1.222-.03-.662-.049-.777-.172-1.013-.178-.343-.484-.656-.759-.777-.119-.053-.79-.229-1.49-.393C12.735 0 12.732 0 11.873.002l-.86.002L8.64 1.311m1.911.347c-.032.559-.229.686-.815.523a4.191 4.191 0 0 0-.554-.093l-.343-.035.847-.465c.947-.519.898-.523.865.07M7.947 3.837c0 .37-.017.443-.128.572l-.127.148-.393-.077a5.026 5.026 0 0 0-.775-.078c-.21-.001-.372-.012-.36-.024a42.42 42.42 0 0 1 1.743-.961c.022-.002.04.187.04.42m12.881.469a.43.43 0 0 1-.415.332 5.078 5.078 0 0 1-.676-.122l-.503-.12.796-.435.797-.436.016.329c.009.181.002.385-.015.452M5.344 7.667l.016 1.96.144.293c.169.341.461.66.736.8.169.086.461.173.969.288a.906.906 0 0 1 .309.172c.294.247.342.402.376 1.22.028.639.05.781.156.985.308.593.597.809 1.323.992.92.232 1.076.456 1.079 1.55.001.601.067.85.321 1.219.243.353.564.547 1.149.696.61.155.673.186.86.431.136.179.149.242.184.876.02.376.054.763.075.861.054.259.321.704.535.891.265.234.421.303.971.432.826.194.947.369.984 1.416.021.603.042.735.162.996.18.394.514.75.828.883.139.059.804.233 1.479.388s1.244.297 1.266.315c.021.018-.829.51-1.89 1.093l-1.928 1.061-1.748-.406c-.962-.224-1.81-.447-1.886-.497-.076-.05-.2-.196-.276-.326-.124-.211-.142-.31-.174-.992-.041-.847-.11-1.056-.476-1.442-.253-.266-.48-.379-1.05-.522-.473-.119-.747-.287-.891-.547-.034-.062-.078-.449-.098-.86-.038-.807-.087-.985-.377-1.39-.254-.354-.562-.532-1.149-.668-.855-.198-.982-.375-1.031-1.437-.029-.614-.054-.766-.168-1.013-.275-.6-.579-.824-1.396-1.03-.845-.214-.95-.366-.996-1.448-.029-.684-.044-.773-.187-1.06a1.923 1.923 0 0 0-.415-.54l-.261-.228.419-.235c.23-.129 1.074-.593 1.874-1.032l1.456-.799-.256-.068c-.534-.142-.655-.191-.834-.339-.2-.165-.461-.633-.461-.827 0-.066-.024-.134-.052-.151-.041-.026-1.969 1.004-3.567 1.905l-.285.161.018-1.79c.018-1.691.025-1.797.126-1.931.065-.086.854-.554 2.026-1.2A82.852 82.852 0 0 1 5.291 5.71c.021-.002.045.879.053 1.957m11.305.569c.166.04.328.088.36.108.08.049.082 6.483.002 6.483-.031 0-.211-.039-.4-.087l-.344-.086v-3.247c0-1.786.018-3.246.04-3.245.022.001.176.034.342.074m-2.086 1.768.37.085v2.02l-.12-.03-.386-.094-.267-.065-.015-1c-.007-.55 0-1 .017-1 .016 0 .197.038.401.084m6.675.376c.023.014.042 1.069.042 2.343 0 1.818-.014 2.317-.067 2.317-.036 0-.15-.022-.253-.048a11.798 11.798 0 0 0-.333-.081l-.147-.033v-2.31c0-1.271.013-2.323.028-2.338.028-.028.648.1.73.15m-2.104 1.69c.008.607.001 1.103-.015 1.103a6.07 6.07 0 0 1-.375-.086L18.4 13v-2.215l.36.091.36.091.014 1.103m4.213.543c.065.023.101.775.04.836-.015.015-.195-.01-.4-.054l-.374-.08v-.879l.334.076c.183.042.363.087.4.101"
    fillRule="evenodd"
    fill="white"
  />
);

const HeartListeningPaths = () => (
  <>
    <path d="m62.22 30.076-2.2-.5c-.93-13.21-10.7-25.6-22.45-28.34-5.9-1.38-11.48-.16-15.75 3.42-6.03 1.89-10.4 6.85-12.07 13.66-.61.06-1.23.23-1.86.55-3.99 2.03-7.1 8.79-7.08 15.37.02 4.81 1.82 8.33 4.59 8.96l5.28 1.21c.3.07.6.1.91.1.74 0 1.49-.2 2.26-.59.41-.21.82-.49 1.21-.8l11.76 15.89c1.01 1.36 2.37 2.29 3.82 2.63.39.09.78.13 1.16.13.75 0 1.47-.18 2.12-.53l7.43-4.07c.27-.16.53-.32.77-.53l6.12-5.33c.77 1.26 1.81 2.1 3.02 2.38l5.28 1.21c.3.07.6.1.91.1.74 0 1.49-.2 2.26-.59 3.93-2 7.11-8.9 7.09-15.38-.02-4.81-1.82-8.32-4.59-8.96l.01.01ZM22.46 5.816c2.83-.84 5.87-.89 9.03-.15 7.7 1.79 14.49 7.94 18.3 15.71-.73-.33-1.49-.58-2.25-.76-2.53-.58-5.06-.26-7.12.92-.51.3-1.13.37-1.77.22-.69-.16-1.35-.55-1.91-1.14-2.01-2.09-4.41-3.51-6.94-4.09-2.51-.58-4.91-.27-6.94.85l-5.15 2.81c-.42-.28-.87-.48-1.35-.59l-.17-.04c.38-5.68 2.58-10.54 6.27-13.73v-.01Zm21.64 25.25v10.67l-1.76-.41v-10.67l1.76.41Zm2.64 6.6v-1.97l1.76.41v1.96l-1.76-.41v.01ZM35.3 26.646v14.81l-1.76-.41v-14.81l1.76.41Zm-6.17 3.7 1.76.41v4.58l-1.76-.41v-4.58Zm8.81 6.83v-5.04l1.76.41v5.04l-1.76-.41Zm19.5-8.2c-.45-.9-.97-1.79-1.6-2.63-1.19-1.6-2.6-2.92-4.14-3.93-1.37-3.22-3.25-6.2-5.48-8.8l4.64-2.52c4.32 4.96 7.26 11.42 7.82 18.15l-1.25-.29.01.02ZM19.46 7.036c-2.63 3.23-4.22 7.45-4.57 12.21l-3.81-.87c1.32-5.15 4.29-9.13 8.39-11.34h-.01Zm-6.2 35.73c-.67.34-1.3.47-1.9.42.18-.07.35-.13.54-.23 2.38-1.21 4.46-4.34 5.66-8.07l-3.62-.83c-1.2 3.73-3.28 6.86-5.66 8.07-.2.1-.4.18-.6.25l-1.99-.46c-2.12-.49-3.56-3.58-3.58-7.7-.02-6.04 2.84-12.41 6.37-14.22.58-.3 1.15-.45 1.68-.45.21 0 .42.02.62.07l5.28 1.21c2.12.49 3.56 3.58 3.58 7.7.02 6.04-2.84 12.42-6.38 14.22v.02Zm20.04 17.34c-.69.38-1.5.47-2.36.27-.14-.03-.27-.09-.4-.14l5.34-2.92c-.89-.42-1.74-1.1-2.43-2.03l-5.51 3.02s-.04-.04-.06-.07l-11.83-15.99c1.62-1.69 2.98-4.18 3.85-6.97.34.61.71 1.2 1.12 1.75l13.26 17.92c.99 1.33 2.31 2.24 3.72 2.6h-.01l-4.67 2.56h-.02Zm25.83-6.85c-.66.34-1.3.47-1.9.42.18-.07.35-.13.54-.23 2.38-1.21 4.46-4.34 5.66-8.07l-3.62-.83c-1.2 3.73-3.28 6.86-5.66 8.07-.2.1-.4.18-.6.25l-1.99-.46c-.92-.21-1.71-.91-2.32-1.98l6.37-5.54c3.7-3.22 4.53-9.08 2.48-14.44l3.85.88c2.16.49 3.56 3.51 3.58 7.7.02 6.04-2.84 12.42-6.38 14.22l-.01.01Z" fill="white" />
    <path d="M8.2 22.536c-2.72 1.38-4.91 6.2-4.89 10.76.02 4.56 2.24 7.13 4.95 5.74 2.72-1.39 4.91-6.2 4.89-10.76-.02-4.56-2.24-7.12-4.96-5.74h.01Z" fill="white" />
  </>
);

function RisingFillIcon({
  svgContent,
  hovered,
  color,
  viewBox,
}: {
  svgContent: React.ReactNode;
  hovered: boolean;
  color: string;
  viewBox: string;
}) {
  const id = React.useId();
  const clipId = `rising-clip-${id}`;

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          {svgContent}
        </clipPath>
      </defs>

      <g fill="white">
        {svgContent}
      </g>

      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={color}
        clipPath={`url(#${clipId})`}
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </svg>
  );
}

export const InsightsIcon = ({ className = "", hovered }: { className?: string; hovered?: boolean }) => (
  <Image src="/artists-icons/insights.svg" alt="Insights" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);

export const CoinIcon = ({ className = "", hovered }: { className?: string; hovered?: boolean }) => (
  <Image src="/artists-icons/coin.svg" alt="Coin" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);

export const PurpleHeartIcon = ({ hovered =false , className = ""} : {hovered?: boolean; className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <RisingFillIcon
      svgContent={<HeartPath />}
      hovered={hovered}
      color="#7564f5"
      viewBox="0 0 32 28"
    />
    <Image src="/artists-icons/purple-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);

export const GoldenHeartIcon = ({ hovered =false , className = "" }: {hovered?: boolean; className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <RisingFillIcon
      svgContent={<HeartListeningPaths />}
      hovered={hovered}
      color="#cfb25d"
      viewBox="0 0 67 62"
    />
    <Image src="/artists-icons/golden-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);

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

export default function ArtistStudioContent({ activeTab, onChangeTab }: ArtistStudioContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { getPostedTracks, tracks: postedTracks } = useGetPostedTracks();
  const { getUploadQuota, quota } = useGetUploadQuota();
  const role = useAppSelector((state) => state.auth.role);
  const isArtistPro = role === "Pro";

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const usedTracks = (postedTracks ?? []).length;
  const serverQuota = quota ?? 0;
  const totalTrackQuota = Math.max(1, serverQuota + usedTracks);
  const usagePercent = Math.min(100, (usedTracks / totalTrackQuota) * 100);

  useEffect(() => {
    void getUploadQuota().catch(() => undefined);
  }, [getUploadQuota]);

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
      <UploadUsageBar
        className="mb-6"
        usedTracks={usedTracks}
        totalTracks={totalTrackQuota}
        usagePercent={usagePercent}
        isArtistPro={isArtistPro}
      />
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