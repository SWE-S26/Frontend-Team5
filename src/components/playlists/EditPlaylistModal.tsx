"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PlaylistDetail, PlaylistTrack } from "@/types/playlists.types";
import { useState, useRef, useEffect } from "react";
import { X, Camera, ChevronDown, Calendar } from "lucide-react";
import {
  parseIsoDate,
  formatIsoDate,
  formatDisplayDate,
  isSameDay,
} from "@/components/upload/TrackInfoForm";
import { useGetPlaylistById } from "@/hooks/usePlaylists";
import { useGetProfile } from "@/hooks/useProfile";

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

  // image
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // basic info
  const [title, setTitle] = useState(playlist?.title ?? "");
  const [permalink, setPermalink] = useState(playlist?.permalink ?? (playlist as any)?.permaLink ?? "");
  const [isPermalinkDirty, setIsPermalinkDirty] = useState(false);
  const lastPlaylistIdRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);
  const [playlistType, setPlaylistType] = useState(() => {
    const pt = (playlist as any)?.playlistType ?? "playlist";
    return pt.charAt(0).toUpperCase() + pt.slice(1);
  });
  const [genre, setGenre] = useState(() => {
    const g = (playlist as any)?.genre ?? "None";
    return GENRES.includes(g) ? g : "None";
  });
  const [tags, setTags] = useState(
    ((playlist as any)?.additionalTags as string[] | undefined)?.join(", ") ?? ""
  );
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [privacy, setPrivacy] = useState<"public" | "private">(
    playlist?.isPrivate ? "private" : "public"
  );

  // metadata
  const [buyLink, setBuyLink] = useState((playlist as any)?.buyLink ?? "");
  const [recordLabel, setRecordLabel] = useState((playlist as any)?.recordLabel ?? "");
  const [license, setLicense] = useState<"all-rights" | "creative-commons">("all-rights");

  // tracks
  const [localTracks, setLocalTracks] = useState<PlaylistTrack[]>(playlist?.tracks ?? []);
  const [creatorProfileLink, setCreatorProfileLink] = useState<string>("");
  const { getPlaylistById, playlist: fetchedPlaylist } = useGetPlaylistById();
  const { getProfile } = useGetProfile();

  function normalizePlaylistPermalink(value?: string | null, artistId?: string | null) {
    const rawValue = (value ?? "").trim();
    if (!rawValue) return "";

    const normalizedPrefix = (creatorProfileLink || artistId || playlist?.artistId || "creator").trim();
    return rawValue
      .replace(/^https?:\/\/beatza\.me\//i, "")
      .replace(/^beatza\.me\//i, "")
      .replace(new RegExp(`^${normalizedPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`, "i"), "")
      .replace(/^\/+/, "")
      .replace(/^.*\/sets\//i, "");
  }

  const playlistArtistId = fetchedPlaylist?.artistId ?? playlist?.artistId;
  const permalinkPrefix = `https://beatza.me/${creatorProfileLink || playlistArtistId || "creator"}/sets/`;

  // release date
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

  const [releaseDateState, setReleaseDateState] = useState<string>(() =>
    toInputDate((playlist as any)?.releaseDate ?? "")
  );
  const [releaseCalendarOpen, setReleaseCalendarOpen] = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState<Date>(() => {
    const parsed = parseIsoDate(releaseDateState);
    return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date();
  });
  const [selectedReleaseDate, setSelectedReleaseDate] = useState<Date | null>(() =>
    parseIsoDate(releaseDateState)
  );

  useEffect(() => {
    if (!playlist) return;
    setTitle(playlist.title ?? "");
    setPermalink(
      normalizePlaylistPermalink(
        playlist.permalink ??
          (playlist as any)?.permaLink ??
          (playlist as any)?.basicInfo?.permalink ??
          "",
        playlist.artistId,
      ),
    );
    const pt = (playlist as any)?.playlistType ?? "playlist";
    setPlaylistType(pt.charAt(0).toUpperCase() + pt.slice(1));
    const g = (playlist as any)?.genre ?? "None";
    setGenre(GENRES.includes(g) ? g : "None");
    setTags(((playlist as any)?.additionalTags as string[] | undefined)?.join(", ") ?? "");
    setDescription(playlist.description ?? "");
    setPrivacy(playlist.isPrivate ? "private" : "public");
    setBuyLink((playlist as any)?.buyLink ?? "");
    setRecordLabel((playlist as any)?.recordLabel ?? "");
    setLocalTracks(playlist.tracks ?? []);
    const rd = toInputDate((playlist as any)?.releaseDate ?? "");
    setReleaseDateState(rd);
    const parsed = parseIsoDate(rd);
    setSelectedReleaseDate(parsed);
    setReleaseCalendarMonth(parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date());
    setImageFile(null);
    setImagePreview(null);
  }, [playlist]);

  useEffect(() => {
    if (!playlist?._id || !isOpen) return;
    void getPlaylistById(playlist._id);
  }, [playlist?._id, isOpen, getPlaylistById]);

  useEffect(() => {
    const source = fetchedPlaylist ?? playlist;
    if (!source || !isOpen) return;
    const playlistId = source._id ?? null;
    const isOpening = !wasOpenRef.current && isOpen;
    if (isOpening || (playlistId && lastPlaylistIdRef.current !== playlistId)) {
      lastPlaylistIdRef.current = playlistId;
      setIsPermalinkDirty(false);
    }
    const nextPermalink =
      source.permalink ??
      (source as any)?.permaLink ??
      (source as any)?.basicInfo?.permalink ??
      "";
    if (nextPermalink && (isOpening || !isPermalinkDirty)) {
      setPermalink(normalizePlaylistPermalink(nextPermalink, source.artistId));
    }
  }, [playlist, fetchedPlaylist, creatorProfileLink, isOpen, isPermalinkDirty]);

  useEffect(() => {
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    async function resolveCreatorProfileLink() {
      if (!playlist?.artistId) {
        setCreatorProfileLink("");
        return;
      }

      try {
        const profile = await getProfile(playlist.artistId);
        if (!cancelled) {
          setCreatorProfileLink(profile?.profileLink ?? playlist.artistId);
        }
      } catch {
        if (!cancelled) {
          setCreatorProfileLink(playlist.artistId);
        }
      }
    }

    void resolveCreatorProfileLink();

    return () => {
      cancelled = true;
    };
  }, [playlist?.artistId, getProfile]);

  useEffect(() => {
    const parsed = parseIsoDate(releaseDateState);
    if (parsed) setReleaseCalendarMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    setSelectedReleaseDate(parsed);
  }, [releaseDateState]);

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
    setReleaseDateState(formatIsoDate(date));
    setSelectedReleaseDate(date);
    setReleaseCalendarOpen(false);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleRemoveTrack(trackId: string) {
    setLocalTracks((prev) => prev.filter((t) => t._id !== trackId));
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

  const coverSrc = imagePreview ?? playlist?.image?.imgLink ?? null;

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
            className="relative flex flex-col w-[min(56rem,calc(100vw-1rem))] bg-chinese-black rounded-md overflow-hidden max-h-[94vh] sm:w-[min(56rem,calc(100vw-2rem))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hidden file input for image */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />

            {/* Header tabs */}
            <div className="flex items-center gap-0 px-6 pt-5 pb-0 border-b border-white-smoke/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`mr-6 pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab.key
                      ? "text-white-smoke border-white"
                      : "text-white-smoke/40 border-transparent hover:text-white-smoke/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                title="Change cover image"
                className="ml-auto mb-3 text-white-smoke/40 hover:text-white-smoke transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

              {/* BASIC INFO */}
              {activeTab === "basic" && (
                <div className="flex gap-5 p-6">
                  {/* Cover image */}
                  <div className="shrink-0">
                    <div
                      className="relative h-42.5 w-42.5 rounded-sm overflow-hidden lg-linear-to-br from-[#a18cd1] to-[#fbc2eb] cursor-pointer group"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      {coverSrc && (
                        <img src={coverSrc} alt="cover" className="h-full w-full object-cover" />
                      )}
                      <div className="absolute inset-0 flex items-end justify-center pb-3 bg-chinese-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white-smoke bg-chinese-black/60 px-3 py-1 rounded-sm">
                          {imageFile ? "Change image" : "Upload image"}
                        </span>
                      </div>
                    </div>
                    {imageFile && (
                      <p className="mt-1 text-[10px] text-white-smoke/40 truncate max-w-42.5">
                        {imageFile.name}
                      </p>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <div>
                      <label className="block text-[13px] font-semibold text-white-smoke mb-1">
                        Title <span className="text-[#f50]">*</span>
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke rounded-sm px-3 py-2 text-sm text-white-smoke outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-white-smoke mb-1">
                        Permalink <span className="text-[#f50]">*</span>
                      </label>
                      <div className="flex items-center bg-chinese-black border border-white-smoke focus-within:border-white-smoke rounded-sm overflow-hidden">
                        <span className="px-3 py-2 text-xs text-white-smoke/40 whitespace-nowrap shrink-0">
                          {permalinkPrefix}
                        </span>
                        <input
                          value={permalink}
                          onChange={(e) => {
                            setIsPermalinkDirty(true);
                            setPermalink(normalizePlaylistPermalink(e.target.value, playlistArtistId));
                          }}
                          placeholder="playlist-slug"
                          className="flex-1 bg-transparent py-2 pr-3 text-sm text-white-smoke outline-none min-w-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex-1 min-w-0">
                        <label className="block text-[13px] font-semibold text-white-smoke mb-1">
                          Playlist type
                        </label>
                        <div className="relative">
                          <select
                            value={playlistType}
                            onChange={(e) => setPlaylistType(e.target.value)}
                            className="w-full appearance-none bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none cursor-pointer pr-8"
                          >
                            <option>Playlist</option>
                            <option>Album</option>
                            <option>EP</option>
                            <option>Single</option>
                            <option>Compilation</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white-smoke/50" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[13px] font-semibold text-white-smoke mb-1">
                          Release date
                        </label>
                        <div className="relative">
                          <div className="relative max-w-full">
                            <input
                              type="text"
                              value={formatDisplayDate(releaseDateState)}
                              readOnly
                              onClick={openReleaseCalendar}
                              placeholder="MM/DD/YYYY"
                              className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none placeholder:text-white-smoke/30 pr-9 cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setReleaseCalendarOpen((prev) => !prev)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white-smoke/60 hover:text-white-smoke cursor-pointer"
                            >
                              <Calendar className="h-5 w-5" />
                            </button>
                          </div>

                          {releaseCalendarOpen && (
                            <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-md border border-[#2f3035] bg-chinese-black p-3 shadow-xl sm:w-72">
                              <div className="mb-2 flex items-center justify-between">
                                <button type="button" onClick={() => shiftReleaseCalendarMonth(-1)} className="rounded px-2 py-1 text-white-smoke/80 hover:bg-chinese-black hover:text-white-smoke">{"<"}</button>
                                <p className="text-[12px] font-semibold text-white-smoke">
                                  {calendarMonthStart.toLocaleString("en-US", { month: "long", year: "numeric" })}
                                </p>
                                <button type="button" onClick={() => shiftReleaseCalendarMonth(1)} className="rounded px-2 py-1 text-white-smoke/80 hover:bg-chinese-black hover:text-white-smoke">{">"}</button>
                              </div>
                              <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-[#8a8a91]">
                                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <span key={d}>{d}</span>)}
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
                                        isSelected ? "bg-[#1db954] text-chinese-black font-bold"
                                        : inCurrentMonth ? isToday ? "border border-[#1db954] text-white-smoke" : "text-white-smoke hover:bg-chinese-black"
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

                    <div>
                      <label className="block text-[13px] font-semibold text-white-smoke mb-1">Genre</label>
                      <div className="relative">
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          className="w-full appearance-none bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none cursor-pointer pr-8"
                        >
                          {GENRES.map((g) => <option key={g}>{g}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white-smoke/50" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-white-smoke mb-1">Additional tags</label>
                      <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Add tags to describe the genre and mood of your playlist"
                        className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none placeholder:text-white-smoke/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-white-smoke mb-1">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your playlist"
                        rows={4}
                        className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none placeholder:text-white-smoke/30 resize-none"
                      />
                    </div>

                    <div>
                      <p className="text-[13px] font-semibold text-white-smoke mb-2">Privacy:</p>
                      <label className="flex items-center gap-2 cursor-pointer mb-1">
                        <input type="radio" name="privacy" checked={privacy === "public"} onChange={() => setPrivacy("public")} className="accent-white-smoke" />
                        <span className="text-sm text-white-smoke">Public</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="privacy" checked={privacy === "private"} onChange={() => setPrivacy("private")} className="accent-white-smoke" />
                        <span className="text-sm text-white-smoke">Private</span>
                      </label>
                      {privacy === "private" && (
                        <p className="text-xs text-white-smoke/50 mt-1 ml-5">
                          Only you and people you share a <span className="text-white-smoke/80">secret link</span> with will be able to listen to this playlist.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TRACKS */}
              {activeTab === "tracks" && (
                <div className="px-6 py-5">
                  {localTracks.length === 0 ? (
                    <p className="text-sm text-white-smoke/40">No tracks in this playlist.</p>
                  ) : (
                    <div className="space-y-1">
                      {localTracks.map((track) => (
                        <div key={track._id} className="flex items-center gap-3 py-2 border-b border-white-smoke/5 group">
                          <img src={track.image?.imgLink ?? "/test.jpg"} alt="" className="h-9 w-9 rounded-sm object-cover shrink-0" />
                          <span className="flex-1 text-sm text-white-smoke truncate">{track.basicInfo?.title ?? "Untitled"}</span>
                          <span className="text-xs text-white-smoke/40 shrink-0">{formatDuration(track.durationInSeconds)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTrack(track._id)}
                            className="text-white-smoke/30 hover:text-red-400 transition-colors ml-2"
                            aria-label="Remove track"
                          >
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* METADATA */}
              {activeTab === "meta" && (
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-white-smoke mb-1">Buy-link</label>
                    <input value={buyLink} onChange={(e) => setBuyLink(e.target.value)} className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white-smoke mb-1">Record label</label>
                    <input value={recordLabel} onChange={(e) => setRecordLabel(e.target.value)} className="w-full bg-chinese-black border border-white-smoke focus:border-white-smoke/30 rounded-sm px-3 py-2 text-sm text-white-smoke outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white-smoke mb-2">
                      License <span className="text-white-smoke/40 font-normal">ℹ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="radio" name="license" checked={license === "all-rights"} onChange={() => setLicense("all-rights")} className="accent-white-smoke" />
                      <span className="text-sm text-white-smoke">All Rights Reserved</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="license" checked={license === "creative-commons"} onChange={() => setLicense("creative-commons")} className="accent-white-smoke" />
                      <span className="text-sm text-white-smoke">Creative Commons</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 px-6 py-4 border-t border-white-smoke/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white-smoke/40">
                <span className="text-[#f50]">*</span> Required fields
              </p>
              <div className="flex mb-10 gap-3 justify-end">
                <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white-smoke/70 hover:text-white-smoke transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() =>
                    void onSave({
                      title,
                      permalink,
                      playlistType: playlistType.toLowerCase(),
                      releaseDate: releaseDateState || undefined,
                      genre: genre === "None" ? undefined : genre,
                      tags,
                      description,
                      privacy,
                      buyLink: buyLink || undefined,
                      recordLabel: recordLabel || undefined,
                      license,
                      image: imageFile ?? undefined,
                      listOfTracks: localTracks.map((t) => t._id),
                    })
                  }
                  disabled={isSaving || !title.trim()}
                  className="px-5 py-2 text-sm font-semibold bg-chinese-black text-white-smoke rounded-sm hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>

            {error && <p className="px-6 pb-3 text-xs text-red-400">{error}</p>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}