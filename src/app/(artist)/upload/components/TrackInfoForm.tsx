"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DownOutlined,
  UpOutlined,
  PictureOutlined,
  UserAddOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { Switch } from "antd";
import { Check, Circle } from "lucide-react";
import { IoToggleOutline } from "react-icons/io5";
import { FiLock } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import { RxSpeakerLoud } from "react-icons/rx";
import { BsCcCircle } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { IoMdCalendar } from "react-icons/io";
import { BsExplicitFill } from "react-icons/bs";
import { CiCircleQuestion } from "react-icons/ci";
import { RiLockFill } from "react-icons/ri";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";

const AUDIO_PREVIEW_SECONDS = 20;

const TOOLTIP_TEXT = {
  trackTitle: {
    title: "Track title",
    description: "Clear track titles help your fans know exactly what they're listening to.",
  },
  mainArtists: {
    title: "Main Artist(s)",
    description: "Put your name and any featured artists you want to give primary credit to here. These names will be displayed underneath your track title.",
  },
  tags: {
    title: "Tags",
    description: "Tags help identify what kind of sound your track is, whether it is spoken voice, hip-hop, etc. Tags make it easier for listeners to find your track on BeatZa.",
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
    description: "Get a Artist Pro subscription to customize what countries you want your track to be available in.",
  },
};

interface TrackInfoFormProps {
  isUploading: boolean;
  uploadProgress: number;
  currentFileName: string;
  currentFile: File | null;
  uploadedFileUrl: string | null;
  trackTitle: string;
  setTrackTitle: (v: string) => void;
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

function PrettyCheckbox({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
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

function PrettyRadio({ checked, onSelect }: { checked: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center cursor-pointer"
    >
      <Circle className={`h-4.5 w-4.5 ${checked ? "text-white-smoke" : "text-[#7a7a7a]"}`} strokeWidth={2.2} />
      {checked && <span className="absolute h-2 w-2 rounded-full bg-white-smoke" />}
    </button>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function TrackInfoForm(props: TrackInfoFormProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipAudioRef = useRef<HTMLAudioElement | null>(null);
  const clipTrackRef = useRef<HTMLDivElement | null>(null);
  const clipSelectionRef = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeRef = useRef<HTMLDivElement | null>(null);
  const clipLeftShadeWaveRef = useRef<HTMLDivElement | null>(null);
  const clipRightShadeRef = useRef<HTMLDivElement | null>(null);
  const clipActivePointerIdRef = useRef<number | null>(null);
  const clipDragOffsetRef = useRef(0);
  const clipTrackMetricsRef = useRef<{ left: number; width: number } | null>(null);
  const clipWasPlayingOnDragStartRef = useRef(false);
  const clipDragRafRef = useRef<number | null>(null);
  const clipPendingRangeRef = useRef<{ start: number; end: number } | null>(null);
  const clipVisualRangeRef = useRef<{ start: number; end: number } | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const artworkInputRef = useRef<HTMLInputElement | null>(null);
  const releaseCalendarRef = useRef<HTMLDivElement | null>(null);
  const artworkFrameRef = useRef<HTMLDivElement | null>(null);
  const artworkPanStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);
  const privacyMenuRef = useRef<HTMLDivElement | null>(null);
  const genreMenuRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showProFeatureModal, setShowProFeatureModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { createTrack, error: createTrackError } = useCreateTrack();
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkZoom, setArtworkZoom] = useState(1);
  const [artworkPosition, setArtworkPosition] = useState({ x: 0, y: 0 });
  const [isPanningArtwork, setIsPanningArtwork] = useState(false);
  const [privacyMenuOpen, setPrivacyMenuOpen] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState<"public" | "private" | "followerExclusive">("public");
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [releaseCalendarOpen, setReleaseCalendarOpen] = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState(() => new Date());
  const [audioClipStartInput, setAudioClipStartInput] = useState("0");
  const [audioClipEndInput, setAudioClipEndInput] = useState("20");
  const [audioClipStartDraft, setAudioClipStartDraft] = useState("0:00");
  const [audioClipEndDraft, setAudioClipEndDraft] = useState("0:20");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0);
  const [isClipPlaying, setIsClipPlaying] = useState(false);
  const [clipPlaybackSeconds, setClipPlaybackSeconds] = useState(0);
  const [isDraggingClip, setIsDraggingClip] = useState(false);
  const [clipDragDisplayRange, setClipDragDisplayRange] = useState<{ start: number; end: number } | null>(null);
  const [isArtworkDragActive, setIsArtworkDragActive] = useState(false);
  const [isTrackDragActive, setIsTrackDragActive] = useState(false);

  const {
    isUploading,
    uploadProgress,
    currentFileName,
    currentFile,
    uploadedFileUrl,
    trackTitle,
    setTrackTitle,
    artistName,
    setArtistName,
    genre,
    setGenre,
    tags,
    setTags,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    scheduleRelease,
    setScheduleRelease,
    expandedSections,
    toggleSection,
    buyLink,
    setBuyLink,
    recordLabel,
    setRecordLabel,
    releaseDate,
    setReleaseDate,
    publisher,
    setPublisher,
    isrc,
    setIsrc,
    explicitContent,
    setExplicitContent,
    pline,
    setPline,
    enableDownloads,
    setEnableDownloads,
    offlineListening,
    setOfflineListening,
    includeRssFeed,
    setIncludeRssFeed,
    displayEmbedCode,
    setDisplayEmbedCode,
    enableAppPlayback,
    setEnableAppPlayback,
    allowComments,
    setAllowComments,
    showTrackComments,
    setShowTrackComments,
    showTrackInsights,
    setShowTrackInsights,
    geoblockingOption,
    setGeoblockingOption,
    licenseType,
    setLicenseType,
    isArtistPro = false,
    onReplaceTrackFile,
  } = props;

  const roundedUploadProgress = Math.round(uploadProgress);
  const showUploadProgress = isUploading;
  const hasTrackForReplacement = Boolean(currentFile || uploadedFileUrl);
  const hasFinishedUpload = !isUploading && uploadProgress >= 99.5;
  const showReplaceTrack = hasTrackForReplacement && hasFinishedUpload;

  const handleReplaceTrack = () => {
    replaceFileInputRef.current?.click();
  };

  const handleReplaceTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const supportedAudioExtensions = [".wav", ".flac", ".aiff", ".aif", ".alac", ".m4a", ".mp3", ".aac", ".ogg", ".opus"];
    const fileName = file.name.toLowerCase();
    const hasSupportedAudioExtension = supportedAudioExtensions.some((ext) => fileName.endsWith(ext));
    if (!file.type.startsWith("audio/") && !hasSupportedAudioExtension) {
      setSubmitError("Track upload only accepts audio files.");
      e.target.value = "";
      return;
    }

    setSubmitError(null);
    onReplaceTrackFile(file);
    e.target.value = "";
  };

  const handleArtworkPick = () => {
    artworkInputRef.current?.click();
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
    e.target.value = "";
  };

  const handleTrackDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTrackDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const supportedAudioExtensions = [".wav", ".flac", ".aiff", ".aif", ".alac", ".m4a", ".mp3", ".aac", ".ogg", ".opus"];
    const fileName = file.name.toLowerCase();
    const hasSupportedAudioExtension = supportedAudioExtensions.some((ext) => fileName.endsWith(ext));
    if (!file.type.startsWith("audio/") && !hasSupportedAudioExtension) {
      setSubmitError("Track upload only accepts audio files.");
      return;
    }

    setSubmitError(null);
    onReplaceTrackFile(file);
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
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
  };

  const handleDeleteArtwork = () => {
    setArtworkFile(null);
    setArtworkUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
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
    if (target?.closest('[data-artwork-control="true"]')) {
      return;
    }

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
    const movementScale = 1;

    setArtworkPosition({
      x: clampArtworkPosition(artworkPanStartRef.current.startX + (dx / width) * movementScale),
      y: clampArtworkPosition(artworkPanStartRef.current.startY + (dy / height) * movementScale),
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

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toOptionalTrimmed = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const toList = (value: string): string[] => {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  };

  const permaLinkRegex = /^[a-z0-9_-]+$/;
  const permaLinkHasCharRegex = /[a-z0-9_-]/;
  const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;

  const createZoomCroppedArtworkFile = async (
    file: File,
    zoom: number,
    position: { x: number; y: number }
  ): Promise<File> => {
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

      // Match preview behavior: centered square crop scaled by chosen zoom.
      const cropSize = Math.max(1, Math.round(shortestSide / boundedZoom));
      const maxOffsetX = Math.max(0, (imageWidth - cropSize) / 2);
      const maxOffsetY = Math.max(0, (imageHeight - cropSize) / 2);
      const centerX = imageWidth / 2 - clampArtworkPosition(position.x) * maxOffsetX;
      const centerY = imageHeight / 2 - clampArtworkPosition(position.y) * maxOffsetY;
      const sourceX = Math.max(0, Math.min(imageWidth - cropSize, Math.floor(centerX - cropSize / 2)));
      const sourceY = Math.max(0, Math.min(imageHeight - cropSize, Math.floor(centerY - cropSize / 2)));

      const canvas = document.createElement("canvas");
      canvas.width = cropSize;
      canvas.height = cropSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to process artwork image.");
      }

      ctx.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      const outputType = file.type.startsWith("image/") ? file.type : "image/jpeg";
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
              return;
            }
            reject(new Error("Failed to generate cropped artwork."));
          },
          outputType,
          0.92
        );
      });

      return new File([blob], file.name, {
        type: blob.type || outputType,
        lastModified: Date.now(),
      });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const musicGenres = [
    "Alternative Rock",
    "Ambient",
    "Classical",
    "Country",
    "Dance & EDM",
    "Dancehall",
    "Deep House",
    "Disco",
    "Drum & Bass",
    "Dubstep",
    "Electronic",
    "Folk & Singer-Songwriter",
    "Hip-hop & Rap",
    "House",
    "Indie",
    "Jazz & Blues",
    "Latin",
    "Metal",
    "Piano",
    "Pop",
    "R&B & Soul",
    "Reggae",
    "Reggaeton",
    "Rock",
    "Soundtrack",
    "Speech",
    "Techno",
    "Trance",
    "Trap",
    "Triphop",
    "World",
  ];
  const audioGenres = [
    "Audiobooks",
    "Business",
    "Comedy",
    "Entertainment",
    "Learning",
    "News & Politics",
    "Religion & Spirituality",
    "Science",
    "Sports",
    "Storytelling",
    "Technology",
  ];

  const normalizedGenreSearch = genreSearch.trim().toLowerCase();
  const filteredMusicGenres = musicGenres.filter((item) => item.toLowerCase().includes(normalizedGenreSearch));
  const filteredAudioGenres = audioGenres.filter((item) => item.toLowerCase().includes(normalizedGenreSearch));
  const shouldShowAddCustomGenre =
    normalizedGenreSearch.length > 0 && filteredMusicGenres.length === 0 && filteredAudioGenres.length === 0;

  const commitGenreSearch = () => {
    const nextGenre = genreSearch.trim();
    if (nextGenre !== genre) {
      setGenre(nextGenre);
    }
  };

  const formatTimeLabel = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const m = Math.floor(safe / 60);
    const s = `${safe % 60}`.padStart(2, "0");
    return `${m}:${s}`;
  };

  const parseTimeInputToSeconds = (value: string): number | null => {
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
  };

  const parseIsoDate = (value: string): Date | null => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length !== 3) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatIsoDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (value: string): string => {
    const date = parseIsoDate(value);
    if (!date) return "";
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const selectedReleaseDate = parseIsoDate(releaseDate);
  const calendarMonthStart = new Date(releaseCalendarMonth.getFullYear(), releaseCalendarMonth.getMonth(), 1);
  const calendarGridStart = new Date(
    calendarMonthStart.getFullYear(),
    calendarMonthStart.getMonth(),
    1 - calendarMonthStart.getDay()
  );
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(calendarGridStart);
    day.setDate(calendarGridStart.getDate() + i);
    return day;
  });

  const openReleaseCalendar = () => {
    const baseDate = selectedReleaseDate || new Date();
    setReleaseCalendarMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setReleaseCalendarOpen(true);
  };

  const shiftReleaseCalendarMonth = (delta: number) => {
    setReleaseCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleSelectReleaseDate = (date: Date) => {
    setReleaseDate(formatIsoDate(date));
    setReleaseCalendarOpen(false);
  };

  const buildCreateTrackPayload = async (): Promise<CreateTrackRequest> => {
    const permalink = (slug || "").trim();
    const mainArtists = toList(artistName);
    const parsedTags = toList(tags);
    const parsedDescription = toOptionalTrimmed(description);
    const parsedGenre = toOptionalTrimmed(genre);
    const parsedReleaseDate = toOptionalTrimmed(releaseDate);
    const parsedIsrc = toOptionalTrimmed(isrc);
    const normalizedIsrc = parsedIsrc
      ? parsedIsrc.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      : undefined;
    const canAttachAudioClip = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;
    const parsedAudioClipStart = canAttachAudioClip ? toOptionalTrimmed(audioClipStartInput) : undefined;
    const parsedAudioClipEnd = canAttachAudioClip ? toOptionalTrimmed(audioClipEndInput) : undefined;
    const audioClipStartValue = parsedAudioClipStart !== undefined ? Number(parsedAudioClipStart) : undefined;
    const audioClipEndValue = parsedAudioClipEnd !== undefined ? Number(parsedAudioClipEnd) : undefined;
    const parsedTitle = trackTitle.trim();

    if (!currentFile) {
      throw new Error("An audio file is required.");
    }
    if (currentFile.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Audio file exceeds the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`);
    }
    if (!parsedTitle) {
      throw new Error("Track title is required.");
    }
    if (!permaLinkRegex.test(permalink)) {
      throw new Error("Use only lowercase letters, numbers, underscores, or hyphens.");
    }
    if (!permaLinkHasCharRegex.test(permalink)) {
      throw new Error("Permalink cannot be only digits.");
    }
    if (mainArtists.length < 1) {
      throw new Error("At least one artist is required");
    }
    if (tags.trim().length > 0 && parsedTags.length < 1) {
      throw new Error("At least one tag is required");
    }
    if (description.length > 0 && !parsedDescription) {
      throw new Error("Description cannot be empty");
    }
    if (parsedReleaseDate && Number.isNaN(Date.parse(parsedReleaseDate))) {
      throw new Error("Invalid date format, must be ISO 8601");
    }
    if (normalizedIsrc && !isrcRegex.test(normalizedIsrc)) {
      throw new Error(
        "An ISRC (International Standard Recording Code) is a unique identifier that is assigned to a track. Use the same ISRC for a given track wherever you distribute it."
      );
    }
    if (canAttachAudioClip && audioClipStartValue !== undefined && (!Number.isFinite(audioClipStartValue) || audioClipStartValue < 0)) {
      throw new Error("Audio clip start must be a valid non-negative number.");
    }
    if (canAttachAudioClip && audioClipEndValue !== undefined && (!Number.isFinite(audioClipEndValue) || audioClipEndValue <= 0)) {
      throw new Error("Audio clip end must be a valid number greater than 0.");
    }
    if (
      canAttachAudioClip &&
      audioClipStartValue !== undefined &&
      audioClipEndValue !== undefined &&
      audioClipEndValue <= audioClipStartValue
    ) {
      throw new Error("Audio clip end must be greater than audio clip start.");
    }

    const zoomCroppedArtwork = artworkFile
      ? await createZoomCroppedArtworkFile(artworkFile, artworkZoom, artworkPosition)
      : undefined;

    return {
      audio: currentFile,
      image: zoomCroppedArtwork,
      basicInfo: {
        title: parsedTitle,
        permalink,
        mainArtists,
        genre: parsedGenre,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        description: parsedDescription,
        isPrivate: !isPublic,
      },
      permissions: {
        enableDirectDownload: enableDownloads,
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
        audioClipEnd: canAttachAudioClip ? audioClipEndValue : undefined,
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
      const message = error instanceof Error ? error.message : "Failed to validate upload payload.";
      setSubmitError(message);
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
        const combined = validationErrors
          .map((entry: { field?: string; message?: string }) => {
            const field = entry.field ? `${entry.field}: ` : "";
            return `${field}${entry.message || "Invalid value"}`;
          })
          .join(" | ");
        setSubmitError(combined);
      } else {
        const message = error?.response?.data?.message || "Failed to create track.";
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const slug = (trackTitle || currentFileName.replace(/\.[^/.]+$/, ""))
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Shared input/label styles matching SoundCloud's underline-only fields
  const fieldCls = "w-full bg-transparent border-0 border-b border-[#333] text-[13px] text-white-smoke placeholder-[#555] focus:outline-none focus:border-[#666] pb-2 pt-1 transition-colors";
  const labelCls = "mb-1.5 block text-[13px] font-semibold text-white-smoke";
  const AdvfieldCls = "w-full bg-transparent border border-white-smoke text-[13px] text-white-smoke pl-4 placeholder-[#555] focus:outline-none focus:border-[#666] pb-2 pt-1 transition-colors";


  useEffect(() => {
    return () => {
      if (artworkUrl) URL.revokeObjectURL(artworkUrl);
    };
  }, [artworkUrl]);

  useEffect(() => {
    if (createTrackError) {
      setSubmitError(createTrackError);
    }
  }, [createTrackError]);

  useEffect(() => {
    setVisibilityOption((prev) => {
      if (!isPublic && prev === "followerExclusive") {
        return prev;
      }
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

  const canSetAudioPreview = audioDurationSeconds > AUDIO_PREVIEW_SECONDS;
  const timelineMax = audioDurationSeconds > 0 ? audioDurationSeconds : AUDIO_PREVIEW_SECONDS;
  const selectionDuration = canSetAudioPreview
    ? AUDIO_PREVIEW_SECONDS
    : Math.max(1, Math.min(AUDIO_PREVIEW_SECONDS, timelineMax));
  const clipStartSeconds = Number(audioClipStartInput);
  const rawClipStart = Number.isFinite(clipStartSeconds) ? Math.max(0, clipStartSeconds) : 0;
  const safeClipStart = canSetAudioPreview
    ? clamp(rawClipStart, 0, Math.max(0, timelineMax - selectionDuration))
    : 0;
  const safeClipEnd = canSetAudioPreview ? safeClipStart + selectionDuration : selectionDuration;
  const clipDuration = Math.max(1, safeClipEnd - safeClipStart);
  const clipLeftPercent = Math.min(100, (safeClipStart / timelineMax) * 100);
  const clipWidthPercent = Math.max(5, Math.min(100 - clipLeftPercent, (clipDuration / timelineMax) * 100));
  const rightShadePercent = Math.max(0, 100 - (clipLeftPercent + clipWidthPercent));
  const clipPlaybackPercentInWindow = clamp(((clipPlaybackSeconds - safeClipStart) / clipDuration) * 100, 0, 100);
  //const clipPlaybackOverlayPercent = isClipPlaying ? clipPlaybackPercentInWindow : 0;
  const clipPlaybackOverlayPercent = clipPlaybackPercentInWindow;
  const liveClipStart = isDraggingClip ? (clipDragDisplayRange?.start ?? safeClipStart) : safeClipStart;
  const isClipWindowAtZeroStart = liveClipStart < 0.5;
  const showClipResetButton = liveClipStart > 0.001;

  const waveformDisplaySamples = useMemo(
    () =>
      Array.from(
        { length: 220 },
        (_, idx) => 48 + Math.sin(idx / 7) * 12 + Math.cos(idx / 15) * 7,
      ),
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
            className="block w-full"
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
            className="block w-full"
            style={{ height: `${Math.round(14 + normalized * 72)}px`, backgroundColor: "var(--waveform-left-wave)" }}
          />
        );
      }),
    [waveformDisplaySamples, waveformMax],
  );

  const xToSeconds = (clientX: number) => {
    const metrics = clipTrackMetricsRef.current;
    if (metrics && metrics.width > 0) {
      const ratio = clamp((clientX - metrics.left) / metrics.width, 0, 1);
      return ratio * timelineMax;
    }

    const rect = clipTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return safeClipStart;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * timelineMax;
  };

  const updateClipTrackMetrics = () => {
    const rect = clipTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) {
      clipTrackMetricsRef.current = null;
      return null;
    }
    const metrics = { left: rect.left, width: rect.width };
    clipTrackMetricsRef.current = metrics;
    return metrics;
  };

  const applyClipVisualRange = (start: number, end: number) => {
    const duration = Math.max(0.001, end - start);
    const metrics = clipTrackMetricsRef.current;
    const leftPercent = Math.min(100, (start / timelineMax) * 100);
    const widthPercent = Math.max(5, Math.min(100 - leftPercent, (duration / timelineMax) * 100));

    if (clipSelectionRef.current) {
      if (metrics && metrics.width > 0) {
        const leftPx = (leftPercent / 100) * metrics.width;
        const widthPx = (widthPercent / 100) * metrics.width;
        clipSelectionRef.current.style.left = "0px";
        clipSelectionRef.current.style.width = `${widthPx}px`;
        clipSelectionRef.current.style.transform = `translate3d(${leftPx}px, 0, 0)`;
      } else {
        clipSelectionRef.current.style.transform = "translate3d(0px, 0, 0)";
        clipSelectionRef.current.style.left = `${leftPercent}%`;
        clipSelectionRef.current.style.width = `${widthPercent}%`;
      }
    }
    if (clipLeftShadeRef.current) {
      if (metrics && metrics.width > 0) {
        const leftPx = (leftPercent / 100) * metrics.width;
        clipLeftShadeRef.current.style.width = `${leftPx}px`;
      } else {
        clipLeftShadeRef.current.style.width = `${leftPercent}%`;
      }
    }
    if (clipLeftShadeWaveRef.current) {
      if (metrics && metrics.width > 0) {
        clipLeftShadeWaveRef.current.style.width = `${metrics.width}px`;
      } else {
        clipLeftShadeWaveRef.current.style.width = "100%";
      }
    }
  };

  const setDraggedClipRange = (nextStart: number, nextEnd: number, options?: { syncDraft?: boolean }) => {
    const preciseStart = Number(nextStart.toFixed(3));
    const preciseEnd = Number(nextEnd.toFixed(3));
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
    try {
      await clipAudio.play();
      setIsClipPlaying(true);
    } catch {
      setIsClipPlaying(false);
    }
  };

  const handleClipReset = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !canSetAudioPreview) return;

    const resetStart = 0;
    const resetEnd = Math.min(AUDIO_PREVIEW_SECONDS, timelineMax);

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

    const maxStart = Math.max(0, timelineMax - AUDIO_PREVIEW_SECONDS);
    const nextStart =
      target === "start"
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
    if (target?.closest('[data-clip-control="true"]')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    clipActivePointerIdRef.current = event.pointerId;
    clipWasPlayingOnDragStartRef.current = isClipPlaying;
    const rect = clipTrackRef.current?.getBoundingClientRect();
    clipTrackMetricsRef.current = rect && rect.width > 0 ? { left: rect.left, width: rect.width } : null;
    clipDragOffsetRef.current = xToSeconds(event.clientX) - safeClipStart;
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
    const shouldResume = resumeTime > safeClipStart && resumeTime < safeClipEnd;
    await playClipFrom(shouldResume ? resumeTime : safeClipStart);
  };

  const handleClipTimeUpdate = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio) return;
    setClipPlaybackSeconds(clipAudio.currentTime);
    if (clipAudio.currentTime >= safeClipEnd) {
      //clipAudio.pause();
      clipAudio.currentTime = safeClipStart;
      setClipPlaybackSeconds(safeClipStart);
      //setIsClipPlaying(false);
    }
  };

  useEffect(() => {
    if (!isDraggingClip || !canSetAudioPreview) return;

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      const rangeStart = xToSeconds(event.clientX) - clipDragOffsetRef.current;
      const boundedStart = clamp(rangeStart, 0, Math.max(0, timelineMax - clipDuration));
      const boundedEnd = boundedStart + clipDuration;

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
            Math.floor(prev.end) === Math.floor(pending.end)
          ) {
            return prev;
          }
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
      clipTrackMetricsRef.current = null;

      const pending = clipPendingRangeRef.current;
      if (pending) {
        setDraggedClipRange(pending.start, pending.end);
        if (clipAudioRef.current) {
          clipAudioRef.current.currentTime = pending.start;
        }
        if (clipWasPlayingOnDragStartRef.current) {
          void playClipFrom(pending.start);
        }
      } else {
        setAudioClipStartDraft(formatTimeLabel(safeClipStart));
        setAudioClipEndDraft(formatTimeLabel(safeClipEnd));
      }

      clipPendingRangeRef.current = null;
      clipVisualRangeRef.current = null;
      clipWasPlayingOnDragStartRef.current = false;
      setClipDragDisplayRange(null);
      setIsDraggingClip(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      if (clipDragRafRef.current !== null) {
        window.cancelAnimationFrame(clipDragRafRef.current);
        clipDragRafRef.current = null;
      }
      clipActivePointerIdRef.current = null;
      clipTrackMetricsRef.current = null;
      clipPendingRangeRef.current = null;
      clipVisualRangeRef.current = null;
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

    const observer = new ResizeObserver(() => {
      syncVisuals();
    });
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
    if (clipAudio) {
      clipAudio.pause();
      clipAudio.currentTime = 0;
    }
    setClipPlaybackSeconds(0);
    setIsClipPlaying(false);
  }, [uploadedFileUrl]);

  const handleClipMetadataLoaded = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !Number.isFinite(clipAudio.duration) || clipAudio.duration <= 0) {
      return;
    }

    const duration = clipAudio.duration;
    setAudioDurationSeconds(duration);

    if (duration <= AUDIO_PREVIEW_SECONDS) {
      setDraggedClipRange(0, duration);
      return;
    }

    const boundedStart = clamp(safeClipStart, 0, Math.max(0, duration - AUDIO_PREVIEW_SECONDS));
    const boundedEnd = boundedStart + AUDIO_PREVIEW_SECONDS;

    if (boundedStart !== safeClipStart || boundedEnd !== safeClipEnd || clipDuration !== AUDIO_PREVIEW_SECONDS) {
      setDraggedClipRange(boundedStart, boundedEnd);
    }
  };

  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke antialiased">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-chinese-black">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <input
            ref={replaceFileInputRef}
            type="file"
            accept="audio/*,.wav,.flac,.aiff,.aif,.alac,.m4a,.mp3"
            className="hidden"
            onChange={handleReplaceTrackChange}
          />

          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/home")}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#1b1c20] cursor-pointer"
            >
              <Image src="/app-logo/whitelogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-dark" priority />
              <Image src="/app-logo/blacklogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-light" priority />
            </button>
            <span className="text-[16px] font-semibold text-white-smoke">Track Info</span>
          </div>

          {/* Right: File info + Actions */}
          <div
            className={`flex w-full flex-wrap items-center justify-end gap-3 rounded-md border border-dashed px-3 py-2 transition-colors md:w-auto md:max-w-[65%] ${
              isTrackDragActive ? "border-white-smoke bg-chinese-black" : "border-transparent"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (!isTrackDragActive) setIsTrackDragActive(true);
            }}
            onDragLeave={(e) => {
              const relatedTarget = e.relatedTarget as Node | null;
              if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                setIsTrackDragActive(false);
              }
            }}
            onDrop={handleTrackDrop}
          >
            {showUploadProgress ? (
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <span className="truncate text-[12px] text-white-smoke">{currentFileName}</span>
                <div className="w-24 h-1 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${roundedUploadProgress > 50 ? "bg-[#1db954]" : "bg-white-smoke"}`}
                    style={{ width: `${roundedUploadProgress}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-[12px] font-semibold text-white-smoke">{roundedUploadProgress}%</span>
              </div>
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                {uploadedFileUrl && (
                  <button
                    onClick={togglePlayPause}
                    className="flex h-7 w-7 items-center justify-center text-white-smoke hover:text-[#f2f2f2] transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <PauseCircleOutlined className="text-[16px]" />
                    ) : (
                      <PlayCircleOutlined className="text-[16px]" />
                    )}
                  </button>
                )}
                <span className="truncate text-[12px] text-white-smoke">{currentFileName}</span>
              </div>
            )}

            {isTrackDragActive && (
              <span className="text-[11px] font-semibold text-white/85">Drop audio file to upload</span>
            )}

            {showReplaceTrack && (
              <button onClick={handleReplaceTrack} className="text-[12px] font-semibold text-white-smoke hover:underline cursor-pointer">
                Replace track
              </button>
            )}
            <button
              onClick={() => setShowQuitModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#222] text-[#ccc] transition-colors hover:bg-[#333] cursor-pointer"
            >
              <CloseOutlined className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Quit Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-login px-4">
          <div className="relative w-full max-w-105 rounded-lg bg-chinese-black border border-[#2b2c31] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowQuitModal(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2c31] text-[#ccc] transition-colors hover:bg-[#38383d] cursor-pointer"
              aria-label="Cancel quit"
            >
              <CloseOutlined className="text-[14px]" />
            </button>

            <h2 className="text-[16px] font-bold text-white-smoke pr-10">Are you sure you want to quit?</h2>
            <p className="mt-3 text-[13px] text-[#888]">Your changes will not be saved.</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuitModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-white-smoke rounded transition-colors hover:bg-[#2b2c31] cursor-pointer"
              >
                Back to upload
              </button>
              <button
                type="button"
                onClick={() => router.push("/artists")}
                className="rounded-full bg-[#f25870] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff6b81] cursor-pointer"
              >
                Quit upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showProFeatureModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-login px-4">
          <div className="relative w-full max-w-105 rounded-lg bg-chinese-black border border-[#2b2c31] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowProFeatureModal(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2c31] text-[#ccc] transition-colors hover:bg-[#38383d] cursor-pointer"
              aria-label="Close pro feature modal"
            >
              <CloseOutlined className="text-[14px]" />
            </button>

            <h2 className="pr-10 text-[16px] font-bold text-white-smoke">Artist Pro feature</h2>
            <p className="mt-3 text-[13px] text-[#888]">
              Follower Exclusive is available for Artist Pro accounts. Upgrade to unlock this option.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowProFeatureModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-white-smoke rounded transition-colors hover:bg-[#2b2c31] cursor-pointer"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={() => router.push("/artistpro")}
                className="rounded-full bg-[#f5a623] px-5 py-2 text-[13px] font-semibold text-chinese-black transition-colors hover:bg-[#ffc55a] cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 pb-36 sm:px-5">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left - Artwork */}
          <div className="lg:col-span-4">
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-90">
              <input
                ref={artworkInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleArtworkChange}
              />

              <div
                ref={artworkFrameRef}
                className={`group relative aspect-square w-full overflow-hidden rounded border bg-chinese-black transition-colors ${
                  artworkUrl
                    ? "border-transparent"
                    : isArtworkDragActive
                      ? "border-dashed border-white-smoke"
                      : "border-dashed border-[#444] hover:border-white-smoke"
                } ${artworkUrl ? (isPanningArtwork ? "cursor-grabbing" : "cursor-grab") : ""}`}
                style={{ touchAction: artworkUrl ? "none" : "auto", userSelect: "none" }}
                onPointerDown={handleArtworkPointerDown}
                onPointerMove={handleArtworkPointerMove}
                onPointerUp={handleArtworkPointerUp}
                onPointerCancel={handleArtworkPointerUp}
                onDragOver={(e) => {
                  const isFileDrag = Array.from(e.dataTransfer.types || []).includes("Files");
                  if (!isFileDrag) return;
                  e.preventDefault();
                  if (!isArtworkDragActive) setIsArtworkDragActive(true);
                }}
                onDragLeave={(e) => {
                  const relatedTarget = e.relatedTarget as Node | null;
                  if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                    setIsArtworkDragActive(false);
                  }
                }}
                onDrop={handleArtworkDrop}
              >
                {artworkUrl ? (
                  <Image
                    src={artworkUrl}
                    alt="Artwork"
                    fill
                    className="object-cover"
                    style={{
                      transform: `translate(${artworkPosition.x * (artworkZoom - 1) * 50}%, ${artworkPosition.y * (artworkZoom - 1) * 50}%) scale(${artworkZoom})`,
                      objectPosition: "50% 50%",
                    }}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    unoptimized
                  />
                ) : (
                  <button type="button" onClick={handleArtworkPick} className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 cursor-pointer">
                    <PictureOutlined className="text-[100px] text-white-smoke transition-colors" />
                    <span className="text-[15px] font-semibold text-white-smoke transition-colors">Add new artwork</span>
                  </button>
                )}

                {isArtworkDragActive && (
                  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/45">
                    <span className="rounded-full border border-white/55 px-4 py-2 text-[12px] font-semibold text-white-smoke">Drop image here</span>
                  </div>
                )}

                {artworkUrl && (
                  <>
                    <div
                      className="absolute bottom-3 right-3 flex flex-col gap-2"
                      data-artwork-control="true"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        title="Replace Image"
                        onClick={handleArtworkPick}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-chinese-black text-white-smoke transition-colors hover:bg-[#2a2b31] cursor-pointer"
                        aria-label="Replace artwork"
                      >
                        <GrEdit className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        title="Remove Image"
                        onClick={handleDeleteArtwork}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-chinese-black text-white-smoke transition-colors hover:bg-[#2a2b31] cursor-pointer"
                        aria-label="Delete artwork"
                      >
                        <RiDeleteBinLine className="text-[18px]" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {artworkUrl && (
                <div className="mt-3 flex items-center gap-3 rounded-md bg-chinese-black px-3 py-2" data-artwork-control="true">
                  <button
                    type="button"
                    onClick={() => setArtworkZoom((z) => Math.max(1, Number((z - 0.1).toFixed(2))))}
                    className="text-white-smoke/90 hover:text-white"
                    aria-label="Zoom out"
                  >
                    <MinusOutlined />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={artworkZoom}
                    onChange={(e) => setArtworkZoom(Number(e.target.value))}
                    className="w-full accent-white-smoke"
                    aria-label="Artwork zoom"
                  />
                  <button
                    type="button"
                    onClick={() => setArtworkZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
                    className="text-white-smoke/90 hover:text-white"
                    aria-label="Zoom in"
                  >
                    <PlusOutlined />
                  </button>
                </div>
              )}

              {/* Collapsible Sections fixed under artwork */}
            </div>
          </div>

          {/* Right - Form */}
          <div className="space-y-6 lg:col-span-8">
            {submitError && (
              <div className="rounded-md border border-[#5a2d34] bg-chinese-black px-3 py-2 text-[12px] text-[#ff97a9]">
                {submitError}
              </div>
            )}

            {/* Track Title */}
            <div>
              <label className={labelCls}>
                Track title <InfoTooltip text={TOOLTIP_TEXT.trackTitle} />
              </label>
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="Enter track title"
                className={fieldCls}
              />
            </div>

            {/* Track Link */}
            <div>
              <label className={labelCls}>Track link</label>
              <div className="border-b border-[#333] pb-2 pt-1 text-[13px] text-white-smoke truncate">
                https://beatza.me/{slug || "your-track"}/
              </div>
            </div>

            {/* Artist */}
            <div>
              <label className={labelCls}>
                Main Artist(s) <InfoTooltip text={TOOLTIP_TEXT.mainArtists} />
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Your artist name"
                className={fieldCls}
              />
              <p className="mt-1.5 text-[11px] text-white-smoke">Tip: Use commas to add multiple artist names.</p>
            </div>

            {/* Genre */}
            <div>
              <label className={labelCls}>Genre</label>
              <div className="relative" ref={genreMenuRef}>
                <div className="flex w-full items-center justify-between border-b border-[#333] pb-2 pt-1 text-left">
                  <input
                    type="text"
                    value={genreMenuOpen ? genreSearch : genre}
                    onFocus={() => {
                      setGenreSearch(genre);
                      setGenreMenuOpen(true);
                    }}
                    onChange={(e) => {
                      setGenreSearch(e.target.value);
                      if (!genreMenuOpen) setGenreMenuOpen(true);
                    }}
                    onBlur={() => {
                      commitGenreSearch();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && shouldShowAddCustomGenre) {
                        e.preventDefault();
                        setGenre(genreSearch.trim());
                        setGenreSearch("");
                        setGenreMenuOpen(false);
                      }
                    }}
                    placeholder="Add or search for genre"
                    className="w-full bg-transparent text-[13px] text-white-smoke placeholder-[#555] focus:outline-none"
                  />
                  <span className="flex items-center gap-3 text-white-smoke">
                    {genre && (
                      <CloseOutlined
                        onClick={() => {
                          setGenre("");
                          setGenreSearch("");
                        }}
                        className="cursor-pointer text-[12px]"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!genreMenuOpen) {
                          setGenreSearch(genre);
                        } else {
                          commitGenreSearch();
                          setGenreSearch("");
                        }
                        setGenreMenuOpen((prev) => !prev);
                      }}
                      className="cursor-pointer"
                      aria-label={genreMenuOpen ? "Close genre menu" : "Open genre menu"}
                    >
                      {genreMenuOpen ? <UpOutlined className="text-[11px]" /> : <DownOutlined className="text-[11px]" />}
                    </button>
                  </span>
                </div>
                {genreMenuOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-70 overflow-y-auto rounded border border-[#2f3035] bg-chinese-black shadow-xl">
                    {filteredMusicGenres.length > 0 && (
                      <>
                        <p className="px-4 py-2 text-[13px] text-white-smoke">All music genres</p>
                        {filteredMusicGenres.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setGenre(item);
                              setGenreSearch("");
                              setGenreMenuOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-[13px] bg-[#1e1e1e] text-white-smoke hover:bg-[#3a3b3f]"
                          >
                            {item}
                          </button>
                        ))}
                      </>
                    )}

                    {filteredAudioGenres.length > 0 && (
                      <>
                        <p className="border-t border-[#2a2b30] px-4 py-2 text-[13px] text-white-smoke">All audio genres</p>
                        {filteredAudioGenres.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setGenre(item);
                              setGenreSearch("");
                              setGenreMenuOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-[13px] bg-[#1e1e1e] text-white-smoke hover:bg-[#3a3b3f]"
                          >
                            {item}
                          </button>
                        ))}
                      </>
                    )}

                    {shouldShowAddCustomGenre && (
                      <button
                        type="button"
                        onClick={() => {
                          setGenre(genreSearch.trim());
                          setGenreSearch("");
                          setGenreMenuOpen(false);
                        }}
                        className="block w-full border-t border-[#2a2b30] px-4 py-3 text-left text-[13px] font-semibold text-white-smoke hover:bg-[#3a3b3f]"
                      >
                        Add "{genreSearch.trim()}"
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>
                Tags <InfoTooltip text={TOOLTIP_TEXT.tags} />
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add styles, moods, tempo"
                className={fieldCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tracks with descriptions tend to get more plays and engagements."
                rows={1}
                className={`${fieldCls} resize-none`}
              />
            </div>

            {/* Privacy */}
            <div className="relative rounded border border-[#2a2a2a] bg-chinese-black p-4" ref={privacyMenuRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPrivacyMenuOpen((prev) => !prev)}
                  className="grid w-full cursor-pointer grid-cols-[2rem_1fr_auto] items-start gap-x-3 text-left"
                  aria-expanded={privacyMenuOpen}
                  aria-label="Toggle privacy options"
                >
                  <div className="flex h-8 w-8 items-center justify-center">
                    {visibilityOption === "public" ? (
                      <CiGlobe className="text-[24px] text-[#1db954]" />
                    ) : visibilityOption === "private" ? (
                      <FiLock className="text-[20px] text-white-smoke" />
                    ) : (
                      <UserAddOutlined className="text-[20px] text-white-smoke" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white-smoke">
                      {visibilityOption === "public" ? "Public" : visibilityOption === "private" ? "Private" : "Follower Exclusive"}
                    </p>
                    <p className="text-[11px] text-white-smoke">
                      {visibilityOption === "public"
                        ? "Anyone can access and listen to this track."
                        : visibilityOption === "private"
                          ? "Track is not discoverable. Only people with private link can view and listen."
                          : "Only those who follow you can access."}
                    </p>
                  </div>
                  <span className="pt-1 text-white-smoke">
                    {privacyMenuOpen ? <UpOutlined /> : <DownOutlined />}
                  </span>
                </button>

                <div
                  className={`absolute -left-4 -right-4 top-full z-20 mt-2 overflow-hidden rounded border border-[#2a2a2a] bg-chinese-black shadow-xl transition-all duration-200 ${
                    privacyMenuOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      {
                        value: "public" as const,
                        title: "Public",
                        desc: "Anyone can access and listen to this track.",
                        icon: <CiGlobe className={`text-[24px] ${visibilityOption === "public" ? "text-[#1db954]" : "text-white-smoke"}`} />,
                      },
                      {
                        value: "private" as const,
                        title: "Private",
                        desc: "Track is not discoverable. Only people with private link can view and listen.",
                        icon: <FiLock className="text-[20px] text-white-smoke" />,
                      },
                      {
                        value: "followerExclusive" as const,
                        title: "Follower Exclusive",
                        desc: "Only those who follow you can access.",
                        icon: <UserAddOutlined className="text-[20px] text-white-smoke" />,
                        isProOnly: true,
                      },
                    ].map((item) => (
                      item.value === "followerExclusive" && !isArtistPro ? (
                        <ProLockTooltip key={item.value} text={TOOLTIP_TEXT.proFollowerExclusive}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowProFeatureModal(true);
                            }}
                            className={`grid w-full cursor-not-allowed grid-cols-[2rem_1fr] items-start gap-x-3 px-3 py-3 text-left ${visibilityOption === item.value ? "bg-upload-select" : "bg-chinese-black hover:bg-upload-schedular"}`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center">{item.icon}</span>
                            <span>
                              <p className="flex items-center gap-2 text-[13px] font-semibold text-white-smoke">
                                {item.title}
                                <span className="rounded border border-[#f5a623] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#f5a623]">PRO</span>
                              </p>
                              <p className="text-[11px] text-white-smoke">{item.desc}</p>
                            </span>
                          </button>
                        </ProLockTooltip>
                      ) : (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setVisibilityOption(item.value);
                            setPrivacyMenuOpen(false);
                          }}
                          className={`grid w-full cursor-pointer grid-cols-[2rem_1fr] items-start gap-x-3 px-3 py-3 text-left ${visibilityOption === item.value ? "bg-upload-select" : "bg-chinese-black hover:bg-upload-schedular"}`}
                        >
                          <span className="flex h-8 w-8 items-center justify-center">{item.icon}</span>
                          <span>
                            <p className="flex items-center gap-2 text-[13px] font-semibold text-white-smoke">
                              {item.title}
                              {item.value === "followerExclusive" && (
                                <span className="rounded border border-[#f5a623] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#f5a623]">PRO</span>
                              )}
                            </p>
                            <p className="text-[11px] text-white-smoke">{item.desc}</p>
                          </span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-[#2a2a2a] pt-3">
                {isArtistPro ? (
                  <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <FaRegClock className="text-[20px] text-white-smoke" />
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-[12px] font-semibold text-white-smoke">
                        Schedule public release <span className="text-[#f5a623]">ARTIST PRO</span>
                      </p>
                      <p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
                    </div>
                    <Switch
                      checked={scheduleRelease}
                      onChange={setScheduleRelease}
                      disabled={!isArtistPro}
                      className="shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!"
                    />
                  </div>
                ) : (
                  <ProLockTooltip text={TOOLTIP_TEXT.proScheduleRelease} referenceClassName="w-full" placement="bottom">
                    <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3 opacity-60">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <FaRegClock className="text-[20px] text-white-smoke" />
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-[12px] font-semibold text-white-smoke">
                          Schedule public release <span className="text-[#f5a623]">ARTIST PRO</span>
                        </p>
                        <p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
                      </div>
                      <span className="inline-flex">
                        <Switch
                          checked={scheduleRelease}
                          onChange={setScheduleRelease}
                          disabled={!isArtistPro}
                          className="shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!"
                        />
                      </span>
                    </div>
                  </ProLockTooltip>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible Sections (full width below top two-column area) */}
        <div className="mt-8 border-t border-[#222] bg-chinese-black/95">

          {/* Advanced Details */}
          <button onClick={() => toggleSection("advancedDetails")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div>
              <p className="text-[13px] font-semibold text-white-smoke">Advanced details</p>
              <p className="text-[11px] text-white-smoke mt-0.5">Buy link, record label, release date, publisher...</p>
            </div>
            {expandedSections.advancedDetails ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.advancedDetails && (
              <motion.div
                key="advanced-details"
                initial={{ height: 0, opacity: 0, y: -6 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-b border-[#222]"
              >
                <div className="space-y-5 py-4">
              {[
                { label: "Buy link", value: buyLink, setter: setBuyLink, placeholder: "Add a link to let your fans purchase the track from another site", info: "" },
                { label: "Record label", value: recordLabel, setter: setRecordLabel, placeholder: "If your track is released under a specific record label, you can add that here.", info: "" },
              ].map(({ label, value, setter, placeholder, info }) => (
                <div key={label}>
                  <label className={labelCls}>{label}</label>
                  <small className="flex pb-2 text-[12px] text-white/55">{info}</small>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className={AdvfieldCls}
                  />
                </div>
              ))}
              <div>
                <label className={labelCls}>Release date</label>
                <small className="flex pb-2 text-[12px] text-white/55">If your track has a specific release date, you can add that here.</small>
                <div className="relative" ref={releaseCalendarRef}>
                  <div className="relative max-w-45">
                    <input
                      type="text"
                      value={formatDisplayDate(releaseDate)}
                      readOnly
                      onClick={openReleaseCalendar}
                      placeholder="MM/DD/YYYY"
                      className={`${AdvfieldCls} pr-9 w-full cursor-pointer`}
                    />

                    <button
                      type="button"
                      onClick={() => setReleaseCalendarOpen((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white-smoke/85 hover:text-white-smoke cursor-pointer"
                      aria-label="Open release date calendar"
                    >
                      <IoMdCalendar className="text-[22px]" />
                    </button>
                  </div>

                  {releaseCalendarOpen && (
                    <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-md border border-[#2f3035] bg-chinese-black p-3 shadow-xl sm:left-0 sm:right-auto sm:w-72">
                      <div className="mb-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => shiftReleaseCalendarMonth(-1)}
                          className="rounded px-2 py-1 text-white-smoke/80 hover:bg-[#2a2b31] hover:text-white-smoke"
                          aria-label="Previous month"
                        >
                          {'<'}
                        </button>
                        <p className="text-[12px] font-semibold text-white-smoke">
                          {calendarMonthStart.toLocaleString("en-US", { month: "long", year: "numeric" })}
                        </p>
                        <button
                          type="button"
                          onClick={() => shiftReleaseCalendarMonth(1)}
                          className="rounded px-2 py-1 text-white-smoke/80 hover:bg-[#2a2b31] hover:text-white-smoke"
                          aria-label="Next month"
                        >
                          {'>'}
                        </button>
                      </div>

                      <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-[#8a8a91]">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                                  ? 'bg-[#1db954] text-chinese-black font-bold'
                                  : inCurrentMonth
                                    ? isToday
                                      ? 'border border-[#1db954] text-white-smoke'
                                      : 'text-white-smoke hover:bg-[#2a2b31]'
                                    : 'text-[#666] hover:bg-[#222]'
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
              {[
                { label: "Publisher", value: publisher, setter: setPublisher, placeholder: "", info: "If you have a publisher, you can add that here. A music publisher is a person or organization that helps songwriters promote and monetize their songs and ensure that they are properly compensated when their songs are used." },
                { label: "ISRC", value: isrc, setter: setIsrc, placeholder: "", info: "An ISRC (International Standard Recording Code) is a unique identifier that is assigned to a track. Use the same ISRC for a given track wherever you distribute it. If you work with a record label or distributor, ask them if they already have ISRCs for your tracks." },
              ].map(({ label, value, setter, placeholder, info }) => (
                <div key={label}>
                  <label className={labelCls}>{label}</label>
                  <small className="flex pb-2 text-[12px] text-white/55">{info}</small>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className={AdvfieldCls}
                  />
                </div>
              ))}
              <div>
                <label className={labelCls}>Contains explicit content</label>
                <small className="flex pb-2 text-[12px] text-white/55">Please check this if your track contains explicit content. The badge will be displayed next to your track title.</small>
                <label className="flex items-center gap-2">
                  <PrettyCheckbox checked={explicitContent} onChange={setExplicitContent} />
                  <span className="text-[12px] text-white-smoke">Explicit content</span>
                  <BsExplicitFill className="logo-dark" />
                  <BsExplicitFill className="invert logo-light" />
                </label>
              </div>
              <div>
                <label className={labelCls}>P line</label>
                <small className="text-[12px] flex pb-2 text-white/55">P line notice identify the owner of the rights in the original sound recording (the masters) at the time the CD/carrier/file is manufactured.</small>
                <input
                  type="text"
                  value={pline}
                  onChange={(e) => setPline(e.target.value)}
                  placeholder=""
                  className={AdvfieldCls}
                />
              </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Permissions */}
          <button onClick={() => toggleSection("permissions")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <IoToggleOutline className="mt-0.5 text-[22px]" />
              </span>
              <div>
                <p className="text-[17px] font-semibold text-white-smoke">Permissions</p>
                <p className="text-[15px] text-white-smoke mt-0.5">Control the visibility of engagements on your track, direct downloads, and more.</p>
              </div>
            </div>
            {expandedSections.permissions ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.permissions && (
              <motion.div
                key="permissions"
                initial={{ height: 0, opacity: 0, y: -6 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-b border-[#222]"
              >
                <div className="space-y-4 py-4 pl-14 pr-2">
              <div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
                <p className="text-[16px] font-bold text-white-smoke uppercase tracking-wide">Access settings</p>
                {[
                  { label: "Enable direct downloads", desc: "Allow listeners to download the original audio file.", val: enableDownloads, set: setEnableDownloads },
                  { label: "Offline listening", desc: "Allows this track to be played on devices without an internet connection.", val: offlineListening, set: setOfflineListening },
                  { label: "Include in RSS feed", desc: 'Choose whether you want this track to show up in the "Feed" tab.', val: includeRssFeed, set: setIncludeRssFeed },
                  { label: "Display embed code", desc: "Choose whether you want this track's embedded player code to be displayed publicly.", val: displayEmbedCode, set: setDisplayEmbedCode },
                  { label: "Enable app playback", desc: "Choose whether you want this track to be playable outside the app.", val: enableAppPlayback, set: setEnableAppPlayback },
                ].map(({ label, desc, val, set }) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[15px] font-semibold text-white-smoke">{label}</p>
                      <p className="text-[13px] text-white/55">{desc}</p>
                    </div>
                    <Switch checked={val} onChange={set} className="shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!" />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
                <p className="text-[16px] font-bold text-white-smoke uppercase tracking-wide">Engagement privacy</p>
                {[
                  { label: "Allow people to comment on your track", val: allowComments, set: setAllowComments },
                  { label: "Show track comments to public", val: showTrackComments, set: setShowTrackComments },
                  { label: "Show track insights to public", val: showTrackInsights, set: setShowTrackInsights },
                ].map(({ label, val, set }) => (
                  isArtistPro ? (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 last:border-b-0 last:pb-0">
                      <p className="text-[15px] font-semibold text-white-smoke">{label}</p>

                      <div className="flex items-center gap-2">
                        <RiLockFill className="text-[20px] text-white-smoke" />
                        <Switch
                          checked={val}
                          onChange={set}
                          disabled={!isArtistPro}
                          className="shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!"
                        />
                      </div>
                    </div>
                  ) : (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 opacity-70 last:border-b-0 last:pb-0">
                      <p className="text-[15px] font-semibold text-white-smoke">{label}</p>

                      <div className="flex items-center gap-2">
                        <RiLockFill className="text-[20px] text-white-smoke" />
                        <ProLockTooltip text={TOOLTIP_TEXT.proSwitch} referenceClassName="inline-flex h-fit w-fit" placement="bottom-end">
                          <span className="inline-flex">
                            <Switch
                              checked={val}
                              onChange={set}
                              disabled={!isArtistPro}
                              className="shrink-0 [&:not(.ant-switch-checked)]:bg-[#666666]! [&.ant-switch-checked]:bg-[#1db954]!"
                            />
                          </span>
                        </ProLockTooltip>
                      </div>
                    </div>
                  )
                ))}
              </div>
              {isArtistPro ? (
                <div>
                  <div className="ml-14">
                    <div className="flex items-center gap-1.5 mb-1">
                      <RiLockFill className="mb-1 text-[20px] text-white-smoke" />
                      <p className="flex items-center gap-1 text-[17px] font-bold text-white-smoke tracking-wide">
                        Geoblocking
                      </p>
                    </div>
                    <p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>
                  </div>
                  <div role="radiogroup" className="space-y-2">
                    {["worldwide", "exclusive", "blocked"].map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2">
                        <PrettyRadio
                          checked={geoblockingOption === opt}
                          onSelect={() => {
                            if (!isArtistPro) return;
                            setGeoblockingOption(opt);
                          }}
                        />
                        <span className="text-[15px] text-white-smoke">
                          {opt === "worldwide" ? "Worldwide" : opt === "exclusive" ? "Exclusive regions" : "Blocked regions"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <ProLockTooltip text={TOOLTIP_TEXT.proGeoblocking}>
                  <div className="opacity-55">
                    <div className="ml-14">
                      <div className="flex items-center gap-1.5 mb-1">
                        <RiLockFill className="mb-1 text-[20px] text-white-smoke" />
                        <p className="flex items-center gap-1 text-[17px] font-bold text-white-smoke tracking-wide">
                          Geoblocking
                        </p>
                      </div>
                      <p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>
                    </div>
                    <div role="radiogroup" className="space-y-2">
                      {["worldwide", "exclusive", "blocked"].map((opt) => (
                        <label key={opt} className="flex cursor-not-allowed items-center gap-2 opacity-60">
                          <PrettyRadio
                            checked={geoblockingOption === opt}
                            onSelect={() => {
                              if (!isArtistPro) return;
                              setGeoblockingOption(opt);
                            }}
                          />
                          <span className="text-[15px] text-white-smoke">
                            {opt === "worldwide" ? "Worldwide" : opt === "exclusive" ? "Exclusive regions" : "Blocked regions"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </ProLockTooltip>
              )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio Clip */}
          <button onClick={() => toggleSection("audioClip")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <RxSpeakerLoud className="mt-1 text-[20px]" />
              </span>
              <div>
                <p className="text-[17px] font-semibold text-white-smoke">Audio clip</p>
                <p className="text-[14px] text-white-smoke mt-0.5">Pick the 20 second clip you'd like to use as your track preview. This will live on your feed and socials.</p>
              </div>
            </div>
            {expandedSections.audioClip ? <UpOutlined className="text-[13px] text-white-smoke" /> : <DownOutlined className="text-[13px] text-white-smoke" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.audioClip && (
              <motion.div
                key="audio-clip"
                initial={{ height: 0, opacity: 0, y: -6 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-b border-[#222]"
              >
                <div className="py-4">
                  <div className="relative overflow-hidden bg-chinese-black">
                    <div className="relative h-28 px-1.5 pt-3 sm:h-30 sm:px-2 sm:pt-6">
                      <div className="pointer-events-none absolute inset-0 opacity-85">
                        <div className="flex h-full w-full items-center gap-px px-1">
                          {baseWaveformBars}
                        </div>
                      </div>
                      <div className="pointer-events-none absolute bottom-0 left-1 right-1 top-1/2 bg-chinese-black/38" />
                      <div className="pointer-events-none absolute left-1 right-1 top-1/2 z-10 h-0.5 -translate-y-1/2 bg-chinese-black/80 shadow-[0_0_6px_rgba(0,0,0,0.35)]" />

                      {!canSetAudioPreview ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-chinese-black/55">
                          <p className="px-4 text-center text-[14px] font-semibold leading-tight text-white/85 sm:text-[22px]">
                            Can&apos;t set audio preview, because this track is shorter than preview time.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div
                            ref={clipLeftShadeRef}
                            className="pointer-events-none absolute inset-y-0 left-1 overflow-hidden"
                            style={{ width: `${clipLeftPercent}%` }}
                          >
                            <div ref={clipLeftShadeWaveRef} className="flex h-full items-center gap-px px-1">
                              {leftMaskedWaveformBars}
                            </div>
                          </div>
                          <div
                            ref={clipRightShadeRef}
                            className="pointer-events-none absolute inset-y-0 right-0"
                            style={{ width: `${rightShadePercent}%` }}
                          />

                          <div ref={clipTrackRef} className="absolute inset-y-0 left-1 right-1">
                            <div
                              ref={clipSelectionRef}
                              className={`absolute inset-y-0 z-30 cursor-grab overflow-hidden rounded-sm border border-white bg-transparent isolate will-change-transform ${isDraggingClip ? "cursor-grabbing" : ""}`}
                              style={{ left: `${clipLeftPercent}%`, width: `${clipWidthPercent}%`, touchAction: "none", transform: "translate3d(0px, 0, 0)" }}
                              onPointerDown={handleClipDragStart}
                            >
                              <div className="pointer-events-none absolute inset-px z-0 rounded-sm" 
                                  style={{ backgroundColor: isClipWindowAtZeroStart ? "var(--waveform-window-fill-zero)" : "var(--waveform-window-fill)" }} />
                              <div className="pointer-events-none absolute inset-px z-5 overflow-hidden rounded-sm">
                                <div className="flex h-full w-full items-center gap-px px-1 relative">
                                  {baseWaveformBars}
                                  <div
                                    className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 overflow-hidden rounded-l-sm"
                                    style={{ 
                                      backgroundColor: "var(--waveform-playback-mask)", 
                                      width: `${clipPlaybackOverlayPercent}%` 
                                    }}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleClipPlayPause();
                                }}
                                data-clip-control="true"
                                className="absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white-smoke text-chinese-black shadow-lg cursor-pointer sm:h-10 sm:w-10"
                                aria-label={isClipPlaying ? "Pause clip preview" : "Play clip preview"}
                              >
                                {isClipPlaying ? <FaPause className="text-[16px] sm:text-[20px]" /> : <FaPlay className="text-[16px] sm:text-[20px]" />}
                              </button>
                              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-2 bg-white-smoke sm:h-3" />
                              <div className="pointer-events-none absolute inset-0 z-30 rounded-sm border border-white-smoke" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-end justify-between border-t border-[#2a2a2a] px-2 pb-2 pt-2 sm:px-4 sm:pb-3">
                      <div className="flex min-w-14 flex-col gap-1 sm:min-w-16 sm:gap-1.5">
                        <input
                          value={isDraggingClip ? formatTimeLabel(clipDragDisplayRange?.start ?? safeClipStart) : audioClipStartDraft}
                          onChange={(e) => setAudioClipStartDraft(e.target.value)}
                          onBlur={() => void applyTypedClipTime("start")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void applyTypedClipTime("start");
                            }
                          }}
                          className="w-14 bg-transparent text-[16px] font-semibold leading-none text-white-smoke outline-none sm:w-18 sm:text-[22px]"
                          aria-label="Audio clip start time"
                        />
                        <span className="h-px w-10 bg-[#4a4a4a] sm:w-12" />
                      </div>
                      <div className="flex flex-col items-center justify-end gap-1 sm:gap-1.5">
                        {showClipResetButton ? (
                          <button
                            type="button"
                            onClick={handleClipReset}
                            className="rounded border border-white-smoke/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white-smoke hover:border-white-smoke hover:bg-white-smoke/10 cursor-pointer"
                          >
                            Reset
                          </button>
                        ) : (
                          <div className="h-5.75" />
                        )}
                      </div>
                      <div className="flex min-w-14 flex-col items-end gap-1 sm:min-w-16 sm:gap-1.5">
                        <input
                          value={isDraggingClip ? formatTimeLabel(clipDragDisplayRange?.end ?? safeClipEnd) : audioClipEndDraft}
                          onChange={(e) => setAudioClipEndDraft(e.target.value)}
                          onBlur={() => void applyTypedClipTime("end")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void applyTypedClipTime("end");
                            }
                          }}
                          className="w-14 bg-transparent text-right text-[16px] font-semibold leading-none text-white-smoke outline-none sm:w-18 sm:text-[22px]"
                          aria-label="Audio clip end time"
                        />
                        <span className="h-px w-10 bg-[#4a4a4a] sm:w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Licensing */}
          <button onClick={() => toggleSection("licensing")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <BsCcCircle className="mt-1 text-[20px]" />
              </span>
              <div>
                <p className="text-[17px] font-semibold text-white-smoke">Licensing</p>
                <p className="text-[14px] text-white-smoke mt-0.5">Enable Creative Commons licenses options.</p>
              </div>
            </div>
            {expandedSections.licensing ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.licensing && (
              <motion.div
                key="licensing"
                initial={{ height: 0, opacity: 0, y: -6 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-b border-[#222]"
              >
                <div className="py-4 space-y-4 pl-14 pr-2">
              {[
                {
                  value: "all-rights",
                  title: "All rights reserved",
                  desc: "By choosing All Rights Reserved, you ask that other creators not use your material. Copyright is automatically granted to you when you begin creating your work.",
                },
                {
                  value: "creative-commons",
                  title: "Creative Commons",
                  desc: "With Creative Commons licenses, creators have the choice to give up certain exclusive rights normally associated with copyright, while retaining others.",
                },
              ].map(({ value, title, desc }) => (
                <label key={value} className="flex cursor-pointer items-start gap-3">
                  <PrettyRadio
                    checked={licenseType === value}
                    onSelect={() => setLicenseType(value as "all-rights" | "creative-commons")}
                  />
                  <div>
                    <p className="text-[14px] font-semibold text-white-smoke">{title}</p>
                    <p className="mt-0.5 text-[13px] text-white-smoke">{desc}</p>
                  </div>
                </label>
              ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed z-100 bottom-0 left-0 right-0 border-t border-silver/25 bg-chinese-black/90 px-4 py-4 sm:px-6 sm:py-5">
        <div className="relative mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-center text-[11px] text-white-smoke sm:pointer-events-none sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            By uploading, you confirm that your sounds comply with our{" "}
            <button className="pointer-events-auto text-white-smoke underline cursor-pointer">Terms of Use</button>{" "}
            and you don't infringe anyone else's rights.
          </p>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#1db954] px-12 py-2 text-[13px] font-bold text-chines-black transition-colors hover:bg-[#1ed760] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Audio element */}
      {uploadedFileUrl && <audio ref={audioRef} src={uploadedFileUrl ?? undefined} onEnded={() => setIsPlaying(false)} />}
      {uploadedFileUrl && (
        <audio
          ref={clipAudioRef}
          src={uploadedFileUrl ?? undefined}
          onLoadedMetadata={handleClipMetadataLoaded}
          onTimeUpdate={handleClipTimeUpdate}
          onEnded={() => {
            const clipAudio = clipAudioRef.current;
            if (clipAudio) {
              clipAudio.currentTime = safeClipStart;
              clipAudio.play();
            }}
          }
        />
      )}
    </div>
  );
}

function ProLockTooltip({
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

  const hover = useHover(context, {
    move: false,
    delay: { open: 80, close: 70 },
  });

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
            <p className="text-[24px] font-semibold leading-none tracking-tight text-white-smoke">{text.title}</p>
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

function InfoTooltip({ text }: { text: { title: string; description: string } }) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: 100, close: 80 },
  });

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
            <p className="text-[16px] text-white-smoke font-semibold leading-none tracking-tight">{text.title}</p>
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