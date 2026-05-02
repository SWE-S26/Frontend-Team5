"use client";

import Image from "next/image";
import UploadIconBlack from "../../../../public/upload-icon/upload-black.svg";
import UploadIconWhite from "../../../../public/upload-icon/upload-white.svg";
import { useRouter } from "next/navigation";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  CloseOutlined,
} from "@ant-design/icons";
import {
  UploadedFile,
  Toast,
  MicrophoneDevice,
  RecordingSegment,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  TOTAL_TRACK_LIMIT,
  MAX_RECORDING_SECONDS,
  UNDO_SEGMENT_SECONDS,
  generateId,
  getExtension,
  estimateMinutes,
  formatBytes,
} from "@/types/upload.types";
import { MicrophoneSection } from "@/components/upload/MicrophoneSection";
import { TrackInfoForm } from "@/components/upload/TrackInfoForm";
import { useAppSelector } from "@/store/hooks";
import { consumePendingUploadAudioFile } from "@/lib/pendingUploadAudio";
import UploadUsageBar from "@/app/(artist)/upload/UploadUsageBar";
import { useGetUploadQuota } from "@/hooks/useTracks";

function encodeAudioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const bufferLength = 44 + numFrames * blockAlign;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numFrames * blockAlign, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numFrames * blockAlign, true);

  let offset = 44;
  const channelData = Array.from({ length: numChannels }, (_, ch) => buffer.getChannelData(ch));
  for (let frame = 0; frame < numFrames; frame += 1) {
    for (let ch = 0; ch < numChannels; ch += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][frame]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function mergeRecordingBlobs(previousBlob: Blob, nextBlob: Blob): Promise<Blob> {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    return new Blob([previousBlob, nextBlob], {
      type: previousBlob.type || nextBlob.type || "audio/webm",
    });
  }

  const decodeContext = new AudioCtx();
  try {
    const [prevArrayBuffer, nextArrayBuffer] = await Promise.all([
      previousBlob.arrayBuffer(),
      nextBlob.arrayBuffer(),
    ]);
    const [prevBuffer, nextBuffer] = await Promise.all([
      decodeContext.decodeAudioData(prevArrayBuffer.slice(0)),
      decodeContext.decodeAudioData(nextArrayBuffer.slice(0)),
    ]);

    const mergedDuration = prevBuffer.duration + nextBuffer.duration;
    const mergedSampleRate = Math.max(prevBuffer.sampleRate, nextBuffer.sampleRate);
    const mergedChannels = Math.max(prevBuffer.numberOfChannels, nextBuffer.numberOfChannels);
    const offline = new OfflineAudioContext(
      mergedChannels,
      Math.ceil(mergedDuration * mergedSampleRate),
      mergedSampleRate
    );

    const prevSource = offline.createBufferSource();
    prevSource.buffer = prevBuffer;
    prevSource.connect(offline.destination);
    prevSource.start(0);

    const nextSource = offline.createBufferSource();
    nextSource.buffer = nextBuffer;
    nextSource.connect(offline.destination);
    nextSource.start(prevBuffer.duration);

    const rendered = await offline.startRendering();
    return encodeAudioBufferToWav(rendered);
  } catch {
    return new Blob([previousBlob, nextBlob], {
      type: previousBlob.type || nextBlob.type || "audio/webm",
    });
  } finally {
    void decodeContext.close();
  }
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const micDropdownRef = useRef<HTMLDivElement>(null);

  // Audio ref for recording preview playback
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackProgressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const authDisplayName = useAppSelector((state) => state.auth.displayName);
  const authProfileLink = useAppSelector((state) => state.auth.profileLink);
  const role = useAppSelector((state) => state.auth.role);
  const isArtistPro = role === "Pro";
  const { getUploadQuota, quota } = useGetUploadQuota();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showTrackInfo, setShowTrackInfo] = useState(false);
  
  // Upload state for the form
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Uploaded file preview URL used in Track Info form
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  // Recording state
  const [micOpen, setMicOpen] = useState(false);
  const [micDropdownOpen, setMicDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [microphones, setMicrophones] = useState<MicrophoneDevice[]>([]);
  const [selectedMicId, setSelectedMicId] = useState("default");
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [recordingSegments, setRecordingSegments] = useState<RecordingSegment[]>([]);
  const [undoneSegments, setUndoneSegments] = useState<RecordingSegment[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const segmentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mergedRecordingBlobRef = useRef<Blob | null>(null);
  const recordingSecondsRef = useRef(0);

  // Track Info form state
  const [trackTitle, setTrackTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [permalink, setPermalink] = useState("https://beatza.me/");
  const [genre, setGenre] = useState("");
    const artistNameInitializedRef = useRef(false);
    const permalinkInitializedRef = useRef(false);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [scheduleRelease, setScheduleRelease] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    advancedDetails: false,
    permissions: false,
    audioClip: false,
    licensing: false,
  });
  const [buyLink, setBuyLink] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isrc, setIsrc] = useState("");
  const [explicitContent, setExplicitContent] = useState(false);
  const [pline, setPline] = useState("");
  const [enableDownloads, setEnableDownloads] = useState(false);
  const [offlineListening, setOfflineListening] = useState(true);
  const [includeRssFeed, setIncludeRssFeed] = useState(true);
  const [displayEmbedCode, setDisplayEmbedCode] = useState(true);
  const [enableAppPlayback, setEnableAppPlayback] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [showTrackComments, setShowTrackComments] = useState(true);
  const [showTrackInsights, setShowTrackInsights] = useState(true);
  const [geoblockingOption, setGeoblockingOption] = useState("worldwide");
  const [licenseType, setLicenseType] = useState<"all-rights" | "creative-commons">("all-rights");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [recordingDurationSeconds, setRecordingDurationSeconds] = useState(0);

  const uploadedTracksCount = uploadedFiles
    .filter((f) => f.status === "done")
    .length;
  const serverQuota = quota ?? TOTAL_TRACK_LIMIT;
  const totalTrackQuota = Math.max(1, serverQuota);
  const usedTracks = Math.max(0, Math.min(totalTrackQuota, uploadedTracksCount));
  const usagePercent = Math.min(100, (usedTracks / totalTrackQuota) * 100);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  function validateFile(file: File): string | null {
    const ext = getExtension(file.name);
    const hasSupportedExtension = ALLOWED_EXTENSIONS.includes(ext);
    const hasAudioMimeType = file.type.startsWith("audio/");
    if (!hasSupportedExtension && !hasAudioMimeType)
      return `"${file.name}" is not a supported audio format.`;
    if (file.size > MAX_FILE_SIZE_BYTES)
      return `"${file.name}" exceeds the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`;
    return null;
  }

  function simulateUpload(id: string) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: "done" } : f));
      } else {
        setUploadedFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: Math.round(progress) } : f));
      }
    }, 300);
  }

  function startFormUploadProgress() {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 11 + 4;
        if (next >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return next;
      });
    }, 220);
  }

  // Process files: validate, register, create playback URL, pre-fill title
  function processFiles(files: File[], navigateToForm = false, replaceCurrent = false) {
    const valid: File[] = [];

    const nextEntries: UploadedFile[] = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) { addToast("error", error); continue; }
      valid.push(file);

      const entry: UploadedFile = {
        id: generateId(), file, status: "uploading", progress: 0, estimatedMinutes: estimateMinutes(file),
      };
      nextEntries.push(entry);

      // Create a local URL for the header play button
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
      const url = URL.createObjectURL(file);
      setUploadedFileUrl(url);

      // Pre-fill track title from filename (strip extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTrackTitle(nameWithoutExt);
    }

    if (nextEntries.length > 0) {
      setUploadedFiles((prev) => (replaceCurrent ? nextEntries : [...prev, ...nextEntries]));
      nextEntries.forEach((entry) => simulateUpload(entry.id));
    }

    if (navigateToForm && valid.length > 0) {
      setShowTrackInfo(true);
      startFormUploadProgress();
    }
  }

  useEffect(() => {
    const pending = consumePendingUploadAudioFile();
    if (!pending) return;
    processFiles([pending], true, true);
  }, []);

  useEffect(() => {
    void getUploadQuota().catch(() => undefined);
  }, [getUploadQuota]);

  const hasAtLeastOneSupportedAudioFile = (files: File[]) => {
    return files.some((file) => {
      const ext = getExtension(file.name);
      return ALLOWED_EXTENSIONS.includes(ext) || file.type.startsWith("audio/");
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    if (!hasAtLeastOneSupportedAudioFile(files)) {
      addToast("error", "Drop audio files only.");
      return;
    }
    processFiles(files, true);
  }, []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length && !hasAtLeastOneSupportedAudioFile(files)) {
      addToast("error", "Choose audio files only.");
      e.target.value = "";
      return;
    }
    if (files.length) processFiles(files, true);
    e.target.value = "";
  };

  const getMicrophones = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}...` }));
      if (audioInputs.length > 0) { setMicrophones(audioInputs); setSelectedMicId(audioInputs[0].deviceId); }
    } catch (err) { console.error("Error getting microphones:", err); }
  };

  const createSegment = (): RecordingSegment => ({
    id: generateId(), duration: UNDO_SEGMENT_SECONDS, timestamp: Date.now(),
  });

  const startRecording = async () => {
    setMicError(null);
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId && selectedMicId !== "default" ? { deviceId: { exact: selectedMicId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      if (!isPaused && !isPreviewMode && !hasRecording) {
        mergedRecordingBlobRef.current = null;
        setRecordingDurationSeconds(0);
      }

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const sessionBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const combinedBlob = mergedRecordingBlobRef.current
          ? await mergeRecordingBlobs(mergedRecordingBlobRef.current, sessionBlob)
          : sessionBlob;

        mergedRecordingBlobRef.current = combinedBlob;
        setRecordingBlob(combinedBlob);
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const url = URL.createObjectURL(combinedBlob);
        setAudioUrl(url);
        setRecordingDurationSeconds(Math.max(recordingSecondsRef.current, 0.1));
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const recFileExt = combinedBlob.type.includes("wav") ? "wav" : "webm";
        const recFileName = `recording-${timestamp}.${recFileExt}`;
        const file = new File([combinedBlob], recFileName, {
          type: combinedBlob.type || "audio/webm",
        });
        
        // Process file for upload simulation
        processFiles([file], false);
        setHasRecording(true);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true); 
      setIsPaused(false);

      if (!hasRecording && !isPreviewMode) {
        setRecordingSeconds(0);
        setRecordingSegments([]);
        setUndoneSegments([]);
      }

      setHasRecording(false);
      setAudioUrl(null);
      setIsPreviewMode(false);

      segmentTimerRef.current = setInterval(() => {
        setRecordingSegments((prev) => [...prev, createSegment()]);
      }, UNDO_SEGMENT_SECONDS * 1000);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          const ns = s + 0.1;
          if (ns >= MAX_RECORDING_SECONDS) { handleStopAndUpload(); return MAX_RECORDING_SECONDS; }
          return ns;
        });
      }, 100);
    } catch {
      setMicError("Microphone access denied. Please allow microphone access in your browser settings.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false); 
      setIsRecording(true);
      
      // Restart timer from current value
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          const ns = s + 0.1;
          if (ns >= MAX_RECORDING_SECONDS) { handleStopAndUpload(); return MAX_RECORDING_SECONDS; }
          return ns;
        });
      }, 100);

      segmentTimerRef.current = setInterval(() => {
        setRecordingSegments((prev) => [...prev, createSegment()]);
      }, UNDO_SEGMENT_SECONDS * 1000);
    } else if (!mediaRecorderRef.current && (isPaused || isPreviewMode || hasRecording)) {
      // If recorder was stopped, start a new one but keep the timer going
      // This requires a new stream, so we might lose audio continuity but keep the "session" visual
      startRecording();
    }
  };

  const togglePauseResume = () => { if (isPaused) resumeRecording(); else pauseRecording(); };

  const handleStopAndUpload = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")
      mediaRecorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
    setIsRecording(false); 
    setIsPaused(false);
    setIsPreviewMode(true);
  };

  const handleCheckmark = () => {
    // Stop the recording to generate the Blob for preview
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
    
    setIsRecording(false);
    setIsPaused(false);
    setIsPreviewMode(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setRecordingDurationSeconds(0);
    if (recordingAudioRef.current) {
      recordingAudioRef.current.currentTime = 0;
    }
  };

  const handleUndo = () => {
    if (!isPaused || recordingSegments.length === 0) return;
    const last = recordingSegments[recordingSegments.length - 1];
    setRecordingSegments((prev) => prev.slice(0, -1));
    setUndoneSegments((prev) => [last, ...prev]);
    setRecordingSeconds((prev) => Math.max(0, prev - last.duration));
  };

  const handleRedo = () => {
    if (!isPaused || undoneSegments.length === 0) return;
    const first = undoneSegments[0];
    setUndoneSegments((prev) => prev.slice(1));
    setRecordingSegments((prev) => [...prev, first]);
    setRecordingSeconds((prev) => prev + first.duration);
  };

  const handleDeleteRecording = () => {
    setHasRecording(false); 
    setRecordingSeconds(0); // Reset only on full delete
    setRecordingSegments([]); 
    setUndoneSegments([]);
    setIsPaused(false); 
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
    setAudioUrl(null); 
    setRecordingBlob(null);
    mergedRecordingBlobRef.current = null;
    audioChunksRef.current = [];
    recordingSecondsRef.current = 0;
    setRecordingDurationSeconds(0);
    setIsPlaying(false); 
    setCurrentTime(0);
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.currentTime = 0;
    }
  };

  const handleBackToRecording = () => {
    setIsPreviewMode(false);
    setIsPlaying(false);
    if (playbackProgressIntervalRef.current) {
      clearInterval(playbackProgressIntervalRef.current);
      playbackProgressIntervalRef.current = null;
    }
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.currentTime = 0;
    }
    resumeRecording();
  };

  const togglePlayPause = () => {
    if (!recordingAudioRef.current) return;
    const audioEl = recordingAudioRef.current;

    const stopPreviewProgressLoop = () => {
      if (playbackProgressIntervalRef.current) {
        clearInterval(playbackProgressIntervalRef.current);
        playbackProgressIntervalRef.current = null;
      }
    };

    const startPreviewProgressLoop = () => {
      stopPreviewProgressLoop();
      playbackProgressIntervalRef.current = setInterval(() => {
        if (!recordingAudioRef.current) return;
        setCurrentTime(recordingAudioRef.current.currentTime);
        if (recordingAudioRef.current.paused || recordingAudioRef.current.ended) {
          stopPreviewProgressLoop();
        }
      }, 50);
    };

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
      stopPreviewProgressLoop();
    } else {
      const duration = recordingDurationSeconds > 0
        ? recordingDurationSeconds
        : (Number.isFinite(audioEl.duration) ? audioEl.duration : 0);
      const nearEnd = duration > 0 && currentTime >= duration - 0.05;
      if (nearEnd) {
        audioEl.currentTime = 0;
        setCurrentTime(0);
      }
      void audioEl.play();
      setIsPlaying(true);
      startPreviewProgressLoop();
    }
  };

  const handleAudioTimeUpdate = () => {
    if (recordingAudioRef.current) setCurrentTime(recordingAudioRef.current.currentTime);
  };

  // Mic-section "Upload" button → go to form and start upload simulation
  const handleUpload = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")
      mediaRecorderRef.current.stop();

    setShowTrackInfo(true);
    startFormUploadProgress();
  };

  const handleReplaceTrackFile = (file: File) => {
    processFiles([file], false, true);
    setShowTrackInfo(true);
    startFormUploadProgress();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    recordingSecondsRef.current = recordingSeconds;
  }, [recordingSeconds]);

  useEffect(() => {
    if (!artistNameInitializedRef.current && authDisplayName) {
      setArtistName(authDisplayName);
      artistNameInitializedRef.current = true;
    }
  }, [authDisplayName]);

  useEffect(() => {
    if (permalinkInitializedRef.current) return;

    const profileSlug = (authProfileLink ?? "").trim();
    if (profileSlug) {
      setPermalink(`https://beatza.me/${profileSlug}/`);
      permalinkInitializedRef.current = true;
      return;
    }

    if (authDisplayName) {
      setPermalink(`https://beatza.me/${slugify(authDisplayName)}/`);
      permalinkInitializedRef.current = true;
    }
  }, [authDisplayName, authProfileLink]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      if (playbackProgressIntervalRef.current) {
        clearInterval(playbackProgressIntervalRef.current);
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (micDropdownRef.current && !micDropdownRef.current.contains(event.target as Node))
        setMicDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const liveRecordingProgressPercent = Math.min(100, (recordingSeconds / MAX_RECORDING_SECONDS) * 100);
  const audioElementDuration = recordingAudioRef.current?.duration;
  const previewDurationSeconds = Number.isFinite(audioElementDuration) && (audioElementDuration ?? 0) > 0
    ? (audioElementDuration as number)
    : recordingDurationSeconds > 0
      ? recordingDurationSeconds
      : Math.max(recordingSeconds, 0.1);
  const previewProgressPercent = Math.min(100, (currentTime / previewDurationSeconds) * 100);
  const progressPercent = isPreviewMode ? previewProgressPercent : liveRecordingProgressPercent;
  const displayToolbarSeconds = isPreviewMode ? currentTime : recordingSeconds;
  const canUndo = isPaused && recordingSegments.length > 0;
  const canRedo = isPaused && undoneSegments.length > 0;
  const canDelete = isPaused && (recordingSegments.length > 0 || recordingSeconds > 0);
  const canConfirm = isPaused;
  const footerLinks = ["Legal", "Privacy", "Cookie Policy", "Cookie Manager", "Imprint", "About us", "Copyright", "Feedback"];
  
  const currentFile = uploadedFiles.length > 0 ? uploadedFiles[uploadedFiles.length - 1] : null;
  const currentFileName = currentFile?.file.name ?? "recording.wav";

  // ── Track Info Form ──
  if (showTrackInfo) {
    return (
      <>
        <TrackInfoForm
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          currentFileName={currentFileName}
          currentFile={currentFile?.file ?? null}
          uploadedFileUrl={uploadedFileUrl}
          trackTitle={trackTitle} setTrackTitle={setTrackTitle}
          artistName={artistName} setArtistName={setArtistName}
          genre={genre} setGenre={setGenre}
          tags={tags} setTags={setTags}
          description={description} setDescription={setDescription}
          isPublic={isPublic} setIsPublic={setIsPublic}
          scheduleRelease={scheduleRelease} setScheduleRelease={setScheduleRelease}
          expandedSections={expandedSections} toggleSection={toggleSection}
          buyLink={buyLink} setBuyLink={setBuyLink}
          recordLabel={recordLabel} setRecordLabel={setRecordLabel}
          releaseDate={releaseDate} setReleaseDate={setReleaseDate}
          publisher={publisher} setPublisher={setPublisher}
          isrc={isrc} setIsrc={setIsrc}
          explicitContent={explicitContent} setExplicitContent={setExplicitContent}
          pline={pline} setPline={setPline}
          enableDownloads={enableDownloads} setEnableDownloads={setEnableDownloads}
          offlineListening={offlineListening} setOfflineListening={setOfflineListening}
          includeRssFeed={includeRssFeed} setIncludeRssFeed={setIncludeRssFeed}
          displayEmbedCode={displayEmbedCode} setDisplayEmbedCode={setDisplayEmbedCode}
          enableAppPlayback={enableAppPlayback} setEnableAppPlayback={setEnableAppPlayback}
          allowComments={allowComments} setAllowComments={setAllowComments}
          showTrackComments={showTrackComments} setShowTrackComments={setShowTrackComments}
          showTrackInsights={showTrackInsights} setShowTrackInsights={setShowTrackInsights}
          geoblockingOption={geoblockingOption} setGeoblockingOption={setGeoblockingOption}
          licenseType={licenseType} setLicenseType={setLicenseType}
          permalink={permalink}
          setPermalink={setPermalink}
          isArtistPro={isArtistPro}
          onReplaceTrackFile={handleReplaceTrackFile}
        />
      </>
    );
  }

  // ── Main Upload view ──
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-chinese-black text-white-smoke antialiased">
      <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rounded-md border border-silver/30 bg-off-black px-3 py-2 text-[12px] text-white-smoke shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full flex-1 flex-col px-4 pb-28 pt-3 sm:px-8 lg:px-14">
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/home")}
              data-testid="upload-nav-home"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90 cursor-pointer"
              aria-label="Go to home"
            >
              <Image src="/app-logo/whitelogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-dark" priority />
              <Image src="/app-logo/blacklogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-light" priority />
            </button>
            <span className="text-[16px] font-black tracking-[-0.03em]">Upload</span>
          </div>

          <button
            onClick={() => router.push("/artists")}
            data-testid="upload-nav-close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-off-black text-[14px] text-silver transition-colors hover:bg-back cursor-pointer"
            aria-label="Close upload"
          >
            <CloseOutlined />
          </button>
        </div>

        <main className="mx-auto max-w-6xl mt-5 w-full flex-1">
        <UploadUsageBar
          usedTracks={usedTracks}
          totalTracks={totalTrackQuota}
          usagePercent={usagePercent}
          isArtistPro={isArtistPro}
          onUpgradeClick={() => router.push("/artist")}
        />

        <section className="mt-8">
          <h1 className="pb-2 text-[24px] font-black tracking-[-0.03em] text-white-smoke sm:text-[28px]">Upload your audio files.</h1>
          <p className="mt-2 pb-2 text-[14px] font-semibold leading-relaxed text-white-smoke/90">
            For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size is 4GB uncompressed.
            <button type="button" data-testid="upload-learn-more" className="ml-1 border-b border-silver pb-px text-[14px] font-semibold text-white-smoke cursor-pointer">Learn more.</button>
          </p>

          <input
            id="main-upload-audio-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.wav,.flac,.aiff,.aif,.alac,.m4a,.mp3"
            className="hidden"
            onChange={handleFileSelect}
            data-testid="upload-file-input"
          />

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-testid="upload-drop-zone"
            className={`mt-6 rounded-md border border-dashed px-5 py-16 transition-colors hover:border-white-smoke sm:px-12 sm:py-20 cursor-pointer
              ${isDragging ? "border-white-smoke bg-chinese-black" : "border-off-black bg-chinese-black"}`}
          >
            <div onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()} data-testid="upload-drop-click" className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="mb-6">
                <Image
                  src={UploadIconWhite}
                  alt="Upload icon"
                  className="logo-dark"
                  width={74}
                  height={74}
                />
                <Image
                  src={UploadIconBlack}
                  alt="Upload icon"
                  className="logo-light"
                  width={74}
                  height={74}
                />
              </div>
              <p className="text-[16px] font-bold text-white-smoke">
                {isDragging ? "Drop audio files here." : "Drag and drop audio files to get started."}
              </p>
              <label
                data-testid="upload-choose-files"
                className="mt-6 rounded-full bg-white-smoke px-7 py-2 text-[14px] border font-bold text-chinese-black transition-opacity hover:opacity-90 cursor-pointer"
              >
                Choose files
              </label>
            </div>
          </div>

          {/* Microphone Section */}
          <MicrophoneSection
            micOpen={micOpen} setMicOpen={setMicOpen}
            micDropdownRef={micDropdownRef}
            micDropdownOpen={micDropdownOpen} setMicDropdownOpen={setMicDropdownOpen}
            isRecording={isRecording} isPaused={isPaused}
            hasRecording={hasRecording} isPreviewMode={isPreviewMode}
            isPlaying={isPlaying} recordingSeconds={displayToolbarSeconds}
            progressPercent={progressPercent} microphones={microphones}
            selectedMicId={selectedMicId}
            canUndo={canUndo} canRedo={canRedo} canDelete={canDelete} canConfirm={canConfirm}
            getMicrophones={getMicrophones}
            handleMicSelect={(deviceId) => {
              setSelectedMicId(deviceId);
              setMicDropdownOpen(false);
            }}
            startRecording={startRecording} togglePauseResume={togglePauseResume}
            resumeRecording={resumeRecording} handleStopAndUpload={handleStopAndUpload}
            handleCheckmark={handleCheckmark} handleUndo={handleUndo} handleRedo={handleRedo}
            handleDeleteRecording={handleDeleteRecording} handleBackToRecording={handleBackToRecording}
            handleClearAndRestart={handleDeleteRecording}
            handleUpload={handleUpload} togglePlayPause={togglePlayPause}
          />
        </section>
      </main>

      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 min-h-15 border-t border-silver/15 bg-chinese-black/90 py-2 text-center text-[12px] text-white-smoke">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center px-4 sm:px-8 lg:px-14">
          <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-2">
            {footerLinks.map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                {index > 0 && <span className="text-[#666873]">-</span>}
                <button type="button" data-testid={`upload-footer-${label.toLowerCase().replace(/\s+/g, "-")}`} className="transition-colors hover:text-[#e8e8ec] cursor-pointer">{label}</button>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Recording preview audio */}
      {audioUrl && (
        <audio className="hidden" ref={recordingAudioRef} src={audioUrl}
          onLoadedMetadata={() => {
            if (recordingAudioRef.current) {
              const duration = recordingAudioRef.current.duration;
              setRecordingDurationSeconds(
                Number.isFinite(duration) && duration > 0 ? duration : recordingSecondsRef.current
              );
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (playbackProgressIntervalRef.current) {
              clearInterval(playbackProgressIntervalRef.current);
              playbackProgressIntervalRef.current = null;
            }
            if (recordingAudioRef.current) {
              recordingAudioRef.current.currentTime = 0;
            }
          }}
          onTimeUpdate={handleAudioTimeUpdate} />
      )}
    </div>
  );
}