"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  GlobalOutlined,
  UserAddOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { IoToggleOutline } from "react-icons/io5";
import { RxSpeakerLoud } from "react-icons/rx";
import { BsCcCircle } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

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
  onReplaceTrackFile: (file: File) => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative shrink-0 h-6.5 w-11.5 rounded-full transition-colors duration-200 ${on ? "bg-[#1db954]" : "bg-[#333]"}`}
    >
      <div
        className={`absolute top-0.75 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5.75" : "translate-x-0.75"}`}
      />
    </button>
  );
}

export function TrackInfoForm(props: TrackInfoFormProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipAudioRef = useRef<HTMLAudioElement | null>(null);
  const clipTrackRef = useRef<HTMLDivElement | null>(null);
  const clipDragOffsetRef = useRef(0);
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
  const [releaseCalendarOpen, setReleaseCalendarOpen] = useState(false);
  const [releaseCalendarMonth, setReleaseCalendarMonth] = useState(() => new Date());
  const [audioClipStartInput, setAudioClipStartInput] = useState("0");
  const [audioClipEndInput, setAudioClipEndInput] = useState("20");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0);
  const [isClipPlaying, setIsClipPlaying] = useState(false);
  const [isDraggingClip, setIsDraggingClip] = useState(false);
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
    const movementScale = 1.2;

    setArtworkPosition({
      x: clampArtworkPosition(artworkPanStartRef.current.startX + (dx / width) * movementScale),
      y: clampArtworkPosition(artworkPanStartRef.current.startY - (dy / height) * movementScale),
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
      const centerX = imageWidth / 2 + clampArtworkPosition(position.x) * maxOffsetX;
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
  ];
  const audioGenres = [
    "Audiobooks",
    "Business",
    "Comedy",
    "Entertainment",
    "Learning",
    "News & Politics",
  ];

  const formatTimeLabel = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const m = Math.floor(safe / 60);
    const s = `${safe % 60}`.padStart(2, "0");
    return `${m}:${s}`;
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
    const parsedAudioClipStart = toOptionalTrimmed(audioClipStartInput);
    const parsedAudioClipEnd = toOptionalTrimmed(audioClipEndInput);
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
    if (audioClipStartValue !== undefined && (!Number.isFinite(audioClipStartValue) || audioClipStartValue < 0)) {
      throw new Error("Audio clip start must be a valid non-negative number.");
    }
    if (audioClipEndValue !== undefined && (!Number.isFinite(audioClipEndValue) || audioClipEndValue <= 0)) {
      throw new Error("Audio clip end must be a valid number greater than 0.");
    }
    if (
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
        audioClipStart: audioClipStartValue,
        audioClipEnd: audioClipEndValue,
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
    setVisibilityOption(isPublic ? "public" : "private");
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
        setGenreMenuOpen(false);
      }
      if (releaseCalendarRef.current && !releaseCalendarRef.current.contains(event.target as Node)) {
        setReleaseCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const clipStartSeconds = Number(audioClipStartInput);
  const clipEndSeconds = Number(audioClipEndInput);
  const safeClipStart = Number.isFinite(clipStartSeconds) ? Math.max(0, clipStartSeconds) : 0;
  const safeClipEnd = Number.isFinite(clipEndSeconds) ? Math.max(safeClipStart + 1, clipEndSeconds) : safeClipStart + 20;
  const clipDuration = Math.max(1, safeClipEnd - safeClipStart);
  const timelineMax = audioDurationSeconds > 0 ? Math.ceil(audioDurationSeconds) : Math.max(40, safeClipEnd + 20);
  const clipLeftPercent = Math.min(100, (safeClipStart / timelineMax) * 100);
  const clipWidthPercent = Math.max(5, Math.min(100 - clipLeftPercent, (clipDuration / timelineMax) * 100));
  const rightShadePercent = Math.max(0, 100 - (clipLeftPercent + clipWidthPercent));

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const xToSeconds = (clientX: number) => {
    const rect = clipTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return safeClipStart;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * timelineMax;
  };

  const setDraggedClipRange = (nextStart: number, nextEnd: number) => {
    setAudioClipStartInput(String(Math.round(nextStart)));
    setAudioClipEndInput(String(Math.round(nextEnd)));
  };

  const handleClipDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    clipDragOffsetRef.current = xToSeconds(event.clientX) - safeClipStart;
    setIsDraggingClip(true);
  };

  const handleClipPlayPause = async () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !uploadedFileUrl) return;

    if (isClipPlaying) {
      clipAudio.pause();
      setIsClipPlaying(false);
      return;
    }

    clipAudio.currentTime = safeClipStart;
    try {
      await clipAudio.play();
      setIsClipPlaying(true);
    } catch {
      setIsClipPlaying(false);
    }
  };

  const handleClipTimeUpdate = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio) return;
    if (clipAudio.currentTime >= safeClipEnd) {
      clipAudio.pause();
      clipAudio.currentTime = safeClipStart;
      setIsClipPlaying(false);
    }
  };

  useEffect(() => {
    if (!isDraggingClip) return;

    const onPointerMove = (event: PointerEvent) => {
      const rangeStart = xToSeconds(event.clientX) - clipDragOffsetRef.current;
      const boundedStart = clamp(rangeStart, 0, Math.max(0, timelineMax - clipDuration));
      const boundedEnd = boundedStart + clipDuration;
      setDraggedClipRange(boundedStart, boundedEnd);
    };

    const onPointerUp = () => setIsDraggingClip(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDraggingClip, timelineMax, clipDuration]);

  useEffect(() => {
    if (!uploadedFileUrl) {
      setAudioDurationSeconds(0);
      setIsClipPlaying(false);
      return;
    }
    const clipAudio = clipAudioRef.current;
    if (clipAudio) {
      clipAudio.pause();
      clipAudio.currentTime = 0;
    }
    setIsClipPlaying(false);
  }, [uploadedFileUrl]);

  const handleClipMetadataLoaded = () => {
    const clipAudio = clipAudioRef.current;
    if (!clipAudio || !Number.isFinite(clipAudio.duration) || clipAudio.duration <= 0) {
      return;
    }

    const duration = clipAudio.duration;
    setAudioDurationSeconds(duration);

    const boundedStart = clamp(safeClipStart, 0, Math.max(0, duration - 1));
    const boundedEnd = clamp(safeClipEnd, boundedStart + 1, Math.max(boundedStart + 1, duration));

    if (boundedStart !== safeClipStart || boundedEnd !== safeClipEnd) {
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-login px-4">
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
                      transform: `scale(${artworkZoom})`,
                      objectPosition: `${50 + artworkPosition.x * 50}% ${50 - artworkPosition.y * 50}%`,
                    }}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    unoptimized
                  />
                ) : (
                  <button type="button" onClick={handleArtworkPick} className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 cursor-pointer">
                    <PictureOutlined className="text-[36px] text-white-smoke transition-colors group-hover:text-black/60" />
                    <span className="text-[12px] font-semibold text-white-smoke transition-colors group-hover:text-black/60">Add new artwork</span>
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
                Track title <InfoCircleOutlined className="text-[10px] ml-0.5 normal-case" />
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
                Main Artist(s) <InfoCircleOutlined className="text-[10px] ml-0.5 normal-case" />
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
                <button
                  type="button"
                  onClick={() => setGenreMenuOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between border-b border-[#333] pb-2 pt-1 text-left"
                >
                  <span className={`text-[13px] ${genre ? "text-white-smoke" : "text-[#555]"}`}>
                    {genre || "Add or search for genre"}
                  </span>
                  <span className="flex items-center gap-3 text-white-smoke">
                    {genre && (
                      <CloseOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          setGenre("");
                        }}
                        className="text-[12px]"
                      />
                    )}
                    {genreMenuOpen ? <UpOutlined className="text-[11px]" /> : <DownOutlined className="text-[11px]" />}
                  </span>
                </button>
                {genreMenuOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-70 overflow-y-auto rounded border border-[#2f3035] bg-chinese-black shadow-xl">
                    <p className="px-4 py-2 text-[13px] text-white-smoke]">All music genres</p>
                    {musicGenres.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setGenre(item);
                          setGenreMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-[13px] text-white-smoke hover:bg-[#3a3b3f]"
                      >
                        {item}
                      </button>
                    ))}
                    <p className="border-t border-[#2a2b30] px-4 py-2 text-[13px] text-white-smoke">All audio genres</p>
                    {audioGenres.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setGenre(item);
                          setGenreMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-[13px] text-white-smoke hover:bg-[#3a3b3f]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>
                Tags <InfoCircleOutlined className="text-[10px] ml-0.5 normal-case" />
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
                rows={3}
                className={`${fieldCls} resize-none`}
              />
            </div>

            {/* Privacy */}
            <div className="rounded border border-[#2a2a2a] bg-chinese-black p-4" ref={privacyMenuRef}>
              <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chinese-black">
                  {visibilityOption === "public" ? (
                    <GlobalOutlined className="text-[14px] text-[#1db954]" />
                  ) : visibilityOption === "private" ? (
                    <LockOutlined className="text-[14px] text-white-smoke" />
                  ) : (
                    <UserAddOutlined className="text-[14px] text-white-smoke" />
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
                <button type="button" onClick={() => setPrivacyMenuOpen((prev) => !prev)} className="pt-1 text-text-white-smoke">
                  {privacyMenuOpen ? <UpOutlined /> : <DownOutlined />}
                </button>
              </div>

              {privacyMenuOpen && (
                <div className="mt-3 overflow-hidden rounded">
                  {[
                    {
                      value: "public" as const,
                      title: "Public",
                      desc: "Anyone can access and listen to this track.",
                      icon: <GlobalOutlined className="text-[14px] text-[#1db954]" />,
                    },
                    {
                      value: "private" as const,
                      title: "Private",
                      desc: "Track is not discoverable. Only people with private link can view and listen.",
                      icon: <LockOutlined className="text-[14px] text-white-smoke" />,
                    },
                    {
                      value: "followerExclusive" as const,
                      title: "Follower Exclusive",
                      desc: "Only those who follow you can access.",
                      icon: <UserAddOutlined className="text-[14px] text-white-smoke" />,
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setVisibilityOption(item.value);
                        setPrivacyMenuOpen(false);
                      }}
                      className={`grid w-full grid-cols-[2rem_1fr] items-start gap-x-3 px-3 py-3 text-left ${visibilityOption === item.value ? "bg-[#4a4b4d]" : "bg-chinese-black hover:bg-[#35363a]"}`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chinese-black">{item.icon}</span>
                      <span>
                        <p className="text-[13px] font-semibold text-white-smoke">{item.title}</p>
                        <p className="text-[11px] text-white-smoke">{item.desc}</p>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 border-t border-[#2a2a2a] pt-3">
                <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chinese-black">
                    <FaRegClock className="text-[12px] text-white-smoke" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white-smoke">
                      Schedule public release <span className="text-[#f5a623]">ARTIST PRO</span>
                    </p>
                    <p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
                  </div>
                  <Toggle on={scheduleRelease} onToggle={() => setScheduleRelease(!scheduleRelease)} />
                </div>
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
          {expandedSections.advancedDetails && (
            <div className="space-y-5 py-4 border-b border-[#222]">
              {[
                { label: "Buy link", value: buyLink, setter: setBuyLink, placeholder: "https://your-store.com/track" },
                { label: "Record label", value: recordLabel, setter: setRecordLabel, placeholder: "Label name" },
                { label: "Publisher", value: publisher, setter: setPublisher, placeholder: "Publisher name" },
                { label: "ISRC", value: isrc, setter: setIsrc, placeholder: "e.g. USRC12345678" },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className={fieldCls}
                  />
                </div>
              ))}
              <div>
                <label className={labelCls}>Release date</label>
                <div className="relative" ref={releaseCalendarRef}>
                  <input
                    type="text"
                    value={formatDisplayDate(releaseDate)}
                    readOnly
                    onClick={openReleaseCalendar}
                    placeholder="MM/DD/YYYY"
                    className={`${fieldCls} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setReleaseCalendarOpen((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-white-smoke/85 hover:text-white-smoke cursor-pointer"
                    aria-label="Open release date calendar"
                  >
                    <CalendarOutlined className="text-[13px]" />
                  </button>

                  {releaseCalendarOpen && (
                    <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-md border border-[#2f3035] bg-chinese-black p-3 shadow-xl sm:left-auto sm:right-0 sm:w-72">
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
              <div>
                <label className={labelCls}>Contains explicit content</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={explicitContent}
                    onChange={(e) => setExplicitContent(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#444] bg-chinses-black accent-[#1db954]"
                  />
                  <span className="text-[12px] text-white-smoke">Explicit content</span>
                </label>
              </div>
              <div>
                <label className={labelCls}>P line</label>
                <input
                  type="text"
                  value={pline}
                  onChange={(e) => setPline(e.target.value)}
                  placeholder="℗ 2026 Your Name"
                  className={fieldCls}
                />
              </div>
            </div>
          )}

          {/* Permissions */}
          <button onClick={() => toggleSection("permissions")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <IoToggleOutline className="text-[17px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white-smoke">Permissions</p>
                <p className="text-[11px] text-white-smoke mt-0.5">Control the visibility of engagements on your track, direct downloads, and more.</p>
              </div>
            </div>
            {expandedSections.permissions ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          {expandedSections.permissions && (
            <div className="space-y-4 py-4 border-b border-[#222]">
              <div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
                <p className="text-[11px] font-bold text-white-smoke uppercase tracking-wide">Access settings</p>
                {[
                  { label: "Enable direct downloads", desc: "Allow listeners to download the original audio file.", val: enableDownloads, set: setEnableDownloads },
                  { label: "Offline listening", desc: "Allows this track to be played on devices without an internet connection.", val: offlineListening, set: setOfflineListening },
                  { label: "Include in RSS feed", desc: 'Choose whether you want this track to show up in the "Feed" tab.', val: includeRssFeed, set: setIncludeRssFeed },
                  { label: "Display embed code", desc: "Choose whether you want this track's embedded player code to be displayed publicly.", val: displayEmbedCode, set: setDisplayEmbedCode },
                  { label: "Enable app playback", desc: "Choose whether you want this track to be playable outside the app.", val: enableAppPlayback, set: setEnableAppPlayback },
                ].map(({ label, desc, val, set }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold text-white-smoke">{label}</p>
                      <p className="text-[11px] text-white-smoke">{desc}</p>
                    </div>
                    <Toggle on={val} onToggle={() => set(!val)} />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
                <p className="text-[11px] font-bold text-white-smoke uppercase tracking-wide">Engagement privacy</p>
                {[
                  { label: "Allow people to comment on your track", val: allowComments, set: setAllowComments },
                  { label: "Show track comments to public", val: showTrackComments, set: setShowTrackComments },
                  { label: "Show track insights to public", val: showTrackInsights, set: setShowTrackInsights },
                ].map(({ label, val, set }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <LockOutlined className="text-[11px] text-white-smoke" />
                      <p className="text-[12px] font-semibold text-white-smoke">{label}</p>
                    </div>
                    <Toggle on={val} onToggle={() => set(!val)} />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <LockOutlined className="text-[11px] text-white-smoke" />
                  <p className="text-[11px] font-bold text-white-smoke uppercase tracking-wide">Geoblocking</p>
                </div>
                <p className="mb-3 text-[11px] text-white-smoke">Customize what countries your track will be available in.</p>
                <div className="space-y-2">
                  {["worldwide", "exclusive", "blocked"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="geoblocking"
                        value={opt}
                        checked={geoblockingOption === opt}
                        onChange={(e) => setGeoblockingOption(e.target.value)}
                        className="h-3.5 w-3.5 accent-[#1db954]"
                      />
                      <span className="text-[12px] text-white-smoke">
                        {opt === "worldwide" ? "Worldwide" : opt === "exclusive" ? "Exclusive regions" : "Blocked regions"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audio Clip */}
          <button onClick={() => toggleSection("audioClip")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <RxSpeakerLoud className="text-[17px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white-smoke">Audio clip</p>
                <p className="text-[11px] text-white-smoke mt-0.5">Pick the 20 second clip you'd like to use as your track preview. This will live on your feed and socials.</p>
              </div>
            </div>
            {expandedSections.audioClip ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          {expandedSections.audioClip && (
            <div className="py-4 border-b border-[#222]">
              <div className="h-20 rounded bg-chinese-black flex items-center justify-center">
                <p className="text-[12px] text-white-smoke text-center px-4">
                  Can't set audio preview — this track is shorter than the preview time.
                </p>
              </div>
            </div>
          )}

          {/* Licensing */}
          <button onClick={() => toggleSection("licensing")} className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
                <BsCcCircle className="text-[17px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white-smoke">Licensing</p>
                <p className="text-[11px] text-white-smoke mt-0.5">Enable Creative Commons licenses options.</p>
              </div>
            </div>
            {expandedSections.licensing ? <UpOutlined className="text-[11px] text-white-smoke" /> : <DownOutlined className="text-[11px] text-white-smoke" />}
          </button>
          {expandedSections.licensing && (
            <div className="py-4 space-y-4 border-b border-[#222]">
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
                  <input
                    type="radio"
                    name="license"
                    value={value}
                    checked={licenseType === value}
                    onChange={(e) => setLicenseType(e.target.value as "all-rights" | "creative-commons")}
                    className="mt-0.5 h-3.5 w-3.5 accent-[#1db954]"
                  />
                  <div>
                    <p className="text-[12px] font-semibold text-white-smoke">{title}</p>
                    <p className="mt-0.5 text-[11px] text-white-smoke">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-silver/25 bg-chinese-black/90 px-4 py-4 sm:px-6 sm:py-5">
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
          onEnded={() => setIsClipPlaying(false)}
        />
      )}
    </div>
  );
}