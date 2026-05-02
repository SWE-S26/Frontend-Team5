"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import type { PlaylistDetail, PlaylistTrack } from "@/types/playlists.types";
import { useState, useRef } from "react";
import { X, Camera, ChevronDown, Calendar } from "lucide-react";
import {
  parseIsoDate,
  formatIsoDate,
  formatDisplayDate,
  isSameDay,
} from "@/components/upload/TrackInfoForm";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  playlist?: PlaylistDetail | null;
  isSaving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (data?: any) => Promise<void> | void;
};

const GENRES = [
  "None", "Alternative Rock", "Ambient", "Classical", "Country",
  "Dance & EDM", "Dancehall", "Deep House", "Disco", "Drum & Bass",
  "Electronic", "Folk & Singer-Songwriter", "Hip-hop & Rap", "House",
  "Indie", "Jazz & Blues", "Latin", "Metal", "Piano", "Pop",
  "R&B & Soul", "Reggae", "Reggaeton", "Rock", "Soundtrack",
  "Techno", "Trance", "Trap", "Triphop", "World",
];

export default function EditPlaylistModal({
  isOpen,
  playlist,
  isSaving = false,
  error,
  onClose,
  onSave,
}: Props) {
  const [activeTab, setActiveTab] = useState<"basic" | "tracks" | "meta">("basic");

  const [title, setTitle] = useState(playlist?.title ?? "");
  const [permalink, setPermalink] = useState(
    playlist?.title?.toLowerCase().replace(/\s+/g, "-") ?? ""
  );
  const [playlistType, setPlaylistType] = useState("Playlist");
  const [genre, setGenre] = useState("None");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [privacy, setPrivacy] = useState<"public" | "private">(
    playlist?.isPrivate ? "private" : "public"
  );

  const [buyLink, setBuyLink] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [license, setLicense] = useState<"all-rights" | "creative-commons">("all-rights");

  const tracks: PlaylistTrack[] = playlist?.tracks ?? [];

  function toInputDate(val?: string | null) {
    if (!val) return "";
    if (val.includes("/")) {
      const parts = val.split("/");
      if (parts.length === 3) {
        const [d, m, y] = parts;
        return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    const iso = val.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    return "";
  }

  const [initReleaseDate] = useState(() => toInputDate((playlist as any)?.releaseDate ?? ""));
  const [releaseDateState, setReleaseDateState] = useState<string>(initReleaseDate);

  const [releaseCalendarOpen, setReleaseCalendarOpen] = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState<Date>(() => {
    const parsed = parseIsoDate(releaseDateState);
    return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date();
  });
  const [selectedReleaseDate, setSelectedReleaseDate] = useState<Date | null>(() => parseIsoDate(releaseDateState));
  const releaseCalendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const parsed = parseIsoDate(releaseDateState);
    if (parsed) setReleaseCalendarMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    setSelectedReleaseDate(parsed);
  }, [releaseDateState]);

  const releaseDate = releaseDateState;
  const setReleaseDate = setReleaseDateState;

  const calendarMonthStart = new Date(releaseCalendarMonth.getFullYear(), releaseCalendarMonth.getMonth(), 1);
  const calendarGridStart = new Date(
    calendarMonthStart.getFullYear(),
    calendarMonthStart.getMonth(),
    1 - calendarMonthStart.getDay(),
  );
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(calendarGridStart);
    day.setDate(calendarGridStart.getDate() + i);
    return day;
  });

  function openReleaseCalendar() {
    const baseDate = selectedReleaseDate || new Date();
    setReleaseCalendarMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setReleaseCalendarOpen(true);
  }

  function shiftReleaseCalendarMonth(delta: number) {
    setReleaseCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  function handleSelectReleaseDate(date: Date) {
    setReleaseDate(formatIsoDate(date));
    setSelectedReleaseDate(date);
    setReleaseCalendarOpen(false);
  }

  function formatDuration(seconds?: number | null) {
    const s = Math.max(0, Math.floor(seconds ?? 0));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const tabs = [
    { key: "basic", label: "Basic info" },
    { key: "tracks", label: "Tracks" },
    { key: "meta", label: "Metadata" },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-1001 flex items-start justify-center pt-10"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="relative flex flex-col w-150 bg-[#111] rounded-md overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header tabs */}
            <div className="flex items-center gap-0 px-6 pt-5 pb-0 border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`mr-6 pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab.key
                      ? "text-white border-white"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Camera icon top-right */}
              <button className="ml-auto mb-3 text-white/40 hover:text-white transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

              {/* ── BASIC INFO ── */}
              {activeTab === "basic" && (
                <div className="flex gap-5 p-6">
                  {/* Cover image */}
                  <div className="shrink-0">
                    <div className="relative h-42.5 w-42.5 rounded-sm overflow-hidden bg-linear-to-br from-[#a18cd1] to-[#fbc2eb] cursor-pointer group">
                      {playlist?.image?.imgLink && (
                        <img
                          src={playlist.image.imgLink}
                          alt="cover"
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-end justify-center pb-3 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-sm">
                          Upload image
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Title */}
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-1">
                        Title <span className="text-[#f50]">*</span>
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>

                    {/* Permalink */}
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-1">
                        Permalink <span className="text-[#f50]">*</span>
                      </label>
                      <div className="flex items-center bg-[#222] border border-transparent focus-within:border-white/30 rounded-sm overflow-hidden">
                        <span className="px-3 py-2 text-xs text-white/40 whitespace-nowrap shrink-0">
                          soundcloud.com/{playlist?.artistId ?? "you"}/sets/
                        </span>
                        <input
                          value={permalink}
                          onChange={(e) => setPermalink(e.target.value)}
                          className="flex-1 bg-transparent py-2 pr-3 text-sm text-white outline-none min-w-0"
                        />
                      </div>
                    </div>

                    {/* Playlist type + Release date */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-[13px] font-semibold text-white mb-1">
                          Playlist type
                        </label>
                        <div className="relative">
                          <select
                            value={playlistType}
                            onChange={(e) => setPlaylistType(e.target.value)}
                            className="w-full appearance-none bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none cursor-pointer pr-8"
                          >
                            <option>Playlist</option>
                            <option>Album</option>
                            <option>EP</option>
                            <option>Single</option>
                            <option>Compilation</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-semibold text-white mb-1">
                          Release date
                        </label>
                        <div className="relative" ref={releaseCalendarRef}>
                          <div className="relative max-w-full">
                            <input
                              type="text"
                              value={formatDisplayDate(releaseDate)}
                              readOnly
                              onClick={openReleaseCalendar}
                              placeholder="MM/DD/YYYY"
                              className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 pr-9 cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setReleaseCalendarOpen((prev) => !prev)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                              aria-label="Open release date calendar"
                            >
                              <Calendar className="h-5 w-5" />
                            </button>
                          </div>

                          {releaseCalendarOpen && (
                            <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-md border border-[#2f3035] bg-[#0b0b0b] p-3 shadow-xl sm:w-72">
                              <div className="mb-2 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => shiftReleaseCalendarMonth(-1)}
                                  className="rounded px-2 py-1 text-white/80 hover:bg-[#2a2b31] hover:text-white"
                                  aria-label="Previous month"
                                >
                                  {"<"}
                                </button>
                                <p className="text-[12px] font-semibold text-white">
                                  {calendarMonthStart.toLocaleString("en-US", { month: "long", year: "numeric" })}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => shiftReleaseCalendarMonth(1)}
                                  className="rounded px-2 py-1 text-white/80 hover:bg-[#2a2b31] hover:text-white"
                                  aria-label="Next month"
                                >
                                  {">"}
                                </button>
                              </div>
                              <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-[#8a8a91]">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                  <span key={day}>{day}</span>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day) => {
                                  const inCurrentMonth = day.getMonth() === calendarMonthStart.getMonth();
                                  const isSelected = selectedReleaseDate ? isSameDay(day, selectedReleaseDate) : false;
                                  const isToday = isSameDay(day, new Date());
                                  return (
                                    <button
                                      key={day.toISOString()}
                                      type="button"
                                      onClick={() => handleSelectReleaseDate(day)}
                                      className={`h-8 rounded text-[11px] transition-colors ${
                                        isSelected
                                          ? "bg-[#1db954] text-black font-bold"
                                          : inCurrentMonth
                                          ? isToday
                                            ? "border border-[#1db954] text-white"
                                            : "text-white hover:bg-[#2a2b31]"
                                          : "text-[#666] hover:bg-[#222]"
                                      }`}
                                    >
                                      {day.getDate()}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Genre */}
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-1">
                        Genre
                      </label>
                      <div className="relative">
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          className="w-full appearance-none bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none cursor-pointer pr-8"
                        >
                          {GENRES.map((g) => <option key={g}>{g}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      </div>
                    </div>

                    {/* Additional tags */}
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-1">
                        Additional tags
                      </label>
                      <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Add tags to describe the genre and mood of your playlist"
                        className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-1">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your playlist"
                        rows={4}
                        className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 resize-none"
                      />
                    </div>

                    {/* Privacy */}
                    <div>
                      <p className="text-[13px] font-semibold text-white mb-2">Privacy:</p>
                      <label className="flex items-center gap-2 cursor-pointer mb-1">
                        <input
                          type="radio"
                          name="privacy"
                          checked={privacy === "public"}
                          onChange={() => setPrivacy("public")}
                          className="accent-white"
                        />
                        <span className="text-sm text-white">Public</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy"
                          checked={privacy === "private"}
                          onChange={() => setPrivacy("private")}
                          className="accent-white"
                        />
                        <span className="text-sm text-white">Private</span>
                      </label>
                      {privacy === "private" && (
                        <p className="text-xs text-white/50 mt-1 ml-5">
                          Only you and people you share a{" "}
                          <span className="text-white/80">secret link</span>{" "}
                          with will be able to listen to this playlist.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TRACKS ── */}
              {activeTab === "tracks" && (
                <div className="px-6 py-5">
                  {tracks.length === 0 ? (
                    <p className="text-sm text-white/40">No tracks in this playlist.</p>
                  ) : (
                    <div className="space-y-1">
                      {tracks.map((track) => (
                        <div
                          key={track._id}
                          className="flex items-center gap-3 py-2 border-b border-white/5 group"
                        >
                          <img
                            src={track.image?.imgLink ?? "/test.jpg"}
                            alt=""
                            className="h-9 w-9 rounded-sm object-cover shrink-0"
                          />
                          <span className="flex-1 text-sm text-white truncate">
                            {track.basicInfo?.title ?? "Untitled"}
                          </span>
                          <span className="text-xs text-white/40 shrink-0">
                            {formatDuration(track.durationInSeconds)}
                          </span>
                          <button
                            type="button"
                            className="text-white/30 hover:text-white transition-colors ml-2"
                            aria-label="Remove track"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── METADATA ── */}
              {activeTab === "meta" && (
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-white mb-1">
                      Buy-link
                    </label>
                    <input
                      value={buyLink}
                      onChange={(e) => setBuyLink(e.target.value)}
                      className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-white mb-1">
                      Record label
                    </label>
                    <input
                      value={recordLabel}
                      onChange={(e) => setRecordLabel(e.target.value)}
                      className="w-full bg-[#222] border border-transparent focus:border-white/30 rounded-sm px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-white mb-2">
                      License{" "}
                      <span className="text-white/40 font-normal">ℹ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="radio"
                        name="license"
                        checked={license === "all-rights"}
                        onChange={() => setLicense("all-rights")}
                        className="accent-white"
                      />
                      <span className="text-sm text-white">All Rights Reserved</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="license"
                        checked={license === "creative-commons"}
                        onChange={() => setLicense("creative-commons")}
                        className="accent-white"
                      />
                      <span className="text-sm text-white">Creative Commons</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                <span className="text-[#f50]">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void onSave({
                    title, permalink, playlistType, releaseDate,
                    genre, tags, description, privacy,
                    buyLink, recordLabel, license,
                  })}
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-semibold bg-[#222] text-white rounded-sm hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>

            {error && (
              <p className="px-6 pb-3 text-xs text-red-400">{error}</p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}