"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useGetTrackDetailed, useUpdateTrack } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import type { UpdateTrackRequest } from "@/types/tracks.types";
import type { ArtistTrackRow } from "../ArtistStudioContent";

import {
  AUDIO_PREVIEW_SECONDS,
  MUSIC_GENRES,
  AUDIO_GENRES,
  TOOLTIP_TEXT,
  FIELD_CLS,
  LABEL_CLS,
  ADV_FIELD_CLS,
  SWITCH_CLS,
  COLLAPSIBLE_MOTION_PROPS,
  PrettyCheckbox,
  PrettyRadio,
  ProLockTooltip,
  InfoTooltip,
  clamp,
  toOptionalTrimmed,
  toList,
  formatTimeLabel,
  formatDisplayDate,
  formatIsoDate,
  parseIsoDate,
  parseTimeInputToSeconds,
  isSameDay,
  createZoomCroppedArtworkFile,
} from "@/components/upload/TrackInfoForm";

import { ArtworkPanel }          from "@/components/upload/TrackInfoForm/ArtworkPanel";
import { BasicInfoForm }         from "@/components/upload/TrackInfoForm/BasicInfoForm";
import { AdvancedDetailsSection } from "@/components/upload/TrackInfoForm/AdvancedDetailsSection";
import { PermissionsSection }    from "@/components/upload/TrackInfoForm/PermissionsSection";
import { LicensingSection }      from "@/components/upload/TrackInfoForm/LicensingSection";
import { AudioClipSection }      from "@/components/upload/TrackInfoForm/AudioClipSection";

export interface EditTrackPanelProps {
  track: ArtistTrackRow;
  onClose: () => void;
  onSave?: (updated: Partial<ArtistTrackRow>) => void;
}

export function EditTrackPanel({ track, onClose, onSave }: EditTrackPanelProps) {
  // API hooks
  const { getTrackDetailed, track: fullTrack, loading: loadingTrack } = useGetTrackDetailed();
  const { updateTrack, loading: saving } = useUpdateTrack();
  const profileLink = useAppSelector((state) => state.auth.profileLink);
  const authRole = useAppSelector((state) => state.auth.role);

  // Panel tab state
  const [activeTab, setActiveTab] = useState<"details" | "advanced">("details");

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    advancedDetails: false,
    permissions: false,
    audioClip: false,
    licensing: false,
  });
  const toggleSection = (section: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  // Basic info
  const [trackTitle, setTrackTitle]     = useState("");
  const [permalink, setPermalink]       = useState("");
  const [artistName, setArtistName]     = useState("");
  const [genre, setGenre]               = useState("");
  const [tags, setTags]                 = useState("");
  const [description, setDescription]   = useState("");
  const [scheduleRelease, setScheduleRelease] = useState(false);
  const [isPublic, setIsPublic]         = useState(true);
  const [visibilityOption, setVisibilityOption] =
    useState<"public" | "private" | "followerExclusive">("public");

  // Advanced details
  const [buyLink, setBuyLink]           = useState("");
  const [recordLabel, setRecordLabel]   = useState("");
  const [releaseDate, setReleaseDate]   = useState("");
  const [publisher, setPublisher]       = useState("");
  const [isrc, setIsrc]                 = useState("");
  const [explicitContent, setExplicitContent] = useState(false);
  const [pline, setPline]               = useState("");

  // Permissions
  const [enableDownloads, setEnableDownloads]     = useState(false);
  const [offlineListening, setOfflineListening]   = useState(false);
  const [includeRssFeed, setIncludeRssFeed]       = useState(false);
  const [displayEmbedCode, setDisplayEmbedCode]   = useState(false);
  const [enableAppPlayback, setEnableAppPlayback] = useState(false);
  const [allowComments, setAllowComments]         = useState(true);
  const [showTrackComments, setShowTrackComments] = useState(true);
  const [showTrackInsights, setShowTrackInsights] = useState(true);
  const [geoblockingOption, setGeoblockingOption] = useState("worldwide");
  const [geoblockingRegions, setGeoblockingRegions] = useState<string[]>([]);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");

  // Licensing
  const [licenseType, setLicenseType] =
    useState<"all-rights" | "creative-commons">("all-rights");

  // Artwork
  const artworkInputRef    = useRef<HTMLInputElement | null>(null);
  const artworkFrameRef    = useRef<HTMLDivElement | null>(null);
  const artworkPanStartRef = useRef<{
    clientX: number; clientY: number; startX: number; startY: number;
  } | null>(null);
  const artworkCdnUrlRef   = useRef<string | null>(null);
  const [artworkUrl, setArtworkUrl]             = useState<string | null>(null);
  const [artworkFile, setArtworkFile]           = useState<File | null>(null);
  const [artworkZoom, setArtworkZoom]           = useState(1);
  const [artworkPosition, setArtworkPosition]   = useState({ x: 0, y: 0 });
  const [isPanningArtwork, setIsPanningArtwork]       = useState(false);
  const [isArtworkDragActive, setIsArtworkDragActive] = useState(false);

  // Genre / privacy menus
  const genreMenuRef   = useRef<HTMLDivElement | null>(null);
  const privacyMenuRef = useRef<HTMLDivElement | null>(null);
  const regionMenuRef = useRef<HTMLDivElement | null>(null);
  const [genreMenuOpen, setGenreMenuOpen]     = useState(false);
  const [genreSearch, setGenreSearch]         = useState("");
  const [privacyMenuOpen, setPrivacyMenuOpen] = useState(false);

  // Release calendar
  const releaseCalendarRef = useRef<HTMLDivElement | null>(null);
  const [releaseCalendarOpen, setReleaseCalendarOpen]   = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState(() => new Date());

  // Audio clip refs
  const clipAudioRef             = useRef<HTMLAudioElement | null>(null);
  const clipTrackRef             = useRef<HTMLDivElement | null>(null);
  const clipSelectionRef         = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeRef         = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeWaveRef     = useRef<HTMLDivElement | null>(null);
  const clipRightShadeRef        = useRef<HTMLDivElement | null>(null);
  const clipActivePointerIdRef   = useRef<number | null>(null);
  const clipDragOffsetRef        = useRef(0);
  const clipTrackMetricsRef      = useRef<{ left: number; width: number } | null>(null);
  const clipWasPlayingOnDragStartRef = useRef(false);
  const clipDragRafRef           = useRef<number | null>(null);
  const clipPendingRangeRef      = useRef<{ start: number; end: number } | null>(null);
  const clipVisualRangeRef       = useRef<{ start: number; end: number } | null>(null);
  const clipSeededFromApiRef      = useRef(false);

  // Audio clip state
  const [audioUrl, setAudioUrl]                         = useState<string | null>(null);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0);
  const [audioClipStartInput, setAudioClipStartInput]   = useState("0");
  const [audioClipEndInput, setAudioClipEndInput]       = useState(String(AUDIO_PREVIEW_SECONDS));
  const [audioClipStartDraft, setAudioClipStartDraft]   = useState("0:00");
  const [audioClipEndDraft, setAudioClipEndDraft]       = useState("0:20");
  const [isClipPlaying, setIsClipPlaying]               = useState(false);
  const [clipPlaybackSeconds, setClipPlaybackSeconds]   = useState(0);
  const [isDraggingClip, setIsDraggingClip]             = useState(false);
  const [clipDragDisplayRange, setClipDragDisplayRange] =
    useState<{ start: number; end: number } | null>(null);

  // UI feedback
  const [submitError, setSubmitError]               = useState<string | null>(null);
  const [showProFeatureModal, setShowProFeatureModal] = useState(false);

  // isArtistPro
  const isArtistPro = authRole === "Pro";

  // Derived values

  const slug = (trackTitle || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const normalizePermalinkSlug = (value: string) =>
    value
      .trim()
      .replace(/^https?:\/\/beatza\.me\//i, "")
      .replace(/^beatza\.me\//i, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean)
      .pop() ?? "";

  const normalizedGenreSearch    = genreSearch.trim().toLowerCase();
  const filteredMusicGenres      = MUSIC_GENRES.filter((g) => g.toLowerCase().includes(normalizedGenreSearch));
  const filteredAudioGenres      = AUDIO_GENRES.filter((g) => g.toLowerCase().includes(normalizedGenreSearch));
  const shouldShowAddCustomGenre =
    normalizedGenreSearch.length > 0 &&
    filteredMusicGenres.length === 0 &&
    filteredAudioGenres.length === 0;

  const selectedReleaseDate = parseIsoDate(releaseDate);
  const calendarMonthStart  = new Date(releaseCalendarMonth.getFullYear(), releaseCalendarMonth.getMonth(), 1);
  const calendarGridStart   = new Date(
    calendarMonthStart.getFullYear(),
    calendarMonthStart.getMonth(),
    1 - calendarMonthStart.getDay(),
  );
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(calendarGridStart);
    d.setDate(calendarGridStart.getDate() + i);
    return d;
  });

  // Audio clip geometry
  const canSetAudioPreview  = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;
  const timelineMax         = audioDurationSeconds > 0 ? audioDurationSeconds : AUDIO_PREVIEW_SECONDS;
  const selectionDuration   = canSetAudioPreview
    ? AUDIO_PREVIEW_SECONDS
    : Math.max(1, Math.min(AUDIO_PREVIEW_SECONDS, timelineMax));
  const rawClipStart        = Number.isFinite(Number(audioClipStartInput))
    ? Math.max(0, Number(audioClipStartInput))
    : 0;
  const safeClipStart  = canSetAudioPreview
    ? clamp(rawClipStart, 0, Math.max(0, timelineMax - selectionDuration))
    : 0;
  const safeClipEnd    = canSetAudioPreview ? safeClipStart + selectionDuration : selectionDuration;
  const clipDuration   = Math.max(1, safeClipEnd - safeClipStart);
  const clipLeftPercent     = Math.min(100, (safeClipStart / timelineMax) * 100);
  const clipWidthPercent    = Math.max(5, Math.min(100 - clipLeftPercent, (clipDuration / timelineMax) * 100));
  const rightShadePercent   = Math.max(0, 100 - (clipLeftPercent + clipWidthPercent));
  const clipPlaybackOverlayPercent = clamp(
    ((clipPlaybackSeconds - safeClipStart) / clipDuration) * 100, 0, 100,
  );
  const liveClipStart           = isDraggingClip ? (clipDragDisplayRange?.start ?? safeClipStart) : safeClipStart;
  const isClipWindowAtZeroStart = liveClipStart < 0.5;
  const showClipResetButton     = liveClipStart > 0.001;

  const waveformDisplaySamples = useMemo(
    () => Array.from({ length: 220 }, (_, idx) => 48 + Math.sin(idx / 7) * 12 + Math.cos(idx / 15) * 7),
    [],
  );
  const waveformMax = useMemo(() => Math.max(...waveformDisplaySamples, 1), [waveformDisplaySamples]);

  const baseWaveformBars = useMemo(
    () =>
      waveformDisplaySamples.map((sample, idx) => {
        const normalized = Math.max(0.12, sample / waveformMax);
        return (
          <span
            key={`wave-${idx}`}
            className="block flex-1 rounded-[1px]"
            style={{ height: `${Math.round(14 + normalized * 72)}px`, backgroundColor: "var(--waveform-base)" }}
          />
        );
      }),
    [waveformDisplaySamples, waveformMax],
  );
  const leftMaskedWaveformBars = useMemo(
    () =>
      waveformDisplaySamples.map((sample, idx) => {
        const normalized = Math.max(0.12, sample / waveformMax);
        return (
          <span
            key={`wave-left-mask-${idx}`}
            className="block flex-1 rounded-[1px]"
            style={{ height: `${Math.round(14 + normalized * 72)}px`, backgroundColor: "var(--waveform-left-wave)" }}
          />
        );
      }),
    [waveformDisplaySamples, waveformMax],
  );

  // Fetch track on mount

  useEffect(() => { void getTrackDetailed(track.id); }, [track.id, getTrackDetailed]);

  useEffect(() => {
    if (!fullTrack) return;
    const b = fullTrack.basicInfo;
    setTrackTitle(b.title ?? "");
    setPermalink(b.permalink ?? "");
    setArtistName((b.mainArtists ?? []).join(", "));
    setGenre(b.genre ?? "");
    setTags((b.tags ?? []).join(", "));
    setDescription(b.description ?? "");
    setIsPublic(!b.isPrivate);
    setVisibilityOption(b.isPrivate ? "private" : "public");
    setScheduleRelease(false);

    // Permissions
    if (fullTrack.permissions) {
      const p = fullTrack.permissions;
      setEnableDownloads(p.enableDirectDownload ?? false);
      setOfflineListening(p.offlineListening ?? false);
      setIncludeRssFeed(p.includeInRssFeed ?? false);
      setDisplayEmbedCode(p.displayedEmbedCode ?? false);
      setEnableAppPlayback(p.enableAppPlayback ?? false);
      // setAllowComments(p.allowComments ?? true);
      // setShowTrackComments(p.showTrackComments ?? true);
      // setShowTrackInsights(p.showTrackInsights ?? true);
      // setGeoblockingOption(p.geoblocking ?? "worldwide");
    }

    // License
    if (fullTrack.license) {
      setLicenseType(
        fullTrack.license.type === "creativeCommons" ? "creative-commons" : "all-rights",
      );
    }

    // Advanced
    if (fullTrack.advanced) {
      const a = fullTrack.advanced;
      setBuyLink(a.buyLink ?? "");
      setRecordLabel(a.recordLabel ?? "");
      setReleaseDate(a.releaseDate ? a.releaseDate.slice(0, 10) : "");
      setPublisher(a.publisher ?? "");
      setIsrc(a.ISRC ?? "");
      setExplicitContent(a.explicitContent ?? false);
      setPline(a.pLine ?? "");

      if (Number.isFinite(a.audioClipStart) && Number.isFinite(a.audioClipEnd)) {
        clipSeededFromApiRef.current = true;
        setAudioClipStartInput(String(a.audioClipStart));
        setAudioClipEndInput(String(a.audioClipEnd));
        setAudioClipStartDraft(formatTimeLabel(a.audioClipStart ?? 0));
        setAudioClipEndDraft(formatTimeLabel(a.audioClipEnd ?? AUDIO_PREVIEW_SECONDS));
      }
    }

    if (track.cover) {
      artworkCdnUrlRef.current = null;
      setArtworkUrl(track.cover);
      setArtworkZoom(1);
      setArtworkPosition({ x: 0, y: 0 });
    }

    setAudioUrl(track.url ?? null);
  }, [fullTrack, track.cover, track.url]);

  // Sync effects

  useEffect(() => { setIsPublic(visibilityOption === "public"); }, [visibilityOption]);

  useEffect(() => {
    setVisibilityOption((prev) => {
      if (!isPublic && prev === "followerExclusive") return prev;
      return isPublic ? "public" : "private";
    });
  }, [isPublic]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (privacyMenuRef.current && !privacyMenuRef.current.contains(e.target as Node))
        setPrivacyMenuOpen(false);
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target as Node)) {
        commitGenreSearch();
        setGenreMenuOpen(false);
        setGenreSearch("");
      }
      if (releaseCalendarRef.current && !releaseCalendarRef.current.contains(e.target as Node))
        setReleaseCalendarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!audioUrl) {
      setAudioDurationSeconds(0);
      setAudioClipStartInput("0");
      setAudioClipEndInput(String(AUDIO_PREVIEW_SECONDS));
      setAudioClipStartDraft("0:00");
      setAudioClipEndDraft("0:20");
      setClipPlaybackSeconds(0);
      setIsClipPlaying(false);
      clipSeededFromApiRef.current = false;
      return;
    }
    const ca = clipAudioRef.current;
    if (ca) { ca.pause(); ca.currentTime = 0; }
    setClipPlaybackSeconds(0);
    setIsClipPlaying(false);
    if (!clipSeededFromApiRef.current) {
      setAudioClipStartInput("0");
      setAudioClipEndInput(String(AUDIO_PREVIEW_SECONDS));
      setAudioClipStartDraft("0:00");
      setAudioClipEndDraft("0:20");
    }
  }, [audioUrl]);

  useEffect(() => {
    if (!isDraggingClip || !canSetAudioPreview) return;

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      const rangeStart   = xToSeconds(event.clientX) - clipDragOffsetRef.current;
      const boundedStart = clamp(rangeStart, 0, Math.max(0, timelineMax - clipDuration));
      const boundedEnd   = boundedStart + clipDuration;
      clipPendingRangeRef.current = { start: boundedStart, end: boundedEnd };
      if (clipDragRafRef.current !== null) return;
      clipDragRafRef.current = window.requestAnimationFrame(() => {
        const pending = clipPendingRangeRef.current;
        clipDragRafRef.current = null;
        if (!pending) return;
        applyClipVisualRange(pending.start, pending.end);
        clipVisualRangeRef.current = pending;
        setClipDragDisplayRange((prev) => {
          if (
            prev &&
            Math.floor(prev.start) === Math.floor(pending.start) &&
            Math.floor(prev.end)   === Math.floor(pending.end)
          ) return prev;
          return { start: pending.start, end: pending.end };
        });
      });
    };

    const onPointerUp = () => {
      if (clipDragRafRef.current !== null) {
        window.cancelAnimationFrame(clipDragRafRef.current);
        clipDragRafRef.current = null;
      }
      if (clipSelectionRef.current && clipActivePointerIdRef.current !== null) {
        if (clipSelectionRef.current.hasPointerCapture(clipActivePointerIdRef.current))
          clipSelectionRef.current.releasePointerCapture(clipActivePointerIdRef.current);
      }
      clipActivePointerIdRef.current = null;
      clipTrackMetricsRef.current    = null;
      const pending = clipPendingRangeRef.current;
      if (pending) {
        setDraggedClipRange(pending.start, pending.end);
        if (clipAudioRef.current) clipAudioRef.current.currentTime = pending.start;
        if (clipWasPlayingOnDragStartRef.current) void playClipFrom(pending.start);
      } else {
        setAudioClipStartDraft(formatTimeLabel(safeClipStart));
        setAudioClipEndDraft(formatTimeLabel(safeClipEnd));
      }
      clipPendingRangeRef.current          = null;
      clipVisualRangeRef.current           = null;
      clipWasPlayingOnDragStartRef.current = false;
      setClipDragDisplayRange(null);
      setIsDraggingClip(false);
    };

    window.addEventListener("pointermove",   onPointerMove);
    window.addEventListener("pointerup",     onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      if (clipDragRafRef.current !== null) {
        window.cancelAnimationFrame(clipDragRafRef.current);
        clipDragRafRef.current = null;
      }
      clipActivePointerIdRef.current       = null;
      clipTrackMetricsRef.current          = null;
      clipPendingRangeRef.current          = null;
      clipVisualRangeRef.current           = null;
      clipWasPlayingOnDragStartRef.current = false;
      setClipDragDisplayRange(null);
      window.removeEventListener("pointermove",   onPointerMove);
      window.removeEventListener("pointerup",     onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [isDraggingClip, timelineMax, clipDuration, canSetAudioPreview, safeClipStart, safeClipEnd]);

  useEffect(() => {
    if (isDraggingClip) return;
    updateClipTrackMetrics();
    applyClipVisualRange(safeClipStart, safeClipEnd);
  }, [isDraggingClip, safeClipStart, safeClipEnd, timelineMax]);

  useEffect(() => {
    if (!clipTrackRef.current) return;
    const syncVisuals = () => {
      if (isDraggingClip) return;
      updateClipTrackMetrics();
      applyClipVisualRange(safeClipStart, safeClipEnd);
    };
    syncVisuals();
    const observer = new ResizeObserver(syncVisuals);
    observer.observe(clipTrackRef.current);
    window.addEventListener("resize",            syncVisuals);
    window.addEventListener("orientationchange", syncVisuals);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize",            syncVisuals);
      window.removeEventListener("orientationchange", syncVisuals);
    };
  }, [isDraggingClip, safeClipStart, safeClipEnd, timelineMax]);

  // Artwork handlers

  const handleArtworkPick = () => artworkInputRef.current?.click();

  const applyArtworkFile = (file: File) => {
    artworkCdnUrlRef.current = null;
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkUrl((prev) => { if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev); return url; });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    applyArtworkFile(file);
    e.target.value = "";
  };

  const handleArtworkDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsArtworkDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    applyArtworkFile(file);
  };

  const handleDeleteArtwork = () => {
    artworkCdnUrlRef.current = null;
    setArtworkFile(null);
    setArtworkUrl((prev) => { if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev); return null; });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  const clampArtworkPos = (v: number) => Math.max(-1, Math.min(1, v));

  const handleArtworkPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!artworkUrl || e.button !== 0) return;
    if ((e.target as HTMLElement)?.closest('[data-artwork-control="true"]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    artworkPanStartRef.current = {
      clientX: e.clientX, clientY: e.clientY,
      startX: artworkPosition.x, startY: artworkPosition.y,
    };
    setIsPanningArtwork(true);
  };

  const handleArtworkPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningArtwork || !artworkPanStartRef.current) return;
    e.preventDefault();
    const frame = artworkFrameRef.current;
    if (!frame) return;
    const dx = e.clientX - artworkPanStartRef.current.clientX;
    const dy = e.clientY - artworkPanStartRef.current.clientY;
    const overflowX = Math.max(1, frame.clientWidth  * (artworkZoom - 1));
    const overflowY = Math.max(1, frame.clientHeight * (artworkZoom - 1));
    setArtworkPosition({
      x: clampArtworkPos(artworkPanStartRef.current.startX + dx / overflowX),
      y: clampArtworkPos(artworkPanStartRef.current.startY + dy / overflowY),
    });
  };

  const handleArtworkPointerUp = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningArtwork) return;
    if (e?.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  // Genre / calendar handlers

  const commitGenreSearch = () => {
    const next = genreSearch.trim();
    if (next !== genre) setGenre(next);
  };

  const openReleaseCalendar = () => {
    const base = selectedReleaseDate || new Date();
    setReleaseCalendarMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setReleaseCalendarOpen(true);
  };

  const shiftReleaseCalendarMonth = (delta: number) =>
    setReleaseCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  const handleSelectReleaseDate = (date: Date) => {
    setReleaseDate(formatIsoDate(date));
    setReleaseCalendarOpen(false);
  };

  // Audio clip handlers

  const xToSeconds = (clientX: number) => {
    const metrics = clipTrackMetricsRef.current;
    if (metrics && metrics.width > 0)
      return clamp((clientX - metrics.left) / metrics.width, 0, 1) * timelineMax;
    const rect = clipTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return safeClipStart;
    return clamp((clientX - rect.left) / rect.width, 0, 1) * timelineMax;
  };

  const updateClipTrackMetrics = () => {
    const rect = clipTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) { clipTrackMetricsRef.current = null; return null; }
    const metrics = { left: rect.left, width: rect.width };
    clipTrackMetricsRef.current = metrics;
    return metrics;
  };

  const applyClipVisualRange = (start: number, end: number) => {
    const duration     = Math.max(0.001, end - start);
    const metrics      = clipTrackMetricsRef.current;
    const leftPercent  = Math.min(100, (start / timelineMax) * 100);
    const widthPercent = Math.max(5, Math.min(100 - leftPercent, (duration / timelineMax) * 100));

    if (clipSelectionRef.current) {
      if (metrics && metrics.width > 0) {
        clipSelectionRef.current.style.left      = "0px";
        clipSelectionRef.current.style.width     = `${(widthPercent / 100) * metrics.width}px`;
        clipSelectionRef.current.style.transform =
          `translate3d(${(leftPercent / 100) * metrics.width}px, 0, 0)`;
      } else {
        clipSelectionRef.current.style.transform = "translate3d(0px, 0, 0)";
        clipSelectionRef.current.style.left      = `${leftPercent}%`;
        clipSelectionRef.current.style.width     = `${widthPercent}%`;
      }
    }
    if (clipLeftShadeRef.current)
      clipLeftShadeRef.current.style.width =
        metrics && metrics.width > 0
          ? `${(leftPercent / 100) * metrics.width}px`
          : `${leftPercent}%`;
    if (clipLeftShadeWaveRef.current)
      clipLeftShadeWaveRef.current.style.width =
        metrics && metrics.width > 0 ? `${metrics.width}px` : "100%";
  };

  const setDraggedClipRange = (
    nextStart: number,
    nextEnd: number,
    opts?: { syncDraft?: boolean },
  ) => {
    const s = Number(nextStart.toFixed(3));
    const e = Number(nextEnd.toFixed(3));
    setAudioClipStartInput(String(s));
    setAudioClipEndInput(String(e));
    if (opts?.syncDraft !== false) {
      setAudioClipStartDraft(formatTimeLabel(s));
      setAudioClipEndDraft(formatTimeLabel(e));
    }
  };

  const playClipFrom = async (startSeconds: number) => {
    const ca = clipAudioRef.current;
    if (!ca || !audioUrl || !canSetAudioPreview) return;
    ca.currentTime = startSeconds;
    setClipPlaybackSeconds(startSeconds);
    try { await ca.play(); setIsClipPlaying(true); }
    catch { setIsClipPlaying(false); }
  };

  const handleClipReset = () => {
    const ca = clipAudioRef.current;
    if (!ca || !canSetAudioPreview) return;
    const resetEnd = Math.min(AUDIO_PREVIEW_SECONDS, timelineMax);
    setDraggedClipRange(0, resetEnd);
    ca.pause();
    ca.currentTime = 0;
    setClipPlaybackSeconds(0);
    setIsClipPlaying(false);
  };

  const applyTypedClipTime = async (target: "start" | "end") => {
    if (!canSetAudioPreview) return;
    const parsed = parseTimeInputToSeconds(
      target === "start" ? audioClipStartDraft : audioClipEndDraft,
    );
    if (parsed === null) {
      setAudioClipStartDraft(formatTimeLabel(safeClipStart));
      setAudioClipEndDraft(formatTimeLabel(safeClipEnd));
      return;
    }
    const maxStart  = Math.max(0, timelineMax - AUDIO_PREVIEW_SECONDS);
    const nextStart = target === "start"
      ? clamp(parsed, 0, maxStart)
      : clamp(parsed - AUDIO_PREVIEW_SECONDS, 0, maxStart);
    const nextEnd = nextStart + AUDIO_PREVIEW_SECONDS;
    if (
      Math.round(nextStart) === Math.round(safeClipStart) &&
      Math.round(nextEnd)   === Math.round(safeClipEnd)
    ) {
      setAudioClipStartDraft(formatTimeLabel(safeClipStart));
      setAudioClipEndDraft(formatTimeLabel(safeClipEnd));
      return;
    }
    setDraggedClipRange(nextStart, nextEnd);
    await playClipFrom(nextStart);
  };

  const handleClipDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSetAudioPreview) return;
    if ((event.target as HTMLElement)?.closest('[data-clip-control="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    clipActivePointerIdRef.current       = event.pointerId;
    clipWasPlayingOnDragStartRef.current = isClipPlaying;
    const rect = clipTrackRef.current?.getBoundingClientRect();
    clipTrackMetricsRef.current =
      rect && rect.width > 0 ? { left: rect.left, width: rect.width } : null;
    clipDragOffsetRef.current = xToSeconds(event.clientX) - safeClipStart;
    setClipDragDisplayRange({ start: safeClipStart, end: safeClipEnd });
    setIsDraggingClip(true);
  };

  const handleClipPlayPause = async () => {
    const ca = clipAudioRef.current;
    if (!ca || !audioUrl || !canSetAudioPreview) return;
    if (isClipPlaying) {
      ca.pause();
      setClipPlaybackSeconds(ca.currentTime);
      setIsClipPlaying(false);
      return;
    }
    const resumeTime = ca.currentTime;
    await playClipFrom(
      resumeTime > safeClipStart && resumeTime < safeClipEnd ? resumeTime : safeClipStart,
    );
  };

  const handleClipTimeUpdate = () => {
    const ca = clipAudioRef.current;
    if (!ca) return;
    setClipPlaybackSeconds(ca.currentTime);
    if (ca.currentTime >= safeClipEnd) {
      ca.currentTime = safeClipStart;
      setClipPlaybackSeconds(safeClipStart);
      ca.play();
      setIsClipPlaying(true);
    }
  };

  const handleClipMetadataLoaded = () => {
    const ca = clipAudioRef.current;
    if (!ca || !Number.isFinite(ca.duration) || ca.duration <= 0) return;
    const duration = ca.duration;
    setAudioDurationSeconds(duration);
    if (duration <= AUDIO_PREVIEW_SECONDS) { setDraggedClipRange(0, duration); return; }
    const boundedStart = clamp(safeClipStart, 0, Math.max(0, duration - AUDIO_PREVIEW_SECONDS));
    const boundedEnd   = boundedStart + AUDIO_PREVIEW_SECONDS;
    if (
      boundedStart !== safeClipStart ||
      boundedEnd   !== safeClipEnd   ||
      clipDuration  !== AUDIO_PREVIEW_SECONDS
    ) {
      setDraggedClipRange(boundedStart, boundedEnd);
    }
  };

  // Save

  const handleSave = async () => {
    if (saving) return;
    const parsedTitle = trackTitle.trim();
    const mainArtists = toList(artistName);
    const permalinkSlug = normalizePermalinkSlug(toOptionalTrimmed(permalink) ?? slug);
    const permaLinkRegex = /^[a-z0-9_-]+$/;
    if (!parsedTitle)           { setSubmitError("Track title is required.");         return; }
    if (mainArtists.length < 1) { setSubmitError("At least one artist is required."); return; }
    if (!permalinkSlug)         { setSubmitError("Permalink is required.");            return; }
    if (!permaLinkRegex.test(permalinkSlug)) {
      setSubmitError("Permalink must contain only lowercase letters, numbers, hyphens (-), or underscores (_).");
      return;
    }
    setSubmitError(null);

    let zoomCroppedArtwork: File | undefined;
    try {
      if (artworkFile) {
        zoomCroppedArtwork = await createZoomCroppedArtworkFile(artworkFile, artworkZoom, artworkPosition);
      } else if (
        artworkUrl &&
        artworkCdnUrlRef.current &&
        (artworkZoom !== 1 || artworkPosition.x !== 0 || artworkPosition.y !== 0)
      ) {
        const response = await fetch(artworkCdnUrlRef.current);
        const blob = await response.blob();
        const ext = artworkCdnUrlRef.current.split("?")[0].split(".").pop() ?? "jpg";
        const mimeType = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
        const cdnFile = new File([blob], `artwork.${ext}`, { type: mimeType });
        zoomCroppedArtwork = await createZoomCroppedArtworkFile(cdnFile, artworkZoom, artworkPosition);
      }
    } catch {
      setSubmitError("Failed to process artwork.");
      return;
    }

    const canAttachAudioClip = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;

    const payload: UpdateTrackRequest = {
      id: track.id,
      image: zoomCroppedArtwork,
      basicInfo: {
        title: parsedTitle,
        permalink: permalinkSlug,
        mainArtists,
        genre: toOptionalTrimmed(genre),
        tags: toList(tags).length > 0 ? toList(tags) : undefined,
        description: toOptionalTrimmed(description),
        isPrivate: !isPublic,
        caption:"",
      },
      permissions: {
        enableDirectDownload: isArtistPro ? enableDownloads : false,
        offlineListening,
        includeInRssFeed: includeRssFeed,
        displayedEmbedCode: displayEmbedCode,
        enableAppPlayback,
        allowComments,
        showTrackComments,
        showTrackInsights,
        geoblocking: geoblockingOption,
      },
      license: {
        type: licenseType === "creative-commons" ? "creativeCommons" : "allRightsReserved",
      },
      advanced: {
        buyLink:        toOptionalTrimmed(buyLink),
        recordLabel:    toOptionalTrimmed(recordLabel),
        releaseDate:    releaseDate ? new Date(releaseDate).toISOString() : undefined,
        publisher:      toOptionalTrimmed(publisher),
        ISRC:           toOptionalTrimmed(isrc),
        explicitContent,
        pLine:          toOptionalTrimmed(pline),
        audioClipStart: canAttachAudioClip ? Number(audioClipStartInput) : undefined,
        audioClipEnd:   canAttachAudioClip ? Number(audioClipEndInput)   : undefined,
      },
    };

    try {
      await updateTrack(payload);
      const coverPreview = zoomCroppedArtwork
        ? URL.createObjectURL(zoomCroppedArtwork)
        : artworkUrl ?? track.cover;
      onSave?.({
        title:     parsedTitle,
        label:     mainArtists.join(", "),
        isPrivate: !isPublic,
        cover:     coverPreview,
      });
      onClose();
    } catch (err: any) {
      const ve = err?.response?.data?.errors;
      if (Array.isArray(ve) && ve.length > 0) {
        setSubmitError(
          ve
            .map((e: { field?: string; message?: string }) =>
              `${e.field ? `${e.field}: ` : ""}${e.message || "Invalid value"}`)
            .join(" | "),
        );
      } else {
        setSubmitError(err?.response?.data?.message || "Failed to save changes.");
      }
    }
  };

  // Tab helper

  const tabClass = (t: typeof activeTab) =>
    `pb-3 text-[13px] font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === t ? "border-white text-white-smoke" : "border-transparent text-[#666] hover:text-[#aaa]"
    }`;

  // Render

  return (
    <>
      {/* Backdrop */}
          <div className="fixed inset-0 z-1001 bg-chinese-black/40" onClick={onClose} />

          {/* Drawer */}
          <div className="fixed right-0 top-0 z-1010 flex h-full w-full max-w-150 flex-col bg-chinese-black shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold text-white-smoke">Edit Track</h2>
          </div>
          {/* <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-[#333] px-3 py-1.5 text-[12px] text-white-smoke hover:border-[#555] transition-colors cursor-pointer"
            >
              <FiDownload className="text-[13px]" /> Download file
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-[#333] px-3 py-1.5 text-[12px] text-white-smoke hover:border-[#555] transition-colors cursor-pointer"
            >
              Replace file
            </button>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#2a2a2a] px-6 pt-1">
          <button type="button" className={tabClass("details")}  onClick={() => setActiveTab("details")}>
            Track details
          </button>
          <button type="button" className={tabClass("advanced")} onClick={() => setActiveTab("advanced")}>
            Advanced settings
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingTrack ? (
            <div className="flex items-center justify-center h-40 text-[13px] text-[#555]">
              Loading track…
            </div>
          ) : (
            <>
              {/* Details tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  <ArtworkPanel
                    artworkInputRef={artworkInputRef}
                    handleArtworkChange={handleArtworkChange}
                    artworkFrameRef={artworkFrameRef}
                    artworkUrl={artworkUrl}
                    isArtworkDragActive={isArtworkDragActive}
                    isPanningArtwork={isPanningArtwork}
                    artworkPosition={artworkPosition}
                    artworkZoom={artworkZoom}
                    handleArtworkPointerDown={handleArtworkPointerDown}
                    handleArtworkPointerMove={handleArtworkPointerMove}
                    handleArtworkPointerUp={handleArtworkPointerUp}
                    setIsArtworkDragActive={setIsArtworkDragActive}
                    handleArtworkDrop={handleArtworkDrop}
                    handleArtworkPick={handleArtworkPick}
                    handleDeleteArtwork={handleDeleteArtwork}
                    setArtworkZoom={setArtworkZoom}
                  />

                  <BasicInfoForm
                    submitError={submitError}
                    LABEL_CLS={LABEL_CLS}
                    FIELD_CLS={FIELD_CLS}
                    TOOLTIP_TEXT={TOOLTIP_TEXT}
                    InfoTooltip={InfoTooltip}
                    ProLockTooltip={ProLockTooltip}
                    SWITCH_CLS={SWITCH_CLS}
                    trackTitle={trackTitle}
                    setTrackTitle={setTrackTitle}
                    permalink={permalink}
                    setPermalink={setPermalink}
                    permalinkProfileLink={profileLink}
                    showPermalink={true}
                    permalinkReadOnly={false}
                    artistName={artistName}
                    setArtistName={setArtistName}
                    genre={genre}
                    setGenre={setGenre}
                    genreMenuRef={genreMenuRef}
                    genreMenuOpen={genreMenuOpen}
                    setGenreMenuOpen={setGenreMenuOpen}
                    genreSearch={genreSearch}
                    setGenreSearch={setGenreSearch}
                    commitGenreSearch={commitGenreSearch}
                    shouldShowAddCustomGenre={shouldShowAddCustomGenre}
                    filteredMusicGenres={filteredMusicGenres}
                    filteredAudioGenres={filteredAudioGenres}
                    tags={tags}
                    setTags={setTags}
                    description={description}
                    setDescription={setDescription}
                    privacyMenuRef={privacyMenuRef}
                    privacyMenuOpen={privacyMenuOpen}
                    setPrivacyMenuOpen={setPrivacyMenuOpen}
                    visibilityOption={visibilityOption}
                    setVisibilityOption={setVisibilityOption}
                    isArtistPro={isArtistPro}
                    setShowProFeatureModal={setShowProFeatureModal}
                    scheduleRelease={scheduleRelease}
                    setScheduleRelease={setScheduleRelease}
                  />
                </div>
              )}

              {/* Advanced tab */}
              {activeTab === "advanced" && (
                <div className="border-t border-[#222]">

                  <AdvancedDetailsSection
                    expanded={expandedSections.advancedDetails}
                    onToggle={() => toggleSection("advancedDetails")}
                    COLLAPSIBLE_MOTION_PROPS={COLLAPSIBLE_MOTION_PROPS}
                    LABEL_CLS={LABEL_CLS}
                    ADV_FIELD_CLS={ADV_FIELD_CLS}
                    buyLink={buyLink}
                    setBuyLink={setBuyLink}
                    recordLabel={recordLabel}
                    setRecordLabel={setRecordLabel}
                    releaseCalendarRef={releaseCalendarRef}
                    releaseDate={releaseDate}
                    formatDisplayDate={formatDisplayDate}
                    openReleaseCalendar={openReleaseCalendar}
                    setReleaseCalendarOpen={setReleaseCalendarOpen}
                    releaseCalendarOpen={releaseCalendarOpen}
                    shiftReleaseCalendarMonth={shiftReleaseCalendarMonth}
                    calendarMonthStart={calendarMonthStart}
                    calendarDays={calendarDays}
                    selectedReleaseDate={selectedReleaseDate}
                    isSameDay={isSameDay}
                    handleSelectReleaseDate={handleSelectReleaseDate}
                    publisher={publisher}
                    setPublisher={setPublisher}
                    isrc={isrc}
                    setIsrc={setIsrc}
                    explicitContent={explicitContent}
                    setExplicitContent={setExplicitContent}
                    PrettyCheckbox={PrettyCheckbox}
                    pline={pline}
                    setPline={setPline}
                  />

                  <PermissionsSection
                    expanded={expandedSections.permissions}
                    onToggle={() => toggleSection("permissions")}
                    COLLAPSIBLE_MOTION_PROPS={COLLAPSIBLE_MOTION_PROPS}
                    SWITCH_CLS={SWITCH_CLS}
                    isArtistPro={isArtistPro}
                    enableDownloads={enableDownloads}
                    setEnableDownloads={setEnableDownloads}
                    offlineListening={offlineListening}
                    setOfflineListening={setOfflineListening}
                    includeRssFeed={includeRssFeed}
                    setIncludeRssFeed={setIncludeRssFeed}
                    displayEmbedCode={displayEmbedCode}
                    setDisplayEmbedCode={setDisplayEmbedCode}
                    enableAppPlayback={enableAppPlayback}
                    setEnableAppPlayback={setEnableAppPlayback}
                    allowComments={allowComments}
                    setAllowComments={setAllowComments}
                    showTrackComments={showTrackComments}
                    setShowTrackComments={setShowTrackComments}
                    showTrackInsights={showTrackInsights}
                    setShowTrackInsights={setShowTrackInsights}
                    geoblockingOption={geoblockingOption}
                    setGeoblockingOption={setGeoblockingOption}
                    geoblockingRegions={geoblockingRegions}
                    setGeoblockingRegions={setGeoblockingRegions}
                    PrettyRadio={PrettyRadio}
                    ProLockTooltip={ProLockTooltip}
                    TOOLTIP_TEXT={TOOLTIP_TEXT}
                  />

                  {/* Audio clip */}
                  <AudioClipSection
                    expanded={expandedSections.audioClip}
                    onToggle={() => toggleSection("audioClip")}
                    COLLAPSIBLE_MOTION_PROPS={COLLAPSIBLE_MOTION_PROPS}
                    baseWaveformBars={baseWaveformBars}
                    leftMaskedWaveformBars={leftMaskedWaveformBars}
                    canSetAudioPreview={canSetAudioPreview}
                    clipLeftPercent={clipLeftPercent}
                    rightShadePercent={rightShadePercent}
                    clipTrackRef={clipTrackRef}
                    clipSelectionRef={clipSelectionRef}
                    clipLeftShadeRef={clipLeftShadeRef}
                    clipLeftShadeWaveRef={clipLeftShadeWaveRef}
                    clipRightShadeRef={clipRightShadeRef}
                    isDraggingClip={isDraggingClip}
                    clipWidthPercent={clipWidthPercent}
                    handleClipDragStart={handleClipDragStart}
                    isClipWindowAtZeroStart={isClipWindowAtZeroStart}
                    clipPlaybackOverlayPercent={clipPlaybackOverlayPercent}
                    handleClipPlayPause={handleClipPlayPause}
                    isClipPlaying={isClipPlaying}
                    showClipResetButton={showClipResetButton}
                    handleClipReset={handleClipReset}
                    formatTimeLabel={formatTimeLabel}
                    clipDragDisplayRange={clipDragDisplayRange}
                    safeClipStart={safeClipStart}
                    safeClipEnd={safeClipEnd}
                    audioClipStartDraft={audioClipStartDraft}
                    setAudioClipStartDraft={setAudioClipStartDraft}
                    applyTypedClipTime={applyTypedClipTime}
                    audioClipEndDraft={audioClipEndDraft}
                    setAudioClipEndDraft={setAudioClipEndDraft}
                  />

                  <LicensingSection
                    expanded={expandedSections.licensing}
                    onToggle={() => toggleSection("licensing")}
                    COLLAPSIBLE_MOTION_PROPS={COLLAPSIBLE_MOTION_PROPS}
                    licenseType={licenseType}
                    setLicenseType={setLicenseType}
                    PrettyRadio={PrettyRadio}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2a2a2a] px-6 py-4">
          {submitError && (
            <p className="max-w-[55%] truncate text-[12px] text-[#ff97a9]">{submitError}</p>
          )}
          <div className="flex gap-3 ml-5 mb-10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#333] px-5 py-2 text-[13px] font-semibold text-white-smoke hover:border-[#555] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full bg-[#1db954] px-7 py-2.5 text-[13px] font-bold text-chinese-black hover:bg-[#1ed760] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
      

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={clipAudioRef}
          src={audioUrl}
          onLoadedMetadata={handleClipMetadataLoaded}
          onTimeUpdate={handleClipTimeUpdate}
          onEnded={() => setIsClipPlaying(false)}
        />
      )}
    </>
  );
}