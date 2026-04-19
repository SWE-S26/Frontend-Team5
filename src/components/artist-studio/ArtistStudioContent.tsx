"use client";

// ─── Imports ────────────────────────────────────────────────────────────────
import { CloudUploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";

import { FaRegClock } from "react-icons/fa";
import { FiMessageSquare, FiEdit2, FiPlusSquare, FiDollarSign, FiSliders, FiGlobe, FiBarChart2, FiDownload, FiLink, FiTrash2 } from "react-icons/fi";
import { IoHeartOutline, IoPauseCircleSharp } from "react-icons/io5";
import { IoIosGlobe, IoIosPlayCircle } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { TbRepeat } from "react-icons/tb";
import { BsLightningChargeFill, BsSortDown } from "react-icons/bs";
import { RiMoneyDollarCircleLine, RiDeleteBinLine, RiLockFill } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
import { ImEqualizer2 } from "react-icons/im";

import { useGetPostedTracks } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import { pause, play, playAudio } from "@/store/slices/playerSlice";
import { RootState } from "@/store/store";
import { TOTAL_MINUTES_LIMIT } from "@/types/upload.types";


// ─── Types ───────────────────────────────────────────────────────────────────
export type ArtistTab = "tracks" | "distribution" | "vinyl" | "comments" | "promotions";

type ArtistStudioContentProps = {
  activeTab: ArtistTab;
  onChangeTab: (tab: ArtistTab) => void;
};

type ArtistTrackRow = {
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

type SortField = "date" | "plays" | "duration" | "likes";


// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDuration = (durationInSeconds?: number | null) => {
  if (!durationInSeconds || durationInSeconds <= 0) return "--";
  const mins = Math.floor(durationInSeconds / 60);
  const secs = Math.floor(durationInSeconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const formatDate = (date?: string) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};


// ─── Icons ───────────────────────────────────────────────────────────────────
const InsightsIcon = ({ className = "" }: { className?: string }) => (
  <Image src="/artists-icons/insights.svg" alt="Insights" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);
const CoinIcon = ({ className = "" }: { className?: string }) => (
  <Image src="/artists-icons/coin.svg" alt="Coin" width={24} height={24} className={`invert w-12 h-12 ${className}`} />
);
const GoldenHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <Image src="/artists-icons/heart-listening.svg" alt="Heart" width={48} height={48} className="invert w-12 h-12" />
    <Image src="/artists-icons/golden-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);
const PurpleHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <Image src="/artists-icons/heart.svg" alt="Heart" width={48} height={48} className="invert w-12 h-12" />
    <Image src="/artists-icons/purple-star.svg" alt="Star" width={16} height={16} className="absolute top-0 ml-11 w-4 h-4" />
  </div>
);


// ─── Custom Checkbox ──────────────────────────────────────────────────────────
function Checkbox({
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


// ─── Amplify Modal ────────────────────────────────────────────────────────────
function AmplifyModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-2xl rounded-2xl bg-[#111] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaa] hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <h2 className="text-[26px] font-black leading-tight text-white">
              Reach more listeners with Artist Pro
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
              In order to be eligible, you must have an Artist or Artist Pro subscription.
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#aaa]">
              With an Artist Pro subscription you can have this track analyzed and recommended to reach{" "}
              <span className="font-bold text-white">100+ plays by listeners on BeatZa.</span>
            </p>

            <div className="mt-5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <p className="mb-3 text-[13px] font-bold text-white">Upgrade to Artist Pro to get:</p>
              <ul className="space-y-2.5">
                {["Unlimited track recommendations", "Unlimited uploads + replace tracks", "Unlimited track distribution"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-[#ccc]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7b4fff]">
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                        <path d="M1 3L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={onUnlock}
                className="rounded-full bg-[#7b4fff] px-6 py-2.5 text-[14px] font-bold text-white hover:bg-[#6a3eee] transition-colors"
              >
                Unlock with Artist Pro
              </button>
              <button type="button" onClick={onClose} className="text-[14px] text-[#888] hover:text-white transition-colors">
                Maybe later
              </button>
            </div>
          </div>

          <div className="hidden lg:flex shrink-0 items-center justify-center">
            <div className="relative h-48 w-48">
              <img src="artists-icons/wavespeaker.svg" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Track Context Menu ───────────────────────────────────────────────────────
function TrackContextMenu({
  trackId,
  position,
  onClose,
  onEdit,
  onAddToPlaylist,
  onDelete,
}: {
  trackId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: (id: string) => void;
  onAddToPlaylist: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuItems = [
    { icon: FiEdit2,      label: "Edit",            action: () => { onEdit(trackId); onClose(); } },
    { icon: FiPlusSquare, label: "Add to playlist", action: () => { onAddToPlaylist(trackId); onClose(); } },
    { icon: FiDollarSign, label: "Monetize",        action: onClose },
    { icon: FiSliders,    label: "Master",           action: onClose },
    { icon: FiGlobe,      label: "Distribute",       action: onClose },
    { icon: FiBarChart2,  label: "Track insights",   action: onClose },
    { icon: FiDownload,   label: "Download file",    action: onClose },
    { icon: FiLink,       label: "Copy link",        action: onClose },
    { icon: FiTrash2,     label: "Delete track",     action: () => { onDelete(trackId); onClose(); }, danger: true },
  ];

  // Adjust position if menu would overflow viewport bottom
  const menuHeight = menuItems.length * 44;
  const adjustedY = position.y + menuHeight > window.innerHeight ? position.y - menuHeight : position.y;
  const adjustedX = position.x + 208 > window.innerWidth ? position.x - 208 : position.x;

  return (
    <div
      ref={ref}
      className="fixed z-[150] w-52 rounded-xl border border-[#2a2a2a] bg-[#161616] py-1.5 shadow-2xl"
      style={{ top: adjustedY, left: adjustedX }}
    >
      {menuItems.map(({ icon: Icon, label, action, danger }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-[#222] ${
            danger ? "text-red-400 hover:text-red-300" : "text-[#ccc] hover:text-white"
          }`}
        >
          <Icon className="shrink-0 text-[15px]" />
          {label}
        </button>
      ))}
    </div>
  );
}


// ─── Edit Track Panel (single) ────────────────────────────────────────────────
function EditTrackPanel({ track, onClose }: { track: ArtistTrackRow; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"details" | "advanced" | "storefront">("details");
  const [artworkSrc, setArtworkSrc]     = useState(track.cover);
  const [zoom, setZoom]                 = useState(0);
  const [title, setTitle]               = useState(track.title);
  const [artist, setArtist]             = useState(track.label);
  const [genre, setGenre]               = useState("");
  const [tags, setTags]                 = useState("");
  const [description, setDescription]   = useState("");
  const [isPublic, setIsPublic]         = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [allowComments, setAllowComments]     = useState(true);
  const [showComments, setShowComments]       = useState(true);
  const [showStats, setShowStats]             = useState(true);
  const [enableDownloads, setEnableDownloads] = useState(false);
  const [genreOpen, setGenreOpen]       = useState(false);
  const [privacyOpen, setPrivacyOpen]   = useState(false);
  const artworkInputRef = useRef<HTMLInputElement | null>(null);

  const tabClass = (t: typeof activeTab) =>
    `pb-3 text-[13px] font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === t ? "border-white text-white" : "border-transparent text-[#666] hover:text-[#aaa]"
    }`;

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setArtworkSrc(url);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${value ? "bg-[#1db954]" : "bg-[#444]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-[600px] flex-col bg-[#111] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-[#aaa] hover:text-white transition-colors text-[20px] leading-none cursor-pointer">✕</button>
            <h2 className="text-[15px] font-bold text-white">Edit Track</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 rounded-md border border-[#333] px-3 py-1.5 text-[12px] text-[#ccc] hover:border-[#555] transition-colors cursor-pointer">
              <FiDownload className="text-[13px]" /> Download file
            </button>
            <button type="button" className="flex items-center gap-1.5 rounded-md border border-[#333] px-3 py-1.5 text-[12px] text-[#ccc] hover:border-[#555] transition-colors cursor-pointer">
              Replace file
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#2a2a2a] px-6 pt-1">
          <button type="button" className={tabClass("details")}    onClick={() => setActiveTab("details")}>Track details</button>
          <button type="button" className={tabClass("advanced")}   onClick={() => setActiveTab("advanced")}>Advanced settings</button>
          <button type="button" className={tabClass("storefront")} onClick={() => setActiveTab("storefront")}>Artist Storefront</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "details" && (
            <div className="space-y-5">
              {/* Artwork */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-full max-w-[280px]">
                  <img
                    src={artworkSrc || "/test.jpg"}
                    alt="Track artwork"
                    className="h-[280px] w-full rounded object-cover"
                    onError={(e) => { e.currentTarget.src = "/test.jpg"; }}
                  />
                  <div className="absolute right-2 top-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => artworkInputRef.current?.click()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      <GrEdit className="text-[13px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtworkSrc("/test.jpg")}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      <RiDeleteBinLine className="text-[13px]" />
                    </button>
                  </div>
                </div>
                {/* Zoom slider */}
                <div className="flex w-full max-w-[280px] items-center gap-2 text-[#888]">
                  <span className="text-[13px]">−</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-white cursor-pointer"
                  />
                  <span className="text-[13px]">+</span>
                </div>
                <input ref={artworkInputRef} type="file" accept="image/*" className="hidden" onChange={handleArtworkChange} />
              </div>

              {/* Track title */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-white">
                  Track title <span className="text-red-400">*</span>
                  <span className="ml-1 cursor-help text-[#888] text-[12px]">ⓘ</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-b border-[#333] bg-transparent py-2 text-[13px] text-white outline-none focus:border-[#666] transition-colors"
                />
              </div>

              {/* Track link */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-white">Track link</label>
                <p className="text-[13px] text-[#888] break-all">https://beatza.com/{artist?.toLowerCase().replace(/\s+/g, "-")}/{title?.toLowerCase().replace(/\s+/g, "-")}</p>
              </div>

              {/* Main Artists */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-white">
                  Main Artist(s) <span className="ml-1 cursor-help text-[#888] text-[12px]">ⓘ</span>
                </label>
                <input
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full border-b border-[#333] bg-transparent py-2 text-[13px] text-white outline-none focus:border-[#666] transition-colors"
                />
                <p className="mt-1 text-[11px] text-[#666]">Tip: Use commas to add multiple artist names.</p>
              </div>

              {/* Genre */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-white">Genre</label>
                <button
                  type="button"
                  onClick={() => setGenreOpen((v) => !v)}
                  className="flex w-full items-center justify-between border-b border-[#333] bg-transparent py-2 text-[13px] text-[#666] hover:border-[#555] transition-colors cursor-pointer"
                >
                  <span>{genre || "Add or search for genre"}</span>
                  <span className="text-[#666]">⌄</span>
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-white">
                  Tags <span className="ml-1 cursor-help text-[#888] text-[12px]">ⓘ</span>
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add styles, moods, tempo."
                  className="w-full border-b border-[#333] bg-transparent py-2 text-[13px] text-white outline-none focus:border-[#666] transition-colors placeholder:text-[#666]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tracks with descriptions tend to get more plays and engagements."
                  rows={3}
                  className="w-full border-b border-[#333] bg-transparent py-2 text-[13px] text-white outline-none focus:border-[#666] transition-colors placeholder:text-[#666] resize-none"
                />
              </div>

              {/* Privacy */}
              <div className="rounded-lg border border-[#2a2a2a] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPrivacyOpen((v) => !v)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <CiGlobe className="text-[18px] text-[#aaa] shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-semibold text-white">{isPublic ? "Public" : "Private"}</p>
                    <p className="text-[11px] text-[#666]">{isPublic ? "Anyone can access and listen to this track." : "Only you can access this track."}</p>
                  </div>
                  <span className="text-[#666] text-[14px]">⌄</span>
                </button>
                <div className="flex items-center gap-3 border-t border-[#2a2a2a] px-4 py-3.5 opacity-50">
                  <FaRegClock className="text-[16px] text-[#aaa] shrink-0" />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-white">
                      Schedule public release{" "}
                      <span className="rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[9px] font-bold text-yellow-400">ARTIST PRO</span>
                    </p>
                    <p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
                  </div>
                  <Toggle value={scheduleEnabled} onChange={setScheduleEnabled} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6 py-2">
              {/* Enable direct downloads */}
              <div>
                <p className="text-[13px] font-semibold text-white mb-3">Enable direct downloads</p>
                <div className="flex items-center gap-0 rounded-lg border border-[#2a2a2a] overflow-hidden text-[12px] font-semibold">
                  {(["Don't Change", "All on", "All off"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEnableDownloads(opt === "All on")}
                      className={`flex-1 py-2 transition-colors cursor-pointer ${
                        (opt === "Don't Change" && !enableDownloads) || (opt === "All on" && enableDownloads)
                          ? "bg-white text-black"
                          : "bg-transparent text-[#888] hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {/* Toggles */}
              {[
                { label: "Allow people to comment on your track", value: allowComments, onChange: setAllowComments },
                { label: "Show track comments to public",         value: showComments,  onChange: setShowComments  },
                { label: "Show track stats to public",            value: showStats,     onChange: setShowStats     },
              ].map(({ label, value, onChange }) => (
                <div key={label} className="flex items-center justify-between border-b border-[#1e1e1e] pb-4">
                  <span className="text-[13px] text-white">{label}</span>
                  <div className="flex items-center gap-2">
                    <RiLockFill className="text-[#555] text-[13px]" />
                    <Toggle value={value} onChange={onChange} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "storefront" && (
            <div className="flex items-center justify-center h-40 text-[13px] text-[#555]">Artist Storefront coming soon</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#2a2a2a] px-6 py-4">
          <button
            type="button"
            className="rounded-full bg-[#333] px-7 py-2.5 text-[13px] font-bold text-white hover:bg-[#444] transition-colors cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}


// ─── Bulk Edit Panel (multi-select) ───────────────────────────────────────────
function BulkEditPanel({ selectedIds, tracks, onClose }: {
  selectedIds: Set<string>;
  tracks: ArtistTrackRow[];
  onClose: () => void;
}) {
  const count = selectedIds.size;
  const [artworkSrc, setArtworkSrc]             = useState<string | null>(null);
  const [genre, setGenre]                       = useState("");
  const [tags, setTags]                         = useState("");
  const [privacy, setPrivacy]                   = useState<"dont-change" | "all-public" | "all-private">("dont-change");
  const [downloads, setDownloads]               = useState<"dont-change" | "all-on" | "all-off">("dont-change");
  const [allowComments, setAllowComments]       = useState(true);
  const [showComments, setShowComments]         = useState(true);
  const [showStats, setShowStats]               = useState(true);
  const [advancedOpen, setAdvancedOpen]         = useState(false);
  const artworkInputRef = useRef<HTMLInputElement | null>(null);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArtworkSrc(URL.createObjectURL(file));
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${value ? "bg-[#1db954]" : "bg-[#444]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-[600px] flex-col bg-[#111] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-[#aaa] hover:text-white transition-colors text-[20px] leading-none cursor-pointer">✕</button>
            <h2 className="text-[15px] font-bold text-white">Edit {count} tracks</h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Artwork */}
          <div>
            <button
              type="button"
              onClick={() => artworkInputRef.current?.click()}
              className="flex h-[220px] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#333] bg-[#181818] hover:border-[#555] transition-colors cursor-pointer overflow-hidden"
            >
              {artworkSrc ? (
                <img src={artworkSrc} alt="New artwork" className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded border border-[#444] text-[#888]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-white">Add new artwork</span>
                </>
              )}
            </button>
            <input ref={artworkInputRef} type="file" accept="image/*" className="hidden" onChange={handleArtworkChange} />
          </div>

          {/* Primary genre */}
          <div>
            <label className="mb-1 block text-[13px] font-semibold text-white">Primary genre</label>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-[#2a2a2a] bg-transparent px-4 py-3 text-[13px] text-[#666] hover:border-[#444] transition-colors cursor-pointer"
            >
              <span>{genre || "Add or search for a genre"}</span>
              <span>⌄</span>
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-white">
              Tags <span className="ml-1 cursor-help text-[#888] text-[12px]">ⓘ</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add styles, moods, tempo."
              className="w-full rounded-lg border border-[#2a2a2a] bg-transparent px-4 py-3 text-[13px] text-white outline-none focus:border-[#444] transition-colors placeholder:text-[#666]"
            />
          </div>

          {/* Tracks privacy */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-white">Tracks privacy</p>
            <div className="flex items-center gap-0 rounded-lg border border-[#2a2a2a] overflow-hidden text-[12px] font-semibold">
              {([
                { key: "dont-change",  label: "Don't Change" },
                { key: "all-public",   label: "All Public"   },
                { key: "all-private",  label: "All Private"  },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPrivacy(key)}
                  className={`flex-1 py-2.5 transition-colors cursor-pointer ${
                    privacy === key ? "bg-white text-black" : "bg-transparent text-[#888] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced settings accordion */}
          <div className="rounded-lg border border-[#2a2a2a] overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <span className="text-[14px] font-semibold text-white">Advanced settings</span>
              <span className="text-[#888] text-[14px]">{advancedOpen ? "∧" : "∨"}</span>
            </button>
            {advancedOpen && (
              <div className="border-t border-[#2a2a2a] px-4 py-4 space-y-5">
                {/* Enable direct downloads */}
                <div>
                  <p className="text-[13px] font-semibold text-white mb-2">Enable direct downloads</p>
                  <div className="flex items-center gap-0 rounded-lg border border-[#2a2a2a] overflow-hidden text-[12px] font-semibold">
                    {([
                      { key: "dont-change", label: "Don't Change" },
                      { key: "all-on",      label: "All on"       },
                      { key: "all-off",     label: "All off"      },
                    ] as const).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDownloads(key)}
                        className={`flex-1 py-2 transition-colors cursor-pointer ${
                          downloads === key ? "bg-white text-black" : "bg-transparent text-[#888] hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Toggles */}
                {[
                  { label: "Allow people to comment on your track", value: allowComments, onChange: setAllowComments },
                  { label: "Show track comments to public",         value: showComments,  onChange: setShowComments  },
                  { label: "Show track stats to public",            value: showStats,     onChange: setShowStats     },
                ].map(({ label, value, onChange }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[13px] text-white">{label}</span>
                    <div className="flex items-center gap-2">
                      <RiLockFill className="text-[#555] text-[13px]" />
                      <Toggle value={value} onChange={onChange} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#2a2a2a] px-6 py-4">
          <button
            type="button"
            className="rounded-full bg-[#333] px-7 py-2.5 text-[13px] font-bold text-white hover:bg-[#444] transition-colors cursor-pointer"
          >
            Apply changes
          </button>
        </div>
      </div>
    </>
  );
}


// ─── Add to Playlist Panel ────────────────────────────────────────────────────
function AddToPlaylistPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-[600px] flex-col bg-[#111] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-6 py-4">
          <button type="button" onClick={onClose} className="text-[#888] hover:text-white transition-colors text-[18px] leading-none">✕</button>
          <h2 className="text-[16px] font-bold text-white">Add to playlist</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <button
            type="button"
            className="flex items-center gap-4 w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 hover:border-[#3a3a3a] transition-colors"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2a] text-white">
              <span className="text-[24px] font-thin leading-none">+</span>
            </div>
            <span className="text-[14px] font-semibold text-white">Create playlist</span>
          </button>
        </div>
      </div>
    </>
  );
}


// ─── Bulk Selection Header ────────────────────────────────────────────────────
function BulkSelectionHeader({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onEditSelected,
  onAddSelectedToPlaylist,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onEditSelected: () => void;
  onAddSelectedToPlaylist: () => void;
}) {
  const allSelected = selectedCount === totalCount;

  return (
    <div
      className="grid items-center border-b border-[#2a2a2a] px-3 pb-2 pt-2"
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
    >
      <div className="flex items-center">
        <Checkbox
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={(v) => (v ? onSelectAll() : onDeselectAll())}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-white">{selectedCount} SELECTED</span>
        <button
          type="button"
          onClick={onEditSelected}
          title="Edit selected"
          className="flex items-center justify-center rounded p-1 text-[#888] hover:text-white transition-colors"
        >
          <FiEdit2 className="text-[15px]" />
        </button>
        <button
          type="button"
          onClick={onAddSelectedToPlaylist}
          title="Add to playlist"
          className="flex items-center justify-center rounded p-1 text-[#888] hover:text-white transition-colors"
        >
          <FiPlusSquare className="text-[15px]" />
        </button>
      </div>
      <div /><div /><div /><div /><div /><div />
    </div>
  );
}


// ─── Artist Studio Header ─────────────────────────────────────────────────────
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

function ArtistStudioHeader({ stats }: {
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


// ─── Track Row ────────────────────────────────────────────────────────────────
function TrackRow({
  track,
  isMobile,
  isSelected,
  onSelect,
  onAmplify,
  onContextMenu,
}: {
  track: ArtistTrackRow;
  isMobile: boolean;
  isSelected: boolean;
  onSelect: (id: string, v: boolean) => void;
  onAmplify: (id: string) => void;
  onContextMenu: (id: string, e: React.MouseEvent) => void;
}) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useAppSelector((state: RootState) => state.player);
  const [isHovered, setIsHovered] = useState(false);
  const rowIsPlaying = String(currentTrackId) === String(track.id) && isPlaying;

  const togglePlay = () => {
    if (!track.url) return;
    if (rowIsPlaying) { dispatch(pause()); return; }
    dispatch(playAudio({
      tracks: [{ id: track.id, url: track.url, title: track.title, artist: track.label, img: track.cover }],
      startId: track.id,
    }));
    setTimeout(() => dispatch(play()), 0);
  };

  const trackCover = (
    <button
      type="button"
      onClick={togglePlay}
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-[#222] cursor-pointer"
      aria-label={rowIsPlaying ? "Pause track" : "Play track"}
    >
      <img
        src={track.cover}
        alt={track.title}
        className="h-full w-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith("/test.jpg")) return;
          target.src = "/test.jpg";
        }}
      />
      {(isHovered || rowIsPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          {rowIsPlaying
            ? <IoPauseCircleSharp className="text-white text-[32px]" />
            : <IoIosPlayCircle    className="text-white text-[32px]" />
          }
        </div>
      )}
    </button>
  );

  const trackMeta = (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate text-[13px] font-medium text-white">{track.title}</span>
        {track.hd && <span className="shrink-0 rounded bg-[#555] px-1 py-px text-[9px] font-bold text-white">HD</span>}
      </div>
      <p className="text-[11px] text-[#888]">{track.label}</p>
    </div>
  );

  const rowBg = isSelected
    ? "bg-[#1d1d2e]"
    : isHovered || rowIsPlaying
    ? "bg-[#1a1a1a]"
    : "bg-transparent";

  if (isMobile) {
    return (
      <div
        className={`border-b border-[#1e1e1e] px-3 py-2.5 ${rowBg}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {trackCover}
          <div className="flex-1 min-w-0">{trackMeta}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid items-center border-b border-[#1e1e1e] px-3 py-2 transition-colors ${rowBg}`}
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <Checkbox checked={isSelected} onChange={(v) => onSelect(track.id, v)} />
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {trackCover}
        {trackMeta}
      </div>

      <div className="text-center text-[12px] text-[#aaa]">{track.duration}</div>
      <div className="text-center text-[12px] text-[#aaa]">{track.date}</div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-[#777]">
        <span className="inline-flex items-center gap-1"><IoHeartOutline />   {track.likes    > 0 ? track.likes    : "-"}</span>
        <span className="inline-flex items-center gap-1"><FiMessageSquare /> {track.comments > 0 ? track.comments : "-"}</span>
        <span className="inline-flex items-center gap-1"><TbRepeat />        {track.reposts  > 0 ? track.reposts  : "-"}</span>
        <span className="inline-flex items-center gap-1"><FaRegClock />      -</span>
      </div>

      <div className="text-right text-[13px] font-semibold text-[#aaa]">{track.plays}</div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onAmplify(track.id)}
          className="flex items-center gap-1 rounded-full bg-linear-to-br from-[#7b4fff] to-[#5533ff] px-3 py-1 text-[11px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          <BsLightningChargeFill /> Amplify
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => onContextMenu(track.id, e)}
          className="text-[18px] text-[#666] hover:text-[#aaa] transition-colors"
          aria-label="Track actions"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}


// ─── Artist Pro Benefits ──────────────────────────────────────────────────────
function BenefitCard({ img, title, save, fallback }: { img: string; title: string; save: string; fallback: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-[#1a1a1a]">
      <div className="relative h-36 w-full bg-linear-to-br from-[#2b2b2b] via-[#1d1d1d] to-[#111] overflow-hidden">
        <img src={img} alt={title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)", background: "rgba(0,0,0,0.7)" }} />
        <img src={fallback} className="pointer-events-none absolute bottom-10 left-0 text-[18px] font-bold text-white/85 z-20" onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
      </div>
      <div className="p-3">
        <p className="text-[12px] font-semibold leading-tight text-white">{title}</p>
        <span className="mt-1 inline-block rounded bg-[#232323] px-2 py-0.5 text-[11px] font-bold text-[#f7c873]">{save}</span>
      </div>
    </div>
  );
}

function ArtistProBenefits() {
  return (
    <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-white">Artist Pro Membership Benefits</h3>
          <p className="mt-1 text-[13px] text-[#888]">
            Jump start your music career with Artist Pro and immediately unlock $100+ in premium music tools and services.
          </p>
        </div>
        <button type="button" className="shrink-0 rounded-full border border-white px-5 py-2 text-[13px] font-bold text-white hover:bg-white hover:text-black transition-colors">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BenefitCard img="/artists-icons/man-headphones.svg" title="Get 2 free months of Splice Sounds+ royalty-free samples" save="Save $25.98" fallback="/artists-icons/splice.svg" />
        <BenefitCard img="/artists-icons/send-campaign.svg"  title="Get 20% off all campaigns on Groover.co and free hype add-on" save="Save $21" fallback="/artists-icons/groover.svg" />
        <BenefitCard img="/artists-icons/dg-set.svg"         title="Get 1 month free of Native Instrument's 360 Pro suite" save="Save $50" fallback="/artists-icons/NI.svg" />
        <BenefitCard img="/artists-icons/edit-tracks.svg"    title="Get 3 free months of Output's Arcade plug-in and samples" save="Save $39" fallback="/artists-icons/arcade.svg" />
      </div>
    </div>
  );
}


// ─── Tracks Tab ───────────────────────────────────────────────────────────────
function TracksTableHeader({ onSelectAll, allSelected }: { onSelectAll: (v: boolean) => void; allSelected: boolean }) {
  return (
    <div
      className="mt-4 grid border-b border-[#2a2a2a] px-3 pb-2"
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
    >
      <div className="flex items-center">
        <Checkbox checked={allSelected} onChange={onSelectAll} />
      </div>
      <div className="text-[11px] font-bold tracking-[0.8px] text-[#888]">TRACKS</div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">DURATION</div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">DATE</div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">ENGAGEMENTS</div>
      <div className="text-right text-[11px] font-bold tracking-[0.8px] text-[#888]">PLAYS</div>
      <div /><div />
    </div>
  );
}

function TracksActionBar({ onUpload, onDistribute, onMonetize, onMaster }: {
  onUpload: () => void;
  onDistribute: () => void;
  onMonetize: () => void;
  onMaster: () => void;
}) {
  const btnClass = "flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-transparent px-5 py-3 text-[18px] font-semibold text-white transition-colors hover:border-[#555] cursor-pointer";
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={onUpload}     className={btnClass}><span>+ Upload or drop tracks</span></button>
      <button type="button" onClick={onDistribute} className={btnClass}><IoIosGlobe /><span>Distribute tracks</span></button>
      <button type="button" onClick={onMonetize}   className={btnClass}><RiMoneyDollarCircleLine /><span>Monetize tracks</span></button>
      <button type="button" onClick={onMaster}     className={btnClass}><ImEqualizer2 /><span>Master track audio</span></button>
    </div>
  );
}

function SortDropdown({ sortField, sortDir, onSortField, onSortDir }: {
  sortField: SortField;
  sortDir: "asc" | "desc";
  onSortField: (f: SortField) => void;
  onSortDir: (d: "asc" | "desc") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: { label: string; value: SortField }[] = [
    { label: "Date",     value: "date" },
    { label: "Plays",    value: "plays" },
    { label: "Duration", value: "duration" },
    { label: "Likes",    value: "likes" },
  ];

  const handleSelect = (value: SortField) => {
    if (value === sortField) {
      onSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      onSortField(value);
      onSortDir("desc");
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-[#222] px-3 py-1.5 text-[13px] text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer"
      >
        <BsSortDown className="text-sm" />
        {options.find((o) => o.value === sortField)?.label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] py-2 shadow-xl">
          <p className="px-4 pb-2 pt-1 text-[10px] font-bold tracking-widest text-[#555]">SORT BY</p>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-[13px] hover:bg-[#252525] transition-colors cursor-pointer"
            >
              <span className={sortField === opt.value ? "font-bold text-white" : "font-normal text-[#ccc]"}>{opt.label}</span>
              {sortField === opt.value && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TracksFilterBar({ isMobile, search, onSearch, filter, onFilter, count, sortField, onSortField, sortDir, onSortDir }: {
  isMobile: boolean;
  search: string;
  onSearch: (v: string) => void;
  filter: "public" | "private";
  onFilter: (v: "public" | "private") => void;
  count: number;
  sortField: SortField;
  onSortField: (f: SortField) => void;
  sortDir: "asc" | "desc";
  onSortDir: (d: "asc" | "desc") => void;
}) {
  const pillClass = (active: boolean) =>
    `rounded-full border px-5 py-1.5 text-[13px] transition-colors cursor-pointer ${
      active ? "border-white text-white" : "border-[#444] text-[#888] hover:border-[#666]"
    }`;

  return (
    <div className="mb-0 flex flex-wrap items-center gap-2.5">
      <div className={`relative ${isMobile ? "w-full" : "w-72"}`}>
        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-[14px]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tracks"
          className="w-full rounded-full border border-[#333] bg-transparent py-1.5 pl-9 pr-3 text-[13px] text-white outline-none placeholder:text-[#666] focus:border-[#555]"
        />
      </div>
      <button type="button" onClick={() => onFilter("public")}  className={pillClass(filter === "public")}>Public</button>
      <button type="button" onClick={() => onFilter("private")} className={pillClass(filter === "private")}>Private</button>
      <div className={`flex items-center gap-2 text-[13px] ${isMobile ? "w-full justify-between" : "ml-auto"}`}>
        <span className="font-semibold text-white">{count} tracks</span>
        <SortDropdown sortField={sortField} onSortField={onSortField} sortDir={sortDir} onSortDir={onSortDir} />
      </div>
    </div>
  );
}

function TracksTab({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { getPostedTracks, tracks: postedTracks, loading, error } = useGetPostedTracks();
  const [filter, setFilter]       = useState<"public" | "private">("public");
  const [search, setSearch]       = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");
  const [durationById, setDurationById] = useState<Record<string, string>>({});

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string, v: boolean) =>
    setSelectedIds((prev) => { const s = new Set(prev); v ? s.add(id) : s.delete(id); return s; });

  // Panels & modals
  const [amplifyOpen, setAmplifyOpen]             = useState(false);
  const [editTrackId, setEditTrackId]             = useState<string | null>(null);
  const [bulkEditOpen, setBulkEditOpen]           = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [contextMenu, setContextMenu]             = useState<{ id: string; x: number; y: number } | null>(null);

  const openContextMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!hasHydrated || !userId || typeof userId !== "string" || userId.trim() === "") return;
    void getPostedTracks(userId);
  }, [userId, getPostedTracks, hasHydrated]);

  const rows = useMemo<ArtistTrackRow[]>(() => {
    return (postedTracks ?? [])
      .map((track) => ({
        id: track._id,
        title: track.basicInfo.title,
        label: track.basicInfo.mainArtists?.length ? track.basicInfo.mainArtists.join(", ") : "Unknown Artist",
        duration: formatDuration((track as { durationInSeconds?: number }).durationInSeconds),
        date: formatDate(track.releaseDate),
        plays: track.numPlays ?? 0,
        likes: track.numLikes ?? 0,
        comments: track.numComments ?? 0,
        reposts: track.numReposts ?? 0,
        hd: false,
        cover: track.image?.imgLink || "/test.jpg",
        url: track.audio?.audioLink || track.audioLink || "",
        isPrivate: Boolean(track.basicInfo.isPrivate),
        rawDate: track.releaseDate ?? "",
        rawDuration: (track as { durationInSeconds?: number }).durationInSeconds ?? 0,
      }))
      .filter((row) => (filter === "public" ? !row.isPrivate : row.isPrivate))
      .filter((row) => row.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let diff = 0;
        if      (sortField === "date")     diff = new Date(a.rawDate ?? "").getTime() - new Date(b.rawDate ?? "").getTime();
        else if (sortField === "plays")    diff = a.plays - b.plays;
        else if (sortField === "duration") diff = (a.rawDuration ?? 0) - (b.rawDuration ?? 0);
        else if (sortField === "likes")    diff = a.likes - b.likes;
        return sortDir === "asc" ? diff : -diff;
      });
  }, [postedTracks, filter, search, sortField, sortDir]);

  useEffect(() => {
    rows.forEach((row) => {
      if (!row.url || row.duration !== "--" || durationById[row.id]) return;
      const audio = new Audio(row.url);
      audio.addEventListener("loadedmetadata", () => {
        setDurationById((prev) => ({ ...prev, [row.id]: formatDuration(audio.duration) }));
      }, { once: true });
    });
  }, [rows, durationById]);

  const selectAll   = () => setSelectedIds(new Set(rows.map((r) => r.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const hasSelection = selectedIds.size > 0;
  const allSelected  = selectedIds.size === rows.length && rows.length > 0;
  const editTrack    = rows.find((r) => r.id === editTrackId) ?? null;

  return (
    <div className="space-y-4">
      <TracksActionBar
        onUpload={     () => router.push("/upload")}
        onDistribute={ () => router.push("/artistpro")}
        onMonetize={   () => router.push("/artistpro")}
        onMaster={     () => router.push("/upload")}
      />
      <TracksFilterBar
        isMobile={isMobile}
        search={search}       onSearch={setSearch}
        filter={filter}       onFilter={setFilter}
        count={rows.length}
        sortField={sortField} onSortField={setSortField}
        sortDir={sortDir}     onSortDir={setSortDir}
      />

      {!isMobile && (
        hasSelection ? (
          <BulkSelectionHeader
            selectedCount={selectedIds.size}
            totalCount={rows.length}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onEditSelected={() => {
              if (selectedIds.size > 1) {
                setBulkEditOpen(true);
              } else {
                const firstId = Array.from(selectedIds)[0];
                if (firstId) setEditTrackId(firstId);
              }
            }}
            onAddSelectedToPlaylist={() => setAddToPlaylistOpen(true)}
          />
        ) : (
          <TracksTableHeader allSelected={allSelected} onSelectAll={(v) => v ? selectAll() : deselectAll()} />
        )
      )}

      {loading && <div className="px-3 py-6 text-[13px] text-[#888]">Loading tracks…</div>}
      {!loading && !isAuthenticated && <div className="px-3 py-6 text-[13px] text-red-400">You must be logged in to view your tracks.</div>}
      {!loading && isAuthenticated && error && <div className="px-3 py-6 text-[13px] text-red-400">Failed to load tracks. Please try again.</div>}
      {!loading && isAuthenticated && !error && rows.length === 0 && <div className="px-3 py-6 text-[13px] text-[#888]">No tracks found.</div>}
      {!loading && isAuthenticated && !error && rows.map((track) => (
        <TrackRow
          key={track.id}
          track={{ ...track, duration: durationById[track.id] || track.duration }}
          isMobile={isMobile}
          isSelected={selectedIds.has(track.id)}
          onSelect={toggleSelect}
          onAmplify={() => setAmplifyOpen(true)}
          onContextMenu={openContextMenu}
        />
      ))}

      <ArtistProBenefits />

      {amplifyOpen && (
        <AmplifyModal onClose={() => setAmplifyOpen(false)} onUnlock={() => router.push("/artistpro")} />
      )}
      {contextMenu && (
        <TrackContextMenu
          trackId={contextMenu.id}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onEdit={(id) => setEditTrackId(id)}
          onAddToPlaylist={() => setAddToPlaylistOpen(true)}
          onDelete={(id) => console.log("delete", id)}
        />
      )}
      {editTrack    && <EditTrackPanel track={editTrack} onClose={() => setEditTrackId(null)} />}
      {bulkEditOpen && <BulkEditPanel selectedIds={selectedIds} tracks={rows} onClose={() => setBulkEditOpen(false)} />}
      {addToPlaylistOpen && <AddToPlaylistPanel onClose={() => setAddToPlaylistOpen(false)} />}
    </div>
  );
}


// ─── Distribution Tab ─────────────────────────────────────────────────────────
function StreamingPlatformItem({ mark, className }: { mark: string; className: string }) {
  return (
    <div className="flex min-h-8 items-center justify-center text-[#f0f0f0] opacity-90">
      <span className={`text-[18px] ${className}`}>{mark}</span>
    </div>
  );
}

function DistributionHowItWorksStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="shrink-0 text-[60px] font-black leading-none text-[#2a2a2a]">{num}</span>
      <div className="pt-3">
        <h4 className="text-[15px] font-bold text-white">{title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{body}</p>
      </div>
    </div>
  );
}

function DistributionTab() {
  const router = useRouter();
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[28px] font-bold leading-tight text-white">
            Distribute your music to Spotify, Apple Music, YouTube, and more
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            As an Artist Pro subscriber, you get unlimited music distribution to all the major streaming platforms like Spotify, YouTube Music, Apple Music, TIDAL, and more all around the world.
          </p>
          <button type="button" onClick={() => router.push("/artistpro")} className="mt-4 rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors">
            Get Artist Pro
          </button>
        </div>
        <div className="hidden lg:flex shrink-0">
          <div className="relative h-52 w-50">
            <img src="artists-icons/music-globe.svg" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-x-8 gap-y-6 border-b border-[#262626] pb-8 md:grid-cols-5 lg:grid-cols-9">
        <StreamingPlatformItem mark="Spotify"      className="font-bold" />
        <StreamingPlatformItem mark="Apple Music"  className="font-medium" />
        <StreamingPlatformItem mark="DEEZER"       className="font-semibold tracking-[1px]" />
        <StreamingPlatformItem mark="amazon music" className="font-semibold lowercase" />
        <StreamingPlatformItem mark="TikTok"       className="font-bold" />
        <StreamingPlatformItem mark="Instagram"    className="font-medium" />
        <StreamingPlatformItem mark="YouTube"      className="font-bold" />
        <StreamingPlatformItem mark="TIDAL"        className="font-semibold tracking-[2px]" />
        <StreamingPlatformItem mark="pandora"      className="font-semibold lowercase" />
      </div>

      <div className="mt-2 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <DistributionHowItWorksStep num="1" title="Select your membership"    body="Choose the membership plan that works best for you. Get started with distribution for as little as $3.25 a month." />
          <DistributionHowItWorksStep num="2" title="Create your release"       body="We'll guide you through the simple steps to add credits and release information to make sure you get paid for your plays." />
          <DistributionHowItWorksStep num="3" title="We'll deliver your tracks" body="We'll double-check your release to help ensure it is successfully delivered to Spotify, Apple Music, TIDAL and so many more." />
        </div>
      </div>
    </div>
  );
}


// ─── Vinyl Tab ────────────────────────────────────────────────────────────────
function VinylPricingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-16">
      <span className="text-[14px] font-semibold text-white">{label}</span>
      <span className="text-[16px] font-black text-white">{value}</span>
    </div>
  );
}

function VinylHowItWorksStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="shrink-0 text-[60px] font-black leading-none text-[#2a2a2a]">{num}</span>
      <div className="pt-3">
        <h4 className="text-[15px] font-bold text-white">{title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{body}</p>
      </div>
    </div>
  );
}

function VinylTab() {
  const router = useRouter();
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-[#333] px-2 py-0.5 text-[10px] font-bold text-yellow-400">★ ARTIST PRO</span>
          </div>
          <h2 className="text-[28px] font-bold leading-tight text-white">Your music. On vinyl. On demand</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            We're partnering with elasticStage to{" "}
            <span className="font-semibold text-white">release your albums on vinyl, on-demand, with no up-front cost to you.</span>
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#aaa]">
            You and your fans can purchase just one record or a thousand. Either way, you get paid for every sale.
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => router.push("/artistpro")} className="rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors">Get Artist Pro</button>
            <button type="button" className="rounded-full border border-[#444] bg-transparent px-7 py-2.5 text-[14px] font-bold text-white hover:border-[#666] transition-colors">Learn More</button>
          </div>
        </div>
        <div className="hidden lg:flex shrink-0 items-center justify-center">
          <div className="relative h-64 w-80">
            <img src="artists-icons/record.png" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#262626] pt-8">
        <h3 className="mb-5 text-[18px] font-bold text-white">No upfront cost to you</h3>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex items-start gap-5">
            <span className="shrink-0 text-[92px] font-black leading-none text-transparent [-webkit-text-stroke:2px_#8c8c8c]">$0</span>
            <div>
              <p className="text-[16px] font-bold text-white">You pay nothing to create a record.</p>
              <p className="mt-1 text-[13px] text-[#888]">Your fans pay for every purchase, and we pass the royalties on to you.</p>
            </div>
          </div>
          <div className="shrink-0 space-y-2">
            <VinylPricingRow label="Your upfront cost"   value="$0" />
            <VinylPricingRow label="Sales price for fan" value="$39*" />
            <VinylPricingRow label="Royalties you earn"  value="$11*" />
            <p className="pt-1 text-[11px] text-[#666]">*Prices vary slightly due to currency conversions.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <VinylHowItWorksStep num="1" title="Create your new record from your tracks."      body="Just pick your tracks on SoundCloud, add credits, upload artwork, and submit your new record for review." />
          <VinylHowItWorksStep num="2" title="We create a web page and list your record for sale." body="No need to worry about out-of-pocket fees or leftover stock. Each album will cost your fans around $39 plus shipping and handling." />
          <VinylHowItWorksStep num="3" title="We print and ship your record. You get paid." body="Records are shipped to fans within weeks of their order. And every record sold means you get paid." />
        </div>
      </div>
    </div>
  );
}


// ─── Comments Tab ─────────────────────────────────────────────────────────────
function CommentBubble({ text, rightOffset, topOffset }: { text: string; rightOffset: number; topOffset: number }) {
  return (
    <div
      className="absolute rounded-full px-5 py-2 text-[14px] font-semibold text-[#1b1b1b] shadow-lg"
      style={{ backgroundColor: "#f39f86", right: `${rightOffset}px`, top: `${topOffset}px` }}
    >
      {text}
      <div className="absolute -bottom-2 right-5 h-4 w-4 rotate-45" style={{ backgroundColor: "#f39f86" }} />
    </div>
  );
}

function CommentsTab() {
  const router = useRouter();
  return (
    <div className="min-h-100 border-[#262626] pt-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-[#333] px-2 py-0.5 text-[10px] font-bold text-yellow-400">★ ARTIST PRO</span>
          </div>
          <h2 className="mb-6 text-[32px] font-bold text-white">Every comment in one place</h2>
          <p className="max-w-xl text-[14px] leading-relaxed text-[#aaa]">
            With Artist Pro, you get access to Comments Hub which brings together every comment across all of your tracks,
            so you can easily see what fans are saying about you. Read, moderate and respond to your comments, all in one place.
          </p>
          <button type="button" onClick={() => router.push("/artistpro")} className="mt-6 rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors">
            Get Artist Pro
          </button>
        </div>
        <div className="relative h-56 w-full">
          <CommentBubble text="Addicted 😍"           rightOffset={0}  topOffset={0} />
          <CommentBubble text="I need a 10hr version" rightOffset={32} topOffset={52} />
          <CommentBubble text="nah this is sick 🔥"   rightOffset={64} topOffset={104} />
        </div>
      </div>
    </div>
  );
}


// ─── Promotions Tab ───────────────────────────────────────────────────────────
function SpotifyLogo()     { return <div className="text-[48px] font-bold text-[#1DB954]">Spotify®</div>; }
function AmazonMusicLogo() { return <div className="text-center"><div className="text-[32px] font-bold text-white">amazon</div><div className="text-[20px] font-bold text-white">music</div></div>; }
function GrooverLogo()     { return <div className="text-center"><div className="text-[48px] font-bold text-[#FF4500]">|||</div><div className="text-[24px] font-bold text-[#FF4500]">Groover</div></div>; }

function PromotionCard({ title, body, requirements, cta, logo }: {
  title: string; body: string; requirements: string[]; cta: string; logo: React.ReactNode;
}) {
  return (
    <article className="flex min-h-132.5 flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#161616]">
      <div className="flex h-48 items-center justify-center bg-[#1a1a1a]">{logo}</div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-[16px] font-bold text-white">{title}</h3>
        <p className="text-[13px] leading-relaxed text-[#aaa]">{body}</p>
        {requirements.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-[12px] font-bold text-white">Eligibility requirements</p>
            <ul className="space-y-1">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#888]">
                  <span className="mt-0.5 text-[#666]">✦</span>{req}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto flex justify-end pt-5">
          <button type="button" className="rounded-full bg-white px-5 py-2 text-[13px] font-bold text-black hover:bg-[#eee] transition-colors">{cta}</button>
        </div>
      </div>
    </article>
  );
}

function PromotionsTab() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <PromotionCard
        logo={<SpotifyLogo />}
        title="Pitch your track to Spotify"
        body="Use Spotify for Artists to pitch an upcoming, unreleased song to their playlist editors. Pitching your song will also make it eligible to your followers' Release Radar playlists."
        requirements={["You can only pitch one track per release."]}
        cta="Visit Page"
      />
      <PromotionCard
        logo={<AmazonMusicLogo />}
        title="Pitch your track to Amazon Music"
        body="Use Amazon Music for Artists to pitch a new song to their playlist editors. You can pitch up to 14 days past release."
        requirements={["You can only pitch one track per release.", "If you do not have access to AMFA, you must first claim your account."]}
        cta="Visit Page"
      />
      <PromotionCard
        logo={<GrooverLogo />}
        title="Groover"
        body={"Promote your music, get listened to and receive GUARANTEED feedback. Groover connects artists with the best curators, radios and labels seeking emerging talents.\n\nWith Artist Pro, you get 20% off your first Groover campaign and a free Hype add-on."}
        requirements={[]}
        cta="Get Started"
      />
    </div>
  );
}


// ─── Tab Bar ─────────────────────────────────────────────────────────────────
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


// ─── Upload Quota Banner ──────────────────────────────────────────────────────
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


// ─── Root Export ──────────────────────────────────────────────────────────────
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