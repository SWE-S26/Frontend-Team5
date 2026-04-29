"use client";

// Imports

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  useFloating,
  useHover,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  FloatingArrow,
  type Placement,
} from "@floating-ui/react";
import { useCreateTrack } from "@/hooks/useTracks";
import type { CreateTrackRequest } from "@/types/tracks.types";
import { MAX_FILE_SIZE_BYTES, formatBytes } from "@/types/upload.types";
import {
  Header,
} from "./TrackInfoForm/Header";
import { QuitModal } from "./TrackInfoForm/QuitModal";
import { ProFeatureModal } from "./TrackInfoForm/ProFeatureModal";
import { ArtworkPanel } from "./TrackInfoForm/ArtworkPanel";
import { BasicInfoForm } from "./TrackInfoForm/BasicInfoForm";
import { AdvancedDetailsSection } from "./TrackInfoForm/AdvancedDetailsSection";
import { PermissionsSection } from "./TrackInfoForm/PermissionsSection";
import { AudioClipSection } from "./TrackInfoForm/AudioClipSection";
import { LicensingSection } from "./TrackInfoForm/LicensingSection";
import { Footer } from "./TrackInfoForm/Footer";
import { Switch } from "antd";
import { Check, Circle } from "lucide-react";
import { CiCircleQuestion } from "react-icons/ci";

// Constants

export const AUDIO_PREVIEW_SECONDS = 20;

export const SUPPORTED_AUDIO_EXTENSIONS = [
  ".wav", ".flac", ".aiff", ".aif", ".alac", ".m4a", ".mp3", ".aac", ".ogg", ".opus",
];

export const MUSIC_GENRES = [
  "Alternative Rock", "Ambient", "Classical", "Country", "Dance & EDM",
  "Dancehall", "Deep House", "Disco", "Drum & Bass", "Dubstep", "Electronic",
  "Folk & Singer-Songwriter", "Hip-hop & Rap", "House", "Indie", "Jazz & Blues",
  "Latin", "Metal", "Piano", "Pop", "R&B & Soul", "Reggae", "Reggaeton", "Rock",
  "Soundtrack", "Speech", "Techno", "Trance", "Trap", "Triphop", "World",
];

export const AUDIO_GENRES = [
  "Audiobooks", "Business", "Comedy", "Entertainment", "Learning",
  "News & Politics", "Religion & Spirituality", "Science", "Sports",
  "Storytelling", "Technology",
];

export const TOOLTIP_TEXT = {
  trackTitle: {
    title: "Track title",
    description: "Clear track titles help your fans know exactly what they're listening to.",
  },
  mainArtists: {
    title: "Main Artist(s)",
    description:
      "Put your name and any featured artists you want to give primary credit to here. These names will be displayed underneath your track title.",
  },
  tags: {
    title: "Tags",
    description:
      "Tags help identify what kind of sound your track is, whether it is spoken voice, hip-hop, etc. Tags make it easier for listeners to find your track on BeatZa.",
  },
  proFollowerExclusive: {
    title: "Follower exclusive",
    description: "Sign up for Artist Pro to unlock follower-only listening.",
  },
  proScheduleRelease: {
    title: "Schedule",
    description: "Artist Pro subscribers can schedule when their tracks go live.",
  },
  proSwitch: {
    title: "Engagement settings",
    description: "Sign up for Artist Pro to unlock these advanced settings",
  },
  proGeoblocking: {
    title: "Geoblocking",
    description:
      "Get a Artist Pro subscription to customize what countries you want your track to be available in.",
  },
};

// Shared CSS class strings
export const FIELD_CLS =
  "w-full bg-transparent border-0 border-b border-[#333] text-[13px] text-white-smoke placeholder-[#555] focus:outline-none focus:border-[#666] pb-2 pt-1 transition-colors";
export const LABEL_CLS = "mb-1.5 block text-[13px] font-semibold text-white-smoke";
export const ADV_FIELD_CLS =
  "w-full bg-transparent border border-white-smoke text-[13px] text-white-smoke pl-4 placeholder-[#555] focus:outline-none focus:border-[#666] pb-2 pt-1 transition-colors";
export const SWITCH_CLS =
  "shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!";
export const COLLAPSIBLE_MOTION_PROPS = {
  initial: { height: 0, opacity: 0, y: -6 },
  animate: { height: "auto", opacity: 1, y: 0 },
  exit: { height: 0, opacity: 0, y: -6 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  className: "overflow-hidden border-b border-[#222]",
} as const;

// Types
export interface TrackInfoFormProps {
  isUploading: boolean;
  uploadProgress: number;
  currentFileName: string;
  currentFile: File | null;
  uploadedFileUrl: string | null;
  trackTitle: string;
  setTrackTitle: (v: string) => void;
  permalink: string;
  setPermalink: (v: string) => void;
  artistName: string;
  setArtistName: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  isPublic: boolean;
  setIsPublic: (v: boolean) => void;
  scheduleRelease: boolean;
  setScheduleRelease: (v: boolean) => void;
  expandedSections: {
    advancedDetails: boolean;
    permissions: boolean;
    audioClip: boolean;
    licensing: boolean;
  };
  toggleSection: (section: "advancedDetails" | "permissions" | "audioClip" | "licensing") => void;
  buyLink: string;
  setBuyLink: (v: string) => void;
  recordLabel: string;
  setRecordLabel: (v: string) => void;
  releaseDate: string;
  setReleaseDate: (v: string) => void;
  publisher: string;
  setPublisher: (v: string) => void;
  isrc: string;
  setIsrc: (v: string) => void;
  explicitContent: boolean;
  setExplicitContent: (v: boolean) => void;
  pline: string;
  setPline: (v: string) => void;
  enableDownloads: boolean;
  setEnableDownloads: (v: boolean) => void;
  offlineListening: boolean;
  setOfflineListening: (v: boolean) => void;
  includeRssFeed: boolean;
  setIncludeRssFeed: (v: boolean) => void;
  displayEmbedCode: boolean;
  setDisplayEmbedCode: (v: boolean) => void;
  enableAppPlayback: boolean;
  setEnableAppPlayback: (v: boolean) => void;
  allowComments: boolean;
  setAllowComments: (v: boolean) => void;
  showTrackComments: boolean;
  setShowTrackComments: (v: boolean) => void;
  showTrackInsights: boolean;
  setShowTrackInsights: (v: boolean) => void;
  geoblockingOption: string;
  setGeoblockingOption: (v: string) => void;
  licenseType: "all-rights" | "creative-commons";
  setLicenseType: (v: "all-rights" | "creative-commons") => void;
  isArtistPro?: boolean;
  onReplaceTrackFile: (file: File) => void;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function toOptionalTrimmed(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function toList(value: string): string[] {
  return value
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
}

export function formatTimeLabel(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const m = Math.floor(safe / 60);
  const s = `${safe % 60}`.padStart(2, "0");
  return `${m}:${s}`;
}

export function parseTimeInputToSeconds(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.includes(":")) {
    const [minPart, secPart] = trimmed.split(":");
    const mins = Number(minPart);
    const secs = Number(secPart);
    if (!Number.isFinite(mins) || !Number.isFinite(secs)) return null;
    if (mins < 0 || secs < 0 || secs >= 60) return null;
    return mins * 60 + secs;
  }
  const asNumber = Number(trimmed);
  if (!Number.isFinite(asNumber) || asNumber < 0) return null;
  return asNumber;
}

export function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isAudioFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    file.type.startsWith("audio/") ||
    SUPPORTED_AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext))
  );
}

export async function createZoomCroppedArtworkFile(
  file: File,
  zoom: number,
  position: { x: number; y: number }
): Promise<File> {
  const clampPos = (v: number) => Math.max(-1, Math.min(1, v));
  const imageUrl = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageUrl;
  });

  try {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const shortestSide = Math.max(1, Math.min(imageWidth, imageHeight));
    const boundedZoom = Math.max(1, Math.min(3, zoom));

    const cropSize = Math.max(1, Math.round(shortestSide / boundedZoom));
    // Keep pan offsets constrained to the square area shown by object-cover before zoom.
    const maxOffsetWithinSquare = Math.max(0, (shortestSide - cropSize) / 2);
    const centerX = imageWidth / 2 - clampPos(position.x) * maxOffsetWithinSquare;
    const centerY = imageHeight / 2 - clampPos(position.y) * maxOffsetWithinSquare;
    const sourceX = Math.max(0, Math.min(imageWidth - cropSize, Math.floor(centerX - cropSize / 2)));
    const sourceY = Math.max(0, Math.min(imageHeight - cropSize, Math.floor(centerY - cropSize / 2)));

    const canvas = document.createElement("canvas");
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to process artwork image.");
    ctx.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, cropSize, cropSize);

    const outputType = file.type.startsWith("image/") ? file.type : "image/jpeg";
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) { resolve(result); return; }
          reject(new Error("Failed to generate cropped artwork."));
        },
        outputType,
        0.92
      );
    });

    return new File([blob], file.name, { type: blob.type || outputType, lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

// Shared Buttons

export function PrettyCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors cursor-pointer ${checked ? "border-white-smoke bg-white-smoke" : "border-[#7a7a7a] bg-transparent"}`}
    >
      {checked && <Check className="h-3.5 w-3.5 text-chinese-black" strokeWidth={3} />}
    </button>
  );
}

export function PrettyRadio({
  checked,
  onSelect,
}: {
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="relative mt-0.5 flex h-4.5 w-4.5 items-center justify-center cursor-pointer"
    >
      <Circle className={`h-4.5 w-4.5 ${checked ? "text-white-smoke" : "text-[#7a7a7a]"}`} strokeWidth={2.2} />
      {checked && <span className="absolute h-2 w-2 rounded-full bg-white-smoke" />}
    </button>
  );
}

export function ProLockTooltip({
  text,
  children,
  referenceClassName = "w-full",
  placement = "bottom",
}: {
  text: { title: string; description: string };
  children: ReactNode;
  referenceClassName?: string;
  placement?: Placement;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });
  const hover = useHover(context, { move: false, delay: { open: 80, close: 70 } });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className={referenceClassName}>
        {children}
      </div>
      <FloatingPortal>
        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-80 w-64 max-w-[calc(100vw-1.5rem)] rounded-md border border-[#2f3035] bg-chinese-black px-4 py-4 text-white-smoke shadow-xl"
          >
            <p className="text-[24px] font-semibold leading-none tracking-tight text-white-smoke">
              {text.title}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-white-smoke">{text.description}</p>
            <button
              type="button"
              onClick={() => router.push("/artistpro")}
              className="mt-4 rounded-full bg-white-smoke px-4 py-2 text-[12px] font-bold text-chinese-black transition-colors hover:bg-white-smoke cursor-pointer"
            >
              Unlock with Artist Pro
            </button>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-[#111216]"
              stroke="#2f3035"
              strokeWidth={1}
            />
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

export function InfoTooltip({ text }: { text: { title: string; description: string } }) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });
  const hover = useHover(context, { move: false, delay: { open: 100, close: 80 } });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="ml-1 inline-flex cursor-help align-middle text-white/70 hover:text-white-smoke"
      >
        <CiCircleQuestion className="text-white-smoke text-[14px]" />
      </span>
      <FloatingPortal>
        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-80 w-64 max-w-[calc(100vw-1.5rem)] rounded-md border border-[#2f3035] bg-chinese-black px-4 py-4 text-white-smoke shadow-xl"
          >
            <p className="text-[16px] text-white-smoke font-semibold leading-none tracking-tight">
              {text.title}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-white-smoke">{text.description}</p>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-[#111216]"
              stroke="#2f3035"
              strokeWidth={1}
            />
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

// Main Component

export function TrackInfoForm(props: TrackInfoFormProps) {
  const router = useRouter();

  // Refs
  const audioRef                     = useRef<HTMLAudioElement | null>(null);
  const clipAudioRef                 = useRef<HTMLAudioElement | null>(null);
  const clipTrackRef                 = useRef<HTMLDivElement | null>(null);
  const clipSelectionRef             = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeRef             = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeWaveRef         = useRef<HTMLDivElement | null>(null);
  const clipRightShadeRef            = useRef<HTMLDivElement | null>(null);
  const clipActivePointerIdRef       = useRef<number | null>(null);
  const clipDragOffsetRef            = useRef(0);
  const clipTrackMetricsRef          = useRef<{ left: number; width: number } | null>(null);
  const clipWasPlayingOnDragStartRef = useRef(false);
  const clipDragRafRef               = useRef<number | null>(null);
  const clipPendingRangeRef          = useRef<{ start: number; end: number } | null>(null);
  const clipVisualRangeRef           = useRef<{ start: number; end: number } | null>(null);
  const replaceFileInputRef          = useRef<HTMLInputElement | null>(null);
  const artworkInputRef              = useRef<HTMLInputElement | null>(null);
  const releaseCalendarRef           = useRef<HTMLDivElement | null>(null);
  const artworkFrameRef              = useRef<HTMLDivElement | null>(null);
  const artworkPanStartRef           = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);
  const privacyMenuRef               = useRef<HTMLDivElement | null>(null);
  const genreMenuRef                 = useRef<HTMLDivElement | null>(null);

  // State
  const [isPlaying, setIsPlaying]                       = useState(false);
  const [isSubmitting, setIsSubmitting]                 = useState(false);
  const [submitted, setSubmitted]                       = useState(false);
  const [showQuitModal, setShowQuitModal]               = useState(false);
  const [showProFeatureModal, setShowProFeatureModal]   = useState(false);
  const [submitError, setSubmitError]                   = useState<string | null>(null);
  const [artworkUrl, setArtworkUrl]                     = useState<string | null>(null);
  const [artworkFile, setArtworkFile]                   = useState<File | null>(null);
  const [artworkZoom, setArtworkZoom]                   = useState(1);
  const [artworkPosition, setArtworkPosition]           = useState({ x: 0, y: 0 });
  const [isPanningArtwork, setIsPanningArtwork]         = useState(false);
  const [privacyMenuOpen, setPrivacyMenuOpen]           = useState(false);
  const [visibilityOption, setVisibilityOption]         = useState<"public" | "private" | "followerExclusive">("public");
  const [genreMenuOpen, setGenreMenuOpen]               = useState(false);
  const [genreSearch, setGenreSearch]                   = useState("");
  const [releaseCalendarOpen, setReleaseCalendarOpen]   = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState(() => new Date());
  const [audioClipStartInput, setAudioClipStartInput]   = useState("0");
  const [audioClipEndInput, setAudioClipEndInput]       = useState("20");
  const [audioClipStartDraft, setAudioClipStartDraft]   = useState("0:00");
  const [audioClipEndDraft, setAudioClipEndDraft]       = useState("0:20");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0);
  const [isClipPlaying, setIsClipPlaying]               = useState(false);
  const [clipPlaybackSeconds, setClipPlaybackSeconds]   = useState(0);
  const [isDraggingClip, setIsDraggingClip]             = useState(false);
  const [clipDragDisplayRange, setClipDragDisplayRange] = useState<{ start: number; end: number } | null>(null);
  const [isArtworkDragActive, setIsArtworkDragActive]   = useState(false);
  const [isTrackDragActive, setIsTrackDragActive]       = useState(false);
  const [geoblockingRegions, setGeoblockingRegions]     = useState<string[]>([]);

  // API
  const { createTrack, error: createTrackError } = useCreateTrack();

  // Props
  const {
    isUploading, uploadProgress, currentFileName, currentFile, uploadedFileUrl,
    trackTitle, setTrackTitle, permalink, setPermalink, artistName, setArtistName, genre, setGenre,
    tags, setTags, description, setDescription, isPublic, setIsPublic,
    scheduleRelease, setScheduleRelease, expandedSections, toggleSection,
    buyLink, setBuyLink, recordLabel, setRecordLabel, releaseDate, setReleaseDate,
    publisher, setPublisher, isrc, setIsrc, explicitContent, setExplicitContent,
    pline, setPline, enableDownloads, setEnableDownloads, offlineListening, setOfflineListening,
    includeRssFeed, setIncludeRssFeed, displayEmbedCode, setDisplayEmbedCode,
    enableAppPlayback, setEnableAppPlayback, allowComments, setAllowComments,
    showTrackComments, setShowTrackComments, showTrackInsights, setShowTrackInsights,
    geoblockingOption, setGeoblockingOption, licenseType, setLicenseType,
    isArtistPro = false, onReplaceTrackFile,
  } = props;

  // Derived Value
  const roundedUploadProgress  = Math.round(uploadProgress);
  const showUploadProgress     = isUploading;
  const hasTrackForReplacement = Boolean(currentFile || uploadedFileUrl);
  const hasFinishedUpload      = !isUploading && uploadProgress >= 99.5;
  const showReplaceTrack       = hasTrackForReplacement && hasFinishedUpload;

  const permaLinkRegex        = /^[a-z0-9_-]+$/;
  const isrcRegex             = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;

  // Genre filtering
  const normalizedGenreSearch    = genreSearch.trim().toLowerCase();
  const filteredMusicGenres      = MUSIC_GENRES.filter((item) => item.toLowerCase().includes(normalizedGenreSearch));
  const filteredAudioGenres      = AUDIO_GENRES.filter((item) => item.toLowerCase().includes(normalizedGenreSearch));
  const shouldShowAddCustomGenre =
    normalizedGenreSearch.length > 0 &&
    filteredMusicGenres.length === 0 &&
    filteredAudioGenres.length === 0;

  // Calendar
  const selectedReleaseDate = parseIsoDate(releaseDate);
  const calendarMonthStart  = new Date(releaseCalendarMonth.getFullYear(), releaseCalendarMonth.getMonth(), 1);
  const calendarGridStart   = new Date(
    calendarMonthStart.getFullYear(),
    calendarMonthStart.getMonth(),
    1 - calendarMonthStart.getDay()
  );
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(calendarGridStart);
    day.setDate(calendarGridStart.getDate() + i);
    return day;
  });

  // Audio clip geometry
  const canSetAudioPreview         = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;
  const timelineMax                = audioDurationSeconds > 0 ? audioDurationSeconds : AUDIO_PREVIEW_SECONDS;
  const selectionDuration          = canSetAudioPreview
    ? AUDIO_PREVIEW_SECONDS
    : Math.max(1, Math.min(AUDIO_PREVIEW_SECONDS, timelineMax));
  const rawClipStart               = Number.isFinite(Number(audioClipStartInput)) ? Math.max(0, Number(audioClipStartInput)) : 0;
  const safeClipStart              = canSetAudioPreview ? clamp(rawClipStart, 0, Math.max(0, timelineMax - selectionDuration)) : 0;
  const safeClipEnd                = canSetAudioPreview ? safeClipStart + selectionDuration : selectionDuration;
  const clipDuration               = Math.max(1, safeClipEnd - safeClipStart);
  const clipLeftPercent            = Math.min(100, (safeClipStart / timelineMax) * 100);
  const clipWidthPercent           = Math.max(5, Math.min(100 - clipLeftPercent, (clipDuration / timelineMax) * 100));
  const rightShadePercent          = Math.max(0, 100 - (clipLeftPercent + clipWidthPercent));
  const clipPlaybackOverlayPercent = clamp(((clipPlaybackSeconds - safeClipStart) / clipDuration) * 100, 0, 100);
  const liveClipStart              = isDraggingClip ? (clipDragDisplayRange?.start ?? safeClipStart) : safeClipStart;
  const isClipWindowAtZeroStart    = liveClipStart < 0.5;
  const showClipResetButton        = liveClipStart > 0.001;

  // Waveform Memos
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

  // Handlers: Track File
  const handleReplaceTrack = () => replaceFileInputRef.current?.click();

  const handleReplaceTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAudioFile(file)) {
      setSubmitError("Track upload only accepts audio files.");
      e.target.value = "";
      return;
    }
    setSubmitError(null);
    onReplaceTrackFile(file);
    e.target.value = "";
  };

  const handleTrackDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTrackDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!isAudioFile(file)) {
      setSubmitError("Track upload only accepts audio files.");
      return;
    }
    setSubmitError(null);
    onReplaceTrackFile(file);
  };

  // Handlers: Artwork
  const handleArtworkPick = () => artworkInputRef.current?.click();

  const applyArtworkFile = (file: File) => {
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
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
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSubmitError("Artwork must be an image file (PNG, JPG, WEBP, etc.).");
      return;
    }
    setSubmitError(null);
    applyArtworkFile(file);
  };

  const handleDeleteArtwork = () => {
    setArtworkFile(null);
    setArtworkUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  const clampArtworkPosition = (value: number) => Math.max(-1, Math.min(1, value));

  const handleArtworkPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!artworkUrl) return;
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-artwork-control="true"]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    artworkPanStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: artworkPosition.x,
      startY: artworkPosition.y,
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
    const width = Math.max(1, frame.clientWidth);
    const height = Math.max(1, frame.clientHeight);
    setArtworkPosition({
      x: clampArtworkPosition(artworkPanStartRef.current.startX + (dx / width)),
      y: clampArtworkPosition(artworkPanStartRef.current.startY + (dy / height)),
    });
  };

  const handleArtworkPointerUp = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningArtwork) return;
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  // Handlers: Audio Playback
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else           { audioRef.current.play();  setIsPlaying(true);  }
  };

  // Handlers: Genre
  const commitGenreSearch = () => {
    const nextGenre = genreSearch.trim();
    if (nextGenre !== genre) setGenre(nextGenre);
  };

  // Handlers: Release Calendar
  const openReleaseCalendar = () => {
    const baseDate = selectedReleaseDate || new Date();
    setReleaseCalendarMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setReleaseCalendarOpen(true);
  };

  const shiftReleaseCalendarMonth = (delta: number) =>
    setReleaseCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  const handleSelectReleaseDate = (date: Date) => {
    setReleaseDate(formatIsoDate(date));
    setReleaseCalendarOpen(false);
  };

  // Handlers: Audio Clip
  const xToSeconds = (clientX: number) => {
    const metrics = clipTrackMetricsRef.current;
    if (metrics && metrics.width > 0) {
      return clamp((clientX - metrics.left) / metrics.width, 0, 1) * timelineMax;
    }
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
    const duration = Math.max(0.001, end - start);
    const metrics  = clipTrackMetricsRef.current;
    const leftPercent  = Math.min(100, (start / timelineMax) * 100);
    const widthPercent = Math.max(5, Math.min(100 - leftPercent, (duration / timelineMax) * 100));

    if (clipSelectionRef.current) {
      if (metrics && metrics.width > 0) {
        clipSelectionRef.current.style.left      = "0px";
        clipSelectionRef.current.style.width     = `${(widthPercent / 100) * metrics.width}px`;
        clipSelectionRef.current.style.transform = `translate3d(${(leftPercent / 100) * metrics.width}px, 0, 0)`;
      } else {
        clipSelectionRef.current.style.transform = "translate3d(0px, 0, 0)";
        clipSelectionRef.current.style.left      = `${leftPercent}%`;
        clipSelectionRef.current.style.width     = `${widthPercent}%`;
      }
    }
    if (clipLeftShadeRef.current) {
      clipLeftShadeRef.current.style.width =
        metrics && metrics.width > 0 ? `${(leftPercent / 100) * metrics.width}px` : `${leftPercent}%`;
    }
    if (clipLeftShadeWaveRef.current) {
      clipLeftShadeWaveRef.current.style.width =
        metrics && metrics.width > 0 ? `${metrics.width}px` : "100%";
    }
  };

  const setDraggedClipRange = (nextStart: number, nextEnd: number, options?: { syncDraft?: boolean }) => {
    const preciseStart = Number(nextStart.toFixed(3));
    const preciseEnd   = Number(nextEnd.toFixed(3));
    setAudioClipStartInput(String(preciseStart));
    setAudioClipEndInput(String(preciseEnd));
    if (options?.syncDraft !== false) {
      setAudioClipStartDraft(formatTimeLabel(preciseStart));
      setAudioClipEndDraft(formatTimeLabel(preciseEnd));
    }
  };

  const playClipFrom = async (startSeconds: number) => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !uploadedFileUrl || !canSetAudioPreview) return;
    clipAudio.currentTime = startSeconds;
    setClipPlaybackSeconds(startSeconds);
    try { await clipAudio.play(); setIsClipPlaying(true); }
    catch { setIsClipPlaying(false); }
  };

  const handleClipReset = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !canSetAudioPreview) return;
    const resetStart = 0;
    const resetEnd   = Math.min(AUDIO_PREVIEW_SECONDS, timelineMax);
    setDraggedClipRange(resetStart, resetEnd);
    clipAudio.pause();
    clipAudio.currentTime = resetStart;
    setClipPlaybackSeconds(resetStart);
    setIsClipPlaying(false);
  };

  const applyTypedClipTime = async (target: "start" | "end") => {
    if (!canSetAudioPreview) return;
    const parsed = parseTimeInputToSeconds(target === "start" ? audioClipStartDraft : audioClipEndDraft);
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
    if (Math.round(nextStart) === Math.round(safeClipStart) && Math.round(nextEnd) === Math.round(safeClipEnd)) {
      setAudioClipStartDraft(formatTimeLabel(safeClipStart));
      setAudioClipEndDraft(formatTimeLabel(safeClipEnd));
      return;
    }
    setDraggedClipRange(nextStart, nextEnd);
    await playClipFrom(nextStart);
  };

  const handleClipDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSetAudioPreview) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-clip-control="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    clipActivePointerIdRef.current       = event.pointerId;
    clipWasPlayingOnDragStartRef.current = isClipPlaying;
    const rect = clipTrackRef.current?.getBoundingClientRect();
    clipTrackMetricsRef.current = rect && rect.width > 0 ? { left: rect.left, width: rect.width } : null;
    clipDragOffsetRef.current   = xToSeconds(event.clientX) - safeClipStart;
    setClipDragDisplayRange({ start: safeClipStart, end: safeClipEnd });
    setIsDraggingClip(true);
  };

  const handleClipPlayPause = async () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !uploadedFileUrl || !canSetAudioPreview) return;
    if (isClipPlaying) {
      clipAudio.pause();
      setClipPlaybackSeconds(clipAudio.currentTime);
      setIsClipPlaying(false);
      return;
    }
    const resumeTime = clipAudio.currentTime;
    await playClipFrom(resumeTime > safeClipStart && resumeTime < safeClipEnd ? resumeTime : safeClipStart);
  };

  const handleClipTimeUpdate = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio) return;
    setClipPlaybackSeconds(clipAudio.currentTime);
    if (clipAudio.currentTime >= safeClipEnd) {
      clipAudio.currentTime = safeClipStart;
      setClipPlaybackSeconds(safeClipStart);
      clipAudio.play();
      setIsClipPlaying(true);
    }
  };

  const handleClipMetadataLoaded = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !Number.isFinite(clipAudio.duration) || clipAudio.duration <= 0) return;
    const duration = clipAudio.duration;
    setAudioDurationSeconds(duration);
    if (duration <= AUDIO_PREVIEW_SECONDS) { setDraggedClipRange(0, duration); return; }
    const boundedStart = clamp(safeClipStart, 0, Math.max(0, duration - AUDIO_PREVIEW_SECONDS));
    const boundedEnd   = boundedStart + AUDIO_PREVIEW_SECONDS;
    if (boundedStart !== safeClipStart || boundedEnd !== safeClipEnd || clipDuration !== AUDIO_PREVIEW_SECONDS) {
      setDraggedClipRange(boundedStart, boundedEnd);
    }
  };

  // Handlers: Form Submit
  const buildCreateTrackPayload = async (): Promise<CreateTrackRequest> => {
    const permalinkInput    = permalink.trim();
    const permalinkSegments = permalinkInput
      .replace(/^https?:\/\/beatza\.me\//i, "")
      .replace(/^beatza\.me\//i, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean);
    const permalinkValue    = permalinkSegments[permalinkSegments.length - 1] ?? "";
    const mainArtists       = toList(artistName);
    const parsedTags        = toList(tags);
    const parsedDescription = toOptionalTrimmed(description);
    const parsedGenre       = toOptionalTrimmed(genre);
    const parsedReleaseDate = toOptionalTrimmed(releaseDate);
    const parsedIsrc        = toOptionalTrimmed(isrc);
    const normalizedIsrc    = parsedIsrc ? parsedIsrc.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : undefined;
    const canAttachAudioClip   = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;
    const parsedAudioClipStart = canAttachAudioClip ? toOptionalTrimmed(audioClipStartInput) : undefined;
    const parsedAudioClipEnd   = canAttachAudioClip ? toOptionalTrimmed(audioClipEndInput)   : undefined;
    const audioClipStartValue  = parsedAudioClipStart !== undefined ? Number(parsedAudioClipStart) : undefined;
    const audioClipEndValue    = parsedAudioClipEnd   !== undefined ? Number(parsedAudioClipEnd)   : undefined;
    const parsedTitle = trackTitle.trim();

    if (!currentFile)                                                       throw new Error("An audio file is required.");
    if (currentFile.size > MAX_FILE_SIZE_BYTES)                             throw new Error(`Audio file exceeds the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`);
    if (!parsedTitle)                                                       throw new Error("Track title is required.");
    if (!permalinkInput)                                                     throw new Error("Permalink is required.");
    if (!permalinkValue)                                                     throw new Error("Track permalink segment is required.");
    if (!permaLinkRegex.test(permalinkValue))                                throw new Error("Permalink must contain only lowercase letters, numbers, hyphens (-), or underscores (_).");
    if (mainArtists.length < 1)                                             throw new Error("At least one artist is required");
    if (tags.trim().length > 0 && parsedTags.length < 1)                   throw new Error("At least one tag is required");
    if (description.length > 0 && !parsedDescription)                      throw new Error("Description cannot be empty");
    if (parsedReleaseDate && Number.isNaN(Date.parse(parsedReleaseDate)))   throw new Error("Invalid date format, must be ISO 8601");
    if (normalizedIsrc && !isrcRegex.test(normalizedIsrc))                  throw new Error("An ISRC (International Standard Recording Code) is a unique identifier that is assigned to a track. Use the same ISRC for a given track wherever you distribute it.");
    if (canAttachAudioClip && audioClipStartValue !== undefined && (!Number.isFinite(audioClipStartValue) || audioClipStartValue < 0)) throw new Error("Audio clip start must be a valid non-negative number.");
    if (canAttachAudioClip && audioClipEndValue   !== undefined && (!Number.isFinite(audioClipEndValue)   || audioClipEndValue   <= 0)) throw new Error("Audio clip end must be a valid number greater than 0.");
    if (canAttachAudioClip && audioClipStartValue !== undefined && audioClipEndValue !== undefined && audioClipEndValue <= audioClipStartValue) throw new Error("Audio clip end must be greater than audio clip start.");

    const zoomCroppedArtwork = artworkFile
      ? await createZoomCroppedArtworkFile(artworkFile, artworkZoom, artworkPosition)
      : undefined;
    return {
      audio: currentFile,
      image: zoomCroppedArtwork,
      basicInfo: {
        title: parsedTitle,
        permalink: permalinkValue,
        mainArtists,
        genre: parsedGenre,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        description: parsedDescription,
        isPrivate: !isPublic,
      },
      permissions: {
        enableDirectDownload: isArtistPro ? enableDownloads : false,
        offlineListening,
        includeInRssFeed: includeRssFeed,
        displayedEmbedCode: displayEmbedCode,
        enableAppPlayback,
      },
      license: {
        type: licenseType === "creative-commons" ? "creativeCommons" : "allRightsReserved",
        attribution: false,
        nonCommercial: false,
        noDerivativeWorks: false,
        shareAlike: false,
      },
      advanced: {
        buyLink: toOptionalTrimmed(buyLink),
        recordLabel: toOptionalTrimmed(recordLabel),
        releaseDate: parsedReleaseDate ? new Date(parsedReleaseDate).toISOString() : undefined,
        publisher: toOptionalTrimmed(publisher),
        ISRC: normalizedIsrc,
        explicitContent,
        pLine: toOptionalTrimmed(pline),
        audioClipStart: canAttachAudioClip ? audioClipStartValue : undefined,
        audioClipEnd:   canAttachAudioClip ? audioClipEndValue   : undefined,
      },
    };
  };

  const handleSave = async () => {
    if (isSubmitting || submitted) return;
    let payload: CreateTrackRequest;
    try {
      payload = await buildCreateTrackPayload();
      setSubmitError(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to validate upload payload.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createTrack(payload);
      setSubmitted(true);
      router.push("/home");
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setSubmitError(
          validationErrors
            .map((entry: { field?: string; message?: string }) => {
              const field = entry.field ? `${entry.field}: ` : "";
              return `${field}${entry.message || "Invalid value"}`;
            })
            .join(" | ")
        );
      } else {
        setSubmitError(error?.response?.data?.message || "Failed to create track.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (artworkUrl) URL.revokeObjectURL(artworkUrl); };
  }, [artworkUrl]);

  useEffect(() => {
    if (createTrackError) setSubmitError(createTrackError);
  }, [createTrackError]);

  useEffect(() => {
    setVisibilityOption((prev) => {
      if (!isPublic && prev === "followerExclusive") return prev;
      return isPublic ? "public" : "private";
    });
  }, [isPublic]);

  useEffect(() => {
    setIsPublic(visibilityOption === "public");
  }, [visibilityOption, setIsPublic]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (privacyMenuRef.current && !privacyMenuRef.current.contains(event.target as Node)) {
        setPrivacyMenuOpen(false);
      }
      if (genreMenuRef.current && !genreMenuRef.current.contains(event.target as Node)) {
        commitGenreSearch();
        setGenreMenuOpen(false);
        setGenreSearch("");
      }
      if (releaseCalendarRef.current && !releaseCalendarRef.current.contains(event.target as Node)) {
        setReleaseCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!isDraggingClip || !canSetAudioPreview) return;

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      const rangeStart    = xToSeconds(event.clientX) - clipDragOffsetRef.current;
      const boundedStart  = clamp(rangeStart, 0, Math.max(0, timelineMax - clipDuration));
      const boundedEnd    = boundedStart + clipDuration;
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
        if (clipSelectionRef.current.hasPointerCapture(clipActivePointerIdRef.current)) {
          clipSelectionRef.current.releasePointerCapture(clipActivePointerIdRef.current);
        }
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

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      if (clipDragRafRef.current !== null) { window.cancelAnimationFrame(clipDragRafRef.current); clipDragRafRef.current = null; }
      clipActivePointerIdRef.current       = null;
      clipTrackMetricsRef.current          = null;
      clipPendingRangeRef.current          = null;
      clipVisualRangeRef.current           = null;
      clipWasPlayingOnDragStartRef.current = false;
      setClipDragDisplayRange(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
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
    window.addEventListener("resize", syncVisuals);
    window.addEventListener("orientationchange", syncVisuals);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncVisuals);
      window.removeEventListener("orientationchange", syncVisuals);
    };
  }, [isDraggingClip, safeClipStart, safeClipEnd, timelineMax]);

  useEffect(() => {
    if (!uploadedFileUrl) {
      setAudioDurationSeconds(0);
      setAudioClipStartInput("0");
      setAudioClipEndInput(String(AUDIO_PREVIEW_SECONDS));
      setAudioClipStartDraft("0:00");
      setAudioClipEndDraft("0:20");
      setClipPlaybackSeconds(0);
      setIsClipPlaying(false);
      return;
    }
    const clipAudio = clipAudioRef.current;
    if (clipAudio) { clipAudio.pause(); clipAudio.currentTime = 0; }
    setClipPlaybackSeconds(0);
    setIsClipPlaying(false);
  }, [uploadedFileUrl]);

  // Render
  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke antialiased">
      <Header
        replaceFileInputRef={replaceFileInputRef}
        handleReplaceTrackChange={handleReplaceTrackChange}
        isTrackDragActive={isTrackDragActive}
        setIsTrackDragActive={setIsTrackDragActive}
        handleTrackDrop={handleTrackDrop}
        showUploadProgress={showUploadProgress}
        currentFileName={currentFileName}
        roundedUploadProgress={roundedUploadProgress}
        uploadedFileUrl={uploadedFileUrl}
        togglePlayPause={togglePlayPause}
        isPlaying={isPlaying}
        showReplaceTrack={showReplaceTrack}
        handleReplaceTrack={handleReplaceTrack}
        onGoHome={() => router.push("/home")}
        onShowQuitModal={() => setShowQuitModal(true)}
      />

      <QuitModal
        showQuitModal={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onQuit={() => router.push("/artists")}
      />

      <ProFeatureModal
        showProFeatureModal={showProFeatureModal}
        onClose={() => setShowProFeatureModal(false)}
        onUpgrade={() => router.push("/artistpro")}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 pb-36 sm:px-5">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
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

        <div className="mt-8 border-t border-[#222] bg-chinese-black/95">
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
      </div>

      <Footer isSubmitting={isSubmitting} handleSave={handleSave} />

      {/* Audio elements */}
      {uploadedFileUrl && (
        <audio ref={audioRef} src={uploadedFileUrl} onEnded={() => setIsPlaying(false)} />
      )}
      {uploadedFileUrl && (
        <audio
          ref={clipAudioRef}
          src={uploadedFileUrl}
          onLoadedMetadata={handleClipMetadataLoaded}
          onTimeUpdate={handleClipTimeUpdate}
          onEnded={() => setIsClipPlaying(false)}
        />
      )}
    </div>
  );
}