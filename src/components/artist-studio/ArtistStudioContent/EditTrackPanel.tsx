import { useState, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine, RiLockFill } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import type { ArtistTrackRow } from "../ArtistStudioContent";


export function EditTrackPanel({ track, onClose }: { track: ArtistTrackRow; onClose: () => void }) {
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