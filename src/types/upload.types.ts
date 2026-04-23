export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadedFile {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  estimatedMinutes: number;
  errorMessage?: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface MicrophoneDevice {
  deviceId: string;
  label: string;
}

export interface RecordingSegment {
  id: string;
  duration: number;
  timestamp: number;
}


export const ALLOWED_EXTENSIONS = ["wav", "flac", "aiff", "aif", "alac", "m4a", "mp3", "ogg", "webm", "aac", "wma"];
const maxUploadMbRaw = Number(100);
const maxUploadMb = Number.isFinite(maxUploadMbRaw) && maxUploadMbRaw > 0 ? maxUploadMbRaw : 4 * 1024;
export const MAX_FILE_SIZE_BYTES = Math.floor(maxUploadMb * 1024 * 1024);
export const TOTAL_TRACK_LIMIT = 3;
export const MAX_RECORDING_SECONDS = 180;
export const UNDO_SEGMENT_SECONDS = 5;

export const BYTES_PER_MINUTE_BY_EXT: Record<string, number> = {
  wav: 10_000_000,
  flac: 6_000_000,
  aiff: 10_000_000,
  aif: 10_000_000,
  alac: 6_000_000,
  m4a: 2_000_000,
};


export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return (bytes / 1e3).toFixed(0) + " KB";
}

export function estimateMinutes(file: File): number {
  const ext = getExtension(file.name);
  const bpm = BYTES_PER_MINUTE_BY_EXT[ext] ?? 8_000_000;
  return Math.max(0.1, file.size / bpm);
}

export function formatRecordingTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}